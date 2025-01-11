module.exports = (io, socket) => {


    socket.on('sendMessage', (messageData) => {
        console.log("message at server", messageData);
        socket.to(messageData).emit('listenMessages', messageData)
        console.log("message forwarded", messageData);
    });
};


