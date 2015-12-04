"use strict";
var secrets = require('../config/secrets');
var socketioJwt = require('socketio-jwt');
var User = require('../models/User');

var userIds = {};


var Socket = {
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
          toUser.getFriendInvite(existingUser, cb);
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
      User.findOne({ email: user.toLowerCase() }, function(err, user) {
        //send to the client all outstanding friend requests
        socket.emit("friend:requests", {requests: user.pending_friends});
      });

      /*
       * Event Handlers
       */

      socket.on('beam tab', function(beam){
        console.log("incoming beam", beam);
        var recipient = userIds[beam.recipient];
        beam.fromUser = socket.decoded_token.email;
        io.to(recipient).emit('incoming beam', beam);
      });

      socket.on('sign in', function(socket){
        console.log("user signed in");
      });

      socket.on('away status change', function(socket){
        console.log("user is away");
      });

      socket.on('send friend invite', function(msg){
        console.log(socket.decoded_token.email, "is sending friend invite", msg);
        Socket.handleAddFriendRequest(socket.decoded_token.email, msg, function(err){
          console.log(err);
          if(err){

          }else{

          }
        });

      });

      socket.on('accept friend invite', function(socket){
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