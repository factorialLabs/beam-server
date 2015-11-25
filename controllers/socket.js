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

  setIo: function(io){
    io.on("connection", socketioJwt.authorize({
      secret: secrets.jwt.secretOrKey,
      timeout: 15000 // 15 seconds to send the authentication message
    })).on('authenticated', function(socket) {
      //this socket is authenticated, we are good to handle more events from it.
      console.log('signed in: ' + socket.decoded_token.email);

      userIds[socket.decoded_token.email] = socket.id;

      socket.on('beam tab', function(beam){
        console.log("incoming beam", beam);
        var recipient = userIds[beam.recipient];
        io.to(recipient).emit('incoming beam', beam);
      });

      socket.on('sign in', function(socket){
        console.log("user signed in");
      });

      socket.on('away status change', function(socket){
        console.log("user is away");
      });

      socket.on('send friend invite', function(socket){
        console.log("user is sending friend invite");
      });

      socket.on('accept friend invite', function(socket){
        console.log("user accepted friend invite");
      });

      socket.on('disconnect', function(socket){
        console.log("user disconnected.");
      });
    });
  }
};

module.exports = Socket;