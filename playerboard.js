// Selections from index
const playercolor = localStorage.getItem('playercolor');
const difficulty = localStorage.getItem('difficulty');
// Canvas (Gameboard)
const gameboard = document.getElementById("gameboard");
const ctx = gameboard.getContext("2d");

const boardSize = gameboard.width;
const numCells = 5;
const cellSize = boardSize / numCells;

function drawGameboard(){
ctx.beginPath();
for (let x = 0; x <= boardSize; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, boardSize);
    }
for (let y = 0; y <= boardSize; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(boardSize, y);
    }
ctx.strokeStyle = "894E24";
ctx.stroke();
}
drawGameboard()