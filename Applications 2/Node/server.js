const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

const sockets = [];
const leaderSockets = []
let counter = 0
const deviceAlias = []

io.on('connection', socket => {
    
    console.log('New socket connection:', socket.id);

    socket.on('leader', name => {
        console.log("--> Leader added:", name)
        addAlias(socket.id, name)
        leaderSockets.push(socket)
        sendDeviceIdList()
    })

    socket.on('follower', name => {
        console.log("--> Follower added:", name)
        addAlias(socket.id, name)
        sockets.push(socket)
        sendDeviceIdList()
    })

    socket.on('broadcast', message => {
        sockets.forEach(s => logTranmission(s, socket.id, message))
        console.log("Broadcast message sent ->", message)
    });

    socket.on('broadcastLeader', message => {
        leaderSockets.forEach(m => logTranmission(m, socket.id, message))
        console.log("Broadcast message sent to leaders ->", message)
    })

    socket.on('unicast', dto => {
        const targetSocketId = Object.keys(deviceAlias).find(key => deviceAlias[key] == dto.target)
        foundSocket = sockets.find(s => s.id === targetSocketId)
        logTranmission(foundSocket, socket.id, dto.message)
    })

    socket.on('disconnect', () => {
        let index = sockets.indexOf(socket);
        if (index != -1) {
            sockets.splice(index, 1);
            sendDeviceIdList()
        } else {
            index = sockets.indexOf(leaderSockets);
            leaderSockets.splice(index, 1);
        }
        
        delete deviceAlias[socket.id];
        console.log('Socket disconnected:', socket.id);
        socket.disconnect()
    });

});

function logTranmission(targetSocket, srcId, message) {
    return targetSocket.emit("input", "from: " + deviceAlias[srcId] + " received: " + message)
}

function addAlias(id, alias) {
    deviceAlias[id] = alias + " #ID " + counter
    counter += 1
}

function sendDeviceIdList() {    
    let socketIds = sockets.map(socketItem => deviceAlias[socketItem.id])
    leaderSockets.forEach(m => m.emit("deviceList", socketIds))
}

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});