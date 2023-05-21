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

// Game Pieces
const pawn = new Image()
pawn.src = 'pawn.png';

let pawnx = 145;
let pawny = 295;
const speed = 2;

pawn.onload = function() {
    let newWidth = 110;
    let newHeight = 90; 
    ctx.drawImage(pawn, 145, 295, newWidth, newHeight);
    gameboard.addEventListener('mousedown', handleMouseDown);
    gameboard.addEventListener('mousemove', handleMouseMove);
    gameboard.addEventListener('mouseup', handleMouseUp);
};

let isDragging = false;
let startX, startY;


function handleMouseDown(event) {
  const rect = gameboard.getBoundingClientRect();
  startX = event.clientX - rect.left;
  startY = event.clientY - rect.top;

  if (
    startX >= pawnx &&
    startX <= pawnx + pawn.width &&
    startY >= pawny &&
    startY <= pawny + pawn.height
  ) {
    isDragging = true;
  }
}

function handleMouseMove(event) {
  if (isDragging) {
    const rect = gameboard.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const dx = mouseX - startX;
    const dy = mouseY - startY;

    pawnx += dx;
    pawny += dy;

    startX = mouseX;
    startY = mouseY;
  }
}

function handleMouseUp() {
  isDragging = false;
}

function animate() {
    newWidth = 110;
    newHeight = 90;
    ctx.clearRect(0, 0, gameboard.width, gameboard.height);
    ctx.drawImage(pawn, pawnx, pawny, newHeight, newWidth);
    drawGameboard() 
    requestAnimationFrame(animate);
}
animate();