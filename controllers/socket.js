var Socket = {
	setIo: function(io){
		this.io = io; 
		var that = this; 
		this.io.on("connection", function(socket){
			console.log('connection', socket);
		    that.io.emit('incoming beam', {url: 'http://techretreat.ca'});
		    socket.on('sign in', that.onSignIn);
		    socket.on('disconnect', that.disconnect);
		    socket.on('beam tab', function(msg){
		    	that.io.emit('incoming beam', {url: msg.url});
		    });
		});	
	},
	onSignIn: function(msg){
		console.log("Sign in", msg);
	},
	disconnect: function(msg){
		console.log("Disconnect", msg);
	}
};

module.exports = Socket; 