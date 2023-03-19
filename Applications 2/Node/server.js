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

  socket.on('master', message => {
    console.log("--> Master added:", message)
    masterSockets.push(socket)
  })
  
  if(!masterSockets.map(m => m.id).includes(socket.id))
    sockets.push(socket);
  
  socket.on('broadcast', message => { 
    sockets.forEach(s => s.emit('input', message));
    console.log("Broadcast message sent ->", message)
  });

  socket.on('unicast', dto => {
    sockets.find(s => s.id === dto.target).emit(dto.message)
  })

  socket.on('getListConnectedDevices', () => {
    let socketIds = sockets.map(socketItem => socketItem.id)
    masterSockets.forEach(m => m.emit(socketIds))
  })

  socket.on('disconnect', () => {
    let index = sockets.indexOf(socket);
    if(index != -1) {
        sockets.splice(index, 1);
    } else {
        index = sockets.indexOf(masterSockets);
        masterSockets.splice(index, 1);
    }
    console.log('Socket disconnected:', socket.id);
  });

});

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});