exports.setIo = function(io){
    exports.io = io;
};

exports.connection = function(socket){
    console.log('connection', socket);
    exports.io.emit('incoming beam', {url: 'http://techretreat.ca'});
    socket.on('sign in', exports.onSignIn);
    socket.on('disconnect', exports.disconnect);
};

exports.onSignIn = function(msg){
    console.log('sign in', msg);
};

exports.disconnect = function(msg){
    console.log('disconnect', msg);
};