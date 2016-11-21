"use strict";
var secrets = require('../../config/secrets');
var socketioJwt = require('socketio-jwt');
var User = require('../models/User');

var userIds = {};

var Socket = {
  isSocketIdConnected: function(id, io){
    if(io.sockets.connected[id] != undefined){
      return io.sockets.connected[id].connected; //or disconected property
    }else{
      return false;
    }
  },

  broadcastStatusToFriends: function(user, status){
    user.friends.forEach(function(friend, index) {
      var recipient = userIds[friend.email];
      io.to(recipient).emit('friend status', status);
    });
  },

  handleAddFriendRequest: function(from, to, cb){
    User.findOne({ email: from.toLowerCase() }, function(err, existingUser) {
      if (existingUser) {
        User.findOne({ email: to.toLowerCase() }, function(err, toUser) {
          toUser.addFriendInvite(existingUser, cb);
        });
      } else {
        cb({error: "no user found with that username!"});
      }
    });
  },

  setIo: function(io){
    io.on("connection", socketioJwt.authorize({
      secret: secrets.jwt.secretOrKey,
      timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', function(socket) {

      //this socket is authenticated, we are good to handle more events from it.
      var user = socket.decoded_token.email;
      console.log('signed in: ' + user);
      userIds[socket.decoded_token.email] = socket.id;

      //grab a reference to the user
      User.findOne({ email: user.toLowerCase() }).populate('pending_friends', 'email username').exec(function(err, user) {
        //send to the client all outstanding friend requests
        socket.emit("friend:requests", {requests: user.pending_friends});
      });

      /*
       * Event Handlers
       */

      socket.on('user:show all:request', function(msg){
        //send all users to the connecting user
        //todo only show friends
        User.find({}, "email username", function(err, users) {
          if(!err){
            users = users.map(function(user){
              var userJSON = user.toJSON()
              userJSON.isConnected = Socket.isSocketIdConnected(userIds[user.email], io);
              return userJSON;
            });
            socket.emit("users:show all", {users: users});
          }
        });
      });

      socket.on('beam tab', function(beam){
        console.log("incoming beam", beam);
        var recipient = userIds[beam.recipient];
        beam.fromUser = socket.decoded_token.email;
        io.to(recipient).emit('incoming beam', beam);
      });

      socket.on('away status change', function(msg){
        console.log("user is away");
      });

      socket.on('send friend invite', function(msg){
        console.log(socket.decoded_token.email, "is sending friend invite", msg);
        Socket.handleAddFriendRequest(socket.decoded_token.email, msg, function(err){
          console.log(err);
          if(err){
            console.log("error:", err);
          }else{
            socket.emit("friend:requests", {requests: user.pending_friends});
          }
        });

      });

      socket.on('accept friend invite', function(msg){
        console.log("user accepted friend invite");
      });

      socket.on('disconnect', function(socket){
        console.log("user disconnected.");
      });
    });
  },
  logout: function(){
    this.io.disconnect(true);
  }
};

module.exports = Socket;
