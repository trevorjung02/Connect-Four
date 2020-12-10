const express = require('express');
const path = require('path');
const { rootCertificates } = require('tls');
const app = express();
const uuid = require('uuid');
const Game = require('./game/Game');
const GetAIMove = require('./game/GetAIMove');

// Makes the public folder accessible to http requests
app.use('/public', express.static('public'));

// Handles get requests to / by returning index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handles all requests to /game by returning game.html
app.use('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
})

const server = require('http').createServer(app);
const io = require('socket.io')(server);

let roomToGame = new Map(); // Maps a string representing a room of players to their Game 
let roomToSockets = new Map(); // Maps a string representing a room of players to their Sockets
let nextRoom = null; // A string representing the next room available for multiplayer 

// Handles socket events
io.on('connection', socket => {
    console.log(socket.id + " connected");

    // Handles the event when sockets send options for game creation. opponent is an integer as follows: 1 means the game is multiplayer, 2 means the game is single player. 
    socket.on('gameOptions', (opponent) => {
        if (opponent == 1) {
            if (nextRoom == null) {
                nextRoom = uuid.v4();
                socket.room = nextRoom;
                roomToSockets.set(nextRoom, new Set());
                roomToSockets.get(nextRoom).add(socket);
                socket.token = 1;
                socket.emit('joined');
            }
            else {
                socket.room = nextRoom;
                roomToSockets.get(nextRoom).add(socket);
                socket.token = 2;
                let game = new Game([null, null], 7, 6, 4);
                roomToGame.set(nextRoom, game);
                roomToSockets.get(nextRoom).forEach(s => s.emit('gameStart'));
                nextRoom = null;
            }
        }
        else {
            console.log("Creating Single Player Game");
            let newRoom = uuid.v4();
            socket.room = newRoom;
            roomToSockets.set(newRoom, new Set());
            roomToSockets.get(newRoom).add(socket);
            socket.token = Math.floor(Math.random() * 2) + 1;
            let moveGetters = [GetAIMove, GetAIMove];
            moveGetters[socket.token - 1] = null;
            let game = new Game(moveGetters, 7, 6, 4);
            roomToGame.set(newRoom, game);
            socket.emit('gameStart');
            if (socket.token == 2) {
                let result = game.makeMove({ token: socket.token % 2 + 1 });
                setTimeout(() => socket.emit('move:print', result), 100);
            }
        }
    })

    // Handles the event when a socket is attempting to make a move. 
    socket.on('move', function (x) {
        let room = socket.room;
        if (!roomToGame.has(room)) {
            return;
        }
        let result = roomToGame.get(room).makeMove({ x, token: socket.token });
        console.log(result);
        if (result != null) {
            roomToSockets.get(room).forEach(s => s.emit('move:print', result));
            if (result.state == 0 && roomToSockets.get(room).size == 1) {
                result = roomToGame.get(room).makeMove({ token: socket.token % 2 + 1 });
                setTimeout(() => socket.emit('move:print', result), 300);
            }
        }
    });

    // Handles the event when a socket disconnects.
    socket.on('disconnect', () => {
        let room = socket.room;
        if (room == null) {
            return;
        }
        roomToSockets.get(room).forEach(s => {
            if (socket != s) {
                s.emit('roomClosed');
                s.room = null;
            }
        });
        if (room === nextRoom) {
            nextRoom = null;
        }
        roomToGame.delete(room);
        roomToSockets.delete(room);
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server listening on port " + PORT));