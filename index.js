const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server); 
// creates the link: /socket.io/socket.io.js

const port = 3000;

app.use('/', express.static('public'));

io.on('connection', (socket) => {
    console.log('A user is connected', socket.id);

    socket.on('message-client', ({ nickname, message }) => {
        // console.log('received message from', nickname);
        // console.log('this is the message', message);
        socket.broadcast.emit('message-server', { nickname, message });
        // socket.emit('message-server', { nickname, message });
    });
});

server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});