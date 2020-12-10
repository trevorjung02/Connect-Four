const express = require('express');
const path = require('path');
const { rootCertificates } = require('tls');
const app = express();
const uuid = require('uuid');
const Game = require('./game/Game');
const GetAIMove = require('./game/GetAIMove');

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
})

const server = require('http').createServer(app);
const io = require('socket.io')(server);

let roomToGame = new Map();
let roomToSockets = new Map();
let nextRoom = null;

io.on('connection', socket => {
    console.log(socket.id + " connected");
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
            // socket.token = 1;
            let moveGetters = [GetAIMove, GetAIMove];
            moveGetters[socket.token - 1] = null;
            let game = new Game(moveGetters, 7, 6, 4);
            roomToGame.set(newRoom, game);
            socket.emit('gameStart');
            if (socket.token == 2) {
                let result = game.makeMove({ token: socket.token % 2 + 1 });
                setTimeout(() => socket.emit('move:print', result), 300);
            }
        }
    })
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