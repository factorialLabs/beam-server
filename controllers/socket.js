"use strict";
var secrets = require('../config/secrets');
var socketioJwt = require('socketio-jwt');
var userIds = {};

var Socket = {
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
                var recipient = userIds[beam.message];
                io.to(recipient).emit('incoming beam', beam);
            });
            socket.on('sign in', function(socket){
                console.log("user signed in");
            });
            socket.on('disconnect', function(socket){
                console.log("user disconnected.");
            });
        });
	}
};

module.exports = Socket; 