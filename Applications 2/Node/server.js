const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

const sockets = [];
const masterSockets = []

io.on('connection', socket => {
    
    console.log('New socket connection:', socket.id);

    socket.on('leader', message => {
        console.log("--> Leader added:", message)
        masterSockets.push(socket)
        sendDeviceIdList()
    })

    socket.on('follower', message => {
        console.log("--> Follower added:", message)
        sockets.push(socket)
        sendDeviceIdList()
    })

    socket.on('broadcast', message => {
        sockets.forEach(s => {
            s.emit('input', message)
        });
        console.log("Broadcast message sent ->", message)
    });

    socket.on('unicast', dto => {
        foundSocket = sockets.find(s => s.id === dto.target)
        foundSocket.emit(dto.message)
    })

    socket.on('disconnect', () => {
        let index = sockets.indexOf(socket);
        if (index != -1) {
            sockets.splice(index, 1);
            sendDeviceIdList()
        } else {
            index = sockets.indexOf(masterSockets);
            masterSockets.splice(index, 1);
        }
        socket.disconnect()
        console.log('Socket disconnected:', socket.id);
    });

});

function sendDeviceIdList() {    
    let socketIds = sockets.map(socketItem => socketItem.id)
    masterSockets.forEach(m => m.emit("deviceList", socketIds))
}

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});