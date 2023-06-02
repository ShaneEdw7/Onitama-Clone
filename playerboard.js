const playercolor = localStorage.getItem('playercolor');
const difficulty = localStorage.getItem('difficulty');
const gameCards = [];
const playerCards = gameCards.slice (0,2);
const AICards = gameCards.slice (2,4);
const commonCard = gameCards.slice (4);
const player1 = {
  color : localStorage.getItem('playercolor'),
  cards : playerCards
};
let opponentColor = 'red';

if (playercolor === 'red') opponentColor = 'blue';

const AI = {
  color : opponentColor,
  cards : AICards,
  difficulty : localStorage.getItem('difficulty'),
};


// Canvas (Gameboard)
const gameboard = document.getElementById("gameboard");
const ctx = gameboard.getContext("2d");

const boardSize = gameboard.width;
const numCells = 5;
const cellSize = boardSize / numCells;

const drawGameboard = () => {
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

let piecePositions = [
  { row: 0, col: 0, piece: "student", color: "blue" },
  { row: 0, col: 1, piece: "student", color: "blue" },
  { row: 0, col: 4, piece: "student", color: "blue" },
  { row: 0, col: 3, piece: "student", color: "blue" },
  { row: 0, col: 2, piece: "master", color: "blue" },

  { row: 4, col: 0, piece: "student", color: "red" },
  { row: 4, col: 1, piece: "student", color: "red" },
  { row: 4, col: 4, piece: "student", color: "red" },
  { row: 4, col: 3, piece: "student", color: "red" },
  { row: 4, col: 2, piece: "master", color: "red" },
]
const pieceImgs = {
  blue: {},
  red: {}
};
const drawPieces = () => {
  piecePositions.forEach((position) => {
    const { row, col, piece, color } = position;

    const x = col * cellSize;
    const y = row * cellSize;

    const img = pieceImgs[color][piece];
    ctx.drawImage(img, x, y, cellSize, cellSize);
  });
};

const pieceTypes = ['student', 'master'];

  let loadPieceImgs = () => {
    pieceTypes.forEach((pieceType) => {
      const redPiece = new Image();
      redPiece.src = `images/red_${pieceType}.png`;
      pieceImgs.red[pieceType] = redPiece;
  
      const bluePiece = new Image();
      bluePiece.src = `images/blue_${pieceType}.png`;
      pieceImgs.blue[pieceType] = bluePiece;
    });
  }
  
loadPieceImgs();

const allImages = Object.values(pieceImgs.blue).concat(Object.values(pieceImgs.red));

    Promise.all(
      allImages.map(img => {
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      })
    ).then(() => {
      drawPieces();
    });

    loadPieceImgs();

//Piece Movement


const selectPiece = (event) => {
  const board = gameboard.getBoundingClientRect();
  const mouseX = event.clientX - board.left;
  const mouseY = event.clientY - board.top;
  const cellX = Math.floor(mouseX / cellSize);
  const cellY = Math.floor(mouseY / cellSize);
  const selectedPiece = piecePositions.find((piece) => {
    return piece.row === cellY && piece.col === cellX;
  });
  if (selectedPiece) {
    selectedPiece.selected = true;
  }
}
const movePiece = (event, selectedPiece) => {
  const board = gameboard.getBoundingClientRect();
  const mouseX = event.clientX - board.left;
  const mouseY = event.clientY - board.top;
  const cellX = Math.floor(mouseX / cellSize);
  const cellY = Math.floor(mouseY / cellSize);
  selectedPiece.row = cellY;
  selectedPiece.col = cellX;
  selectedPiece.selected = false;
}
const handlePlayerClick = (event) => {
  const selectedPiece = piecePositions.find((piece) => piece.selected === true)
 if (selectedPiece) movePiece(event, selectedPiece) 
 else selectPiece(event)
 ctx.clearRect (0,0, gameboard.width, gameboard.height);
  drawGameboard()
  drawPieces()
}
const highlightSquare = (event) => {
  const board = gameboard.getBoundingClientRect();
  const mouseX = event.clientX - board.left;
  const mouseY = event.clientY - board.top;
  const cellX = Math.floor(mouseX / cellSize);
  const cellY = Math.floor(mouseY / cellSize);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
}

gameboard.addEventListener('click', handlePlayerClick)



// Movement Cards

const movementCards = [
  'images/boar.png',
  'images/cobra.png',
  'images/crab.png',
  'images/crane.png',
  'images/dragon.png',
  'images/eel.png',
  'images/elephant.png',
  'images/frog.png',
  'images/goose.png',
  'images/horse.png',
  'images/mantis.png',
  'images/monkey.png',
  'images/ox.png',
  'images/rabbit.png',
  'images/rooster.png',
  'images/tiger.png',
]

for (let i = 0; i < 5; i++) {
  let shuffle = Math.floor(Math.random() * movementCards.length);
  let selectedCards = movementCards[shuffle];
  gameCards.push(selectedCards);
  movementCards.splice(shuffle, 1);
  let imgArray = document.getElementById("card" + (i + 1));
  imgArray.src = gameCards[i];
}

const card1 = document.getElementById("card1");
const card2 = document.getElementById("card2");
const card3 = document.getElementById("card3");
const card4 = document.getElementById("card4");
const card5 = document.getElementById("card5");

const selectCard = (card) => {
  card1.classList.remove('selected');
  card2.classList.remove('selected');
  card.classList.add('selected');
  card.style.borderColor = playercolor;
}
card3.onclick = card4.onclick = card5.onclick = function() {
  return false;
};