"use strict";
var Socket = {
	setIo: function(io){
		io.on("connection", function(socket){
			console.log('connection');
		    io.emit('incoming beam', {url: 'http://techretreat.ca'});
		    
		    socket.on('beam tab', function(beam){
		    	console.log("incoming beam", beam);
		    	io.emit('incoming beam', beam);
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