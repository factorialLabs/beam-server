exports.connection = function(socket){
    console.log('connection', socket);
    
    socket.on('sign in', exports.onSignIn);
    socket.on('disconnect', exports.disconnect);
};

exports.onSignIn = function(msg){
    console.log('sign in', msg);
};

exports.disconnect = function(msg){
    console.log('disconnect', msg);
};