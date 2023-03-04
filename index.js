const canvas = document.getElementById('canvasID');
canvas.width = innerWidth;
canvas.height = innerHeight;
const playerIndicator = document.getElementById('playerColor');
const playerwon = document.getElementById('playerwon');
const gameOver = document.getElementById('gameOver');
const playerColorContainer = document.getElementById('playerColorContainer');
const c = canvas.getContext("2d");
const sitelink = 'https://samplentest.blogspot.com/';
let count = 0;
let color = 'red';
playerIndicator.style.backgroundColor = color;
let p1 = 'red';
let p2 = 'blue';
let isgameover = false;
let isgamepause = false;
let coinPositionArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let MovingCoinIndex = [-1, 0];
let stx, sty, mx, my;
const WINCONDITION = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
const COINSPLACES = [
    { "x": innerWidth / 2 - 150, "y": innerHeight / 2 - 150 },
    { "x": innerWidth / 2, "y": innerHeight / 2 - 150 },
    { "x": innerWidth / 2 + 150, "y": innerHeight / 2 - 150 },
    { "x": innerWidth / 2 - 150, "y": innerHeight / 2 },
    { "x": innerWidth / 2, "y": innerHeight / 2 },
    { "x": innerWidth / 2 + 150, "y": innerHeight / 2 },
    { "x": innerWidth / 2 - 150, "y": innerHeight / 2 + 150 },
    { "x": innerWidth / 2, "y": innerHeight / 2 + 150 },
    { "x": innerWidth / 2 + 150, "y": innerHeight / 2 + 150 }
]
gameReset();

canvas.addEventListener('click', (event) => {
    c.beginPath();
    if (count < 6) {
        let tempposition = -1;
        for (let position of COINSPLACES) {
            tempposition++;
            if (coinPositionArray[tempposition] == 0) {
                let tempx = COINSPLACES[tempposition].x;
                let tempy = COINSPLACES[tempposition].y;
                if (event.clientX < tempx + 50 && event.clientX > tempx - 50 && event.clientY < tempy + 50 && event.clientY > tempy - 50) {
                    coinPositionArray[tempposition] = color == p1 ? 1 : 2;
                    console.log("Before : ",color);
                    if(count>3&&isInvalidPlacement(tempposition)) return;
                    console.log("After : ",color);
                    count++;
                    c.lineWidth = 10;
                    c.arc(tempx, tempy, 7.5, 0, Math.PI * 2, false);
                    c.stroke();
                    c.fillStyle = color;
                    colortoggle();
                }
            }
        }
    }
    c.fill()
});

function colortoggle() {
    color = color == p1 ? p2 : p1;
    playerIndicator.style.backgroundColor = color;
}

function touchst(evt) {
    stx = evt.touches[0].clientX;
    sty = evt.touches[0].clientY;
    for (let position in COINSPLACES) {
        let tempx = COINSPLACES[position].x;
        let tempy = COINSPLACES[position].y;
        if (stx < tempx + 50 && stx > tempx - 50 && sty < tempy + 50 && sty > tempy - 50) {
            MovingCoinIndex[0] = parseInt(position);
        }
    }
}
function touchmove(evt) {
    mx = evt.touches[0].clientX;
    my = evt.touches[0].clientY;
}
function touchend() {
    let selectcoin = MovingCoinIndex[0];
    if (count == 6) {

        if (stx + 50 < mx) {
            MovingCoinIndex[1] = 1;
            let move = MovingCoinIndex[0] + MovingCoinIndex[1];
            if (![2, 5, 8].includes(selectcoin)) {
                if (isValidMove(move, coinPositionArray[MovingCoinIndex[0]])) {
                    coinPositionArray[move] = coinPositionArray[selectcoin]
                    coinPositionArray[selectcoin] = 0;
                    drawCoins();
                    colortoggle();
                }
            }
        } else if (stx - 50 > mx) {
            MovingCoinIndex[1] = -1;
            let move = MovingCoinIndex[0] + MovingCoinIndex[1];
            if (![0, 3, 6].includes(selectcoin)) {
                if (isValidMove(move, coinPositionArray[MovingCoinIndex[0]])) {
                    coinPositionArray[move] = coinPositionArray[selectcoin]
                    coinPositionArray[selectcoin] = 0;
                    drawCoins();
                    colortoggle();
                }
            }
        }
        if (sty + 50 < my) {
            MovingCoinIndex[1] = 3;
            let move = MovingCoinIndex[0] + MovingCoinIndex[1];
            if (![6, 7, 8].includes(selectcoin)) {
                if (isValidMove(move, coinPositionArray[MovingCoinIndex[0]])) {
                    coinPositionArray[move] = coinPositionArray[selectcoin]
                    coinPositionArray[selectcoin] = 0;
                    drawCoins();
                    colortoggle();
                }
            }
        } else if (sty - 50 > my) {
            MovingCoinIndex[1] = -3;
            let move = MovingCoinIndex[0] + MovingCoinIndex[1];
            if (![0, 1, 2].includes(selectcoin)) {
                if (isValidMove(move, coinPositionArray[MovingCoinIndex[0]])) {
                    coinPositionArray[move] = coinPositionArray[selectcoin]
                    coinPositionArray[selectcoin] = 0;
                    drawCoins();
                    colortoggle();
                }
            }
        }
        if (isGameOver()) {
            gameOver.style.width = '100vw'
        }
    }
}
function isValidMove(move, position) {
    if (move < 0 || move > 8)
        return false;
    if (coinPositionArray[move] != 0)
        return false;
    if ((color == p1 ? 1 : 2) != position)
        return false
    if(isgameover||isgamepause)
        return false;
    return true;
}
function drawCoins() {
    let index = -1;
    for (let coin of coinPositionArray) {
        index++;
        if (coin != 0) {
            c.beginPath();
            c.lineWidth = 5;
            c.arc(COINSPLACES[index].x, COINSPLACES[index].y, 10, 0, Math.PI * 2, false);
            c.fillStyle = coin == 1 ? p1 : p2;
            c.fill()
            c.stroke();
        } else {
            c.beginPath();
            c.arc(COINSPLACES[index].x, COINSPLACES[index].y, 10, 0, Math.PI * 2, false);
            c.fillStyle = 'white';
            c.fill()
            c.stroke();
        }
    }
}

function isGameOver() {
    for (let win of WINCONDITION) {
        if ((coinPositionArray[win[0]] == 1 && coinPositionArray[win[1]] == 1 && coinPositionArray[win[2]] == 1) || (coinPositionArray[win[0]] == 2 && coinPositionArray[win[1]] == 2 && coinPositionArray[win[2]] == 2)) {
            playerwon.style.backgroundColor = coinPositionArray[win[0]]==1?p1:p2;
            isgameover = true;
            return true;
        }
    }
    return false;

}

function isInvalidPlacement(i) {
    for (let win of WINCONDITION) {
        if ((coinPositionArray[win[0]] == 1 && coinPositionArray[win[1]] == 1 && coinPositionArray[win[2]] == 1) || (coinPositionArray[win[0]] == 2 && coinPositionArray[win[1]] == 2 && coinPositionArray[win[2]] == 2)) {
            if(count!=6) coinPositionArray[i]=0;
            return true;
        }
    }
    return false;

}

function gameReset() {
    gameOver.style.width = '0vw';
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
        c.beginPath();
        c.arc(COINSPLACES[i].x, COINSPLACES[i].y, 20, 0, Math.PI * 2, false);
        c.fillStyle = 'black';
        c.strokeStyle = "black";
        c.fill()
        c.stroke();
    }
    c.beginPath();
    c.rect(innerWidth / 2 - 160, innerHeight / 2 - 160, 320, 320);
    c.fill();
    c.lineWidth = 0;
    c.strokeStyle = "black";
    c.stroke();
    for (let i = 1; i <= 4; i++) {
        c.beginPath();
        c.rect(i % 2 ? innerWidth / 2 - 150 : innerWidth / 2, i < 3 ? innerHeight / 2 - 150 : innerHeight / 2, 150, 150);
        c.fill();
        c.lineWidth = 5;
        c.strokeStyle = "white";
        c.stroke();
    }
    for (let i = 0; i < 9; i++) {
        c.beginPath();
        c.arc(COINSPLACES[i].x, COINSPLACES[i].y, 10, 0, Math.PI * 2, false);
        c.fillStyle = 'white';
        c.strokeStyle = "white";
        c.fill()
        c.stroke();
        coinPositionArray[i]=0;
    }

    count = 0;
    color = 'red';
    playerIndicator.style.backgroundColor = color;
    MovingCoinIndex = [-1, 0];
    isgameover=false;
}

function playerColorEnable(){
    isgamepause = true;
    playerColorContainer.style.display = playerColorContainer.style.display == 'flex'?'none':'flex';
    p1=document.getElementById('p1').value;
    p2=document.getElementById('p2').value;
}
