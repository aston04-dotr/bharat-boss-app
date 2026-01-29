require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('click', () => {
        console.log('Click event received from:', socket.id);
        socket.emit('update_balance', { new_balance: Math.floor(Math.random() * 1000) });
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
