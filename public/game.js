let socket = io();
const urlParams = new URLSearchParams(window.location.search);
const opponent = urlParams.get('opponent');
let gameOver = false;

function initializeElements() {
    initializeBoard();
}

function initializeBoard() {
    let board = document.querySelector('#board');
    for (let y = 5; y >= 0; y--) {
        for (let x = 0; x < 7; x++) {
            let box = document.createElement('div');
            box.className = 'box';
            box.style.backgroundColor = 'white';
            box.onclick = makeMove;
            box.x = x;
            box.y = y;
            box.id = `${x},${y}`;
            board.appendChild(box);
        }
    }
}

function makeMove(event) {
    let box = event.target;
    socket.emit('move', box.x);
    event.preventDefault();
}

socket.on('connect', () => {
    socket.emit('gameOptions', opponent);
});

socket.on('joined', () => {
    let waitingIndicator = document.getElementById('waitingIndicator');
    waitingIndicator.style.visibility = 'visible';
})

socket.on('gameStart', () => {
    let turnIndicator = document.getElementById('turnIndicator');
    turnIndicator.style.display = 'initial';
    let waitingIndicator = document.getElementById('waitingIndicator');
    waitingIndicator.style.visibility = 'hidden';
});

socket.on('move:print', result => {
    let curBox = document.getElementById(`${result.x},${result.y}`);
    if (result.token == 1) {
        curBox.style.backgroundColor = '#1564ed';
    }
    else {
        curBox.style.backgroundColor = '#f01616';
    }
    let turnIndicator = document.getElementById('turnIndicator');
    turnIndicator.textContent = `Player ${result.token % 2 + 1}'s Turn`;
    if (result.state == 1 || result.state == 2) {
        gameOver = true;
        const elem = document.getElementById('popup');
        const h4 = document.querySelector('#popup > div > h4');
        if (result.state == 1) {
            h4.textContent = `Player ${result.token} won!`;
        }
        else {
            h4.textContent = "It's a tie!";
        }
        const instance = M.Modal.init(elem);
        instance.open();
    }
});

socket.on('roomClosed', () => {
    if (gameOver == false) {
        const elem = document.getElementById('popup');
        const h4 = document.querySelector('#popup > div > h4');
        h4.textContent = `Other Player Has Left`;
        const instance = M.Modal.init(elem);
        instance.open();
    }
});