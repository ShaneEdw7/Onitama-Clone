const playercolor = localStorage.getItem('playercolor');
const difficulty = localStorage.getItem('difficulty');
const gameCards = [];
const playerCards = gameCards[0,2];
const AICards = gameCards[2,4];
const commonCard = gameCards[4];
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
const movementCards = {
  boar: {
    color: 'red',
    image: 'images/boar.png',
    movement: [
      {x: 0, y: -1}, // forward 1 space
      {x: -1, y: 0}, // left 1 space
      {x: 1, y: 0}, // right 1 space
      {x:0, y:0}, // No Movement
    ]
  },
  cobra: {
    color: 'red',
    image: 'images/cobra.png',
    movement: [
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: -1, y: 0}, // left 1 space
      {x: 1, y: 1}, // diagonally 1 space down-left
      {x:0, y:0}, // No Movement
    ]
  },
  crab: {
    color: 'blue',
    image: 'images/crab.png',
    movement: [
      {x: 0, y: -1}, // forward 1 space
      {x: -2, y: 0}, // left 2 spaces
      {x: 2, y: 0}, // right 2 spaces
      {x:0, y:0}, // No Movement
    ]
  },
  crane: {
    color: 'blue',
    image: 'images/crane.png',
    movement: [
      {x: 0, y: -1}, // forward 1 space
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x: 1, y: 1}, // diagonally 1 space down-right
      {x:0, y:0}, // No Movement
    ]
  },
  dragon: {
    color: 'red',
    image: 'images/dragon.png',
    movement: [
      {x: -2, y: -1}, // diagonally 2 spaces up-left
      {x: 2, y: -1}, // diagonally 2 spaces up-right
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x: 1, y: 1}, // diagonally 1 space down-right
      {x:0, y:0}, // No Movement
    ]
  },
  eel: {
    color: 'blue',
    image: 'images/eel.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x: 1, y: 0}, // right 1 space
      {x:0, y:0}, // No Movement
    ]
  },
  elephant: {
    color: 'red',
    image: 'images/elephant.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: -1, y: 0}, // left 1 space
      {x: 1, y: 0}, // right 1 space
      {x:0, y:0}, // No Movement
    ]
  },
  frog: {
    color: 'blue',
    image: 'images/frog.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: -2, y: 0}, // left 2 space
      {x: 1, y: 1}, // diagonally 1 space down-right
      {x:0, y:0}, // No Movement
    ]
  },
  goose: {
    color: 'blue',
    image: 'images/goose.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: -1, y: 0}, // left 1 space
      {x: 1, y: 0}, // right 1 space
      {x: 1, y: 1}, // diagonally 1 space down-right
      {x:0, y:0}, // No Movement
    ]
  },
  horse: {
    color: 'red',
    image: 'images/horse.png',
    movement: [
      {x: 0, y: 1}, // forward 1 space
      {x: 0, y: -1}, // backward 1 space
      {x: -1, y: 0}, // left 1 space
      {x:0, y:0}, // No Movement
    ]
  },
  mantis: {
    color: 'red',
    image: 'images/mantis.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: 0, y: 1}, // backward 1 space
      {x:0, y:0}, // No Movement
    ]
  },
  monkey: {
    color: 'blue',
    image: 'images/monkey.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x: 1, y: 1}, // diagonally 1 space down-right
      {x:0, y:0}, // No Movement
    ]
  },
  ox: {
    color: 'red',
    image: 'images/ox.png',
    movement: [
      {x: 0, y: 1}, // forward 1 space
      {x: 0, y: -1}, // backward 1 space
      {x: 1, y: 0}, // right 1 space
      {x:0, y:0}, // No Movement
    ]
  },
  rabbit: {
    color: 'blue',
    image: 'images/rabbit.png',
    movement: [
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x: 2, y: 0}, // right 2 spaces
      {x:0, y:0}, // No Movement
    ]
  },
  rooster: {
    color: 'red',
    image: 'images/rooster.png',
    movement: [
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: -1, y: 0}, // left 1 space
      {x: 1, y: 0}, // right 1 space
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x:0, y:0}, // No Movement
    ]
  },
  tiger: {
    color: 'blue',
    image: 'images/tiger.png',
    movement: [
      {x: 0, y: 1}, // backward 1 space
      {x: 0, y: -2}, // forward 2 spaces
      {x:0, y:0}, // No Movement
    ]
  },
};

let piecePositions = [
  { row: 0, col: 0, piece: "student", color: AI.color },
  { row: 0, col: 1, piece: "student", color: AI.color },
  { row: 0, col: 4, piece: "student", color: AI.color },
  { row: 0, col: 3, piece: "student", color: AI.color },
  { row: 0, col: 2, piece: "master", color: AI.color },

  { row: 4, col: 0, piece: "student", color: player1.color },
  { row: 4, col: 1, piece: "student", color: player1.color },
  { row: 4, col: 4, piece: "student", color: player1.color },
  { row: 4, col: 3, piece: "student", color: player1.color },
  { row: 4, col: 2, piece: "master", color: player1.color },
];
const pieceImgs = {
  blue: {},
  red: {}
};

const pieceTypes = ['student', 'master'];

const drawPieces = () => {
  piecePositions.forEach((position) => {
    const { row, col, piece, color } = position;

    const x = col * cellSize;
    const y = row * cellSize;

    const img = pieceImgs[color][piece];
    ctx.drawImage(img, x, y, cellSize, cellSize);
  });
};

  let loadPieceImgs = () => {
    pieceTypes.forEach((pieceType) => {
      const redPiece = new Image();
      redPiece.src = `images/red_${pieceType}.png`;
      pieceImgs.red[pieceType] = redPiece;
  
      const bluePiece = new Image();
      bluePiece.src = `images/blue_${pieceType}.png`;
      pieceImgs.blue[pieceType] = bluePiece;
    });
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
};


drawGameboard();
loadPieceImgs();
drawPieces();


let highlightedSquare
let selectedPiece
let pieceColor

const selectPiece = (event) => {
  const board = gameboard.getBoundingClientRect();
  const mouseX = event.clientX - board.left;
  const mouseY = event.clientY - board.top;
  const cellX = Math.floor(mouseX / cellSize);
  const cellY = Math.floor(mouseY / cellSize);
  selectedPiece = piecePositions.find((piece) => {
    return piece.row === cellY && piece.col === cellX;
  });
  if (selectedPiece) {
    selectedPiece.selected = true;
  };
};

const highlightSquare = (event) => {
 if (selectedPiece.selected){
    const board = gameboard.getBoundingClientRect();
    const mouseX = event.clientX - board.left;
    const mouseY = event.clientY - board.top;
    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);
    const alpha = 0.2;
    pieceColor = colorConverter(playercolor, alpha);
    ctx.fillStyle = pieceColor;
    ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
    highlightedSquare = {row: cellY, col: cellX};
    console.log(event);
    
  if (highlightedSquare) {
    ctx.fillStyle = pieceColor;
    ctx.fillRect(
    highlightedSquare.col * cellSize,
    highlightedSquare.row * cellSize,
    cellSize,
    cellSize,
    console.log(event)
    )};

    clickedCard.movement.forEach((movement) => {
    const movementCardX = movement.x;
    const movementCardY = movement.y;
      
    for (let row = 0; row < numCells; row++) {
      for (let col = 0; col < numCells; col++) {
          const x = col * cellSize;
          const y = row * cellSize;
          const selectedPieceX = col - movementCardX;
          const selectedPieceY = row - movementCardY;
      
          if (selectedPieceX === cellX && selectedPieceY === cellY) {
            ctx.fillStyle = pieceColor;
            ctx.fillRect(x, y, cellSize, cellSize);
              
          };
        };
      };
    });
  };
};

let clickedCard

const handleCardClick = (index) => {
  clickedCard = gameCards[index];
  gameCards[index].selected = true;
  const selectedYes = (array, index) => {
      array.forEach((card, i,) => {
          if (i === index) {
            gameCards[card].selected = false
            card.selected = true;
            
          } 
      });
  };
  selectedYes(gameCards, index)
};
    
const selCard1 = document.getElementById('card1')
  selCard1.onclick = () => {
  handleCardClick(0)
  selCard2.style.borderWidth = '0px';
  selCard1.style.borderColor = player1.color;
  selCard1.style.borderWidth = '2px'
};  
    
const selCard2 = document.getElementById('card2')
  selCard2.onclick = () => {
  handleCardClick(1)
  selCard1.style.borderWidth= '0px'
  selCard2.style.borderColor = player1.color;
  selCard2.style.borderWidth = '2px'
};
const createImages = (createCard, i) => {
  const imgArray = document.getElementById("card" + (i + 1));
  imgArray.src = createCard.image;
};

const movePiece = (event, selectedPiece) => {
  const board = gameboard.getBoundingClientRect();
  const mouseX = event.clientX - board.left;
  const mouseY = event.clientY - board.top;
  const cellX = Math.floor(mouseX / cellSize);
  const cellY = Math.floor(mouseY / cellSize);
  selectedPiece.row = cellY;
  selectedPiece.col = cellX;
  selectedPiece.selected = false;
  
  // Testing switching cards when move is made
  /*
const cardIndex = gameCards.indexOf(clickedCard);
console.log('cardindex', cardIndex)
const lastCard = gameCards[gameCards.length - 1];
console.log('lastCard', lastCard)
const tempCard = gameCards.splice(gameCards.length -1, 1)
console.log('tempCard', tempCard)
gameCards.push(clickedCard);
gameCards[cardIndex] = tempCard[0];
*/
console.log('gameCards', gameCards)
gameCards.forEach((gameCard, i) => {
  createImages(gameCard, i)
});
highlightSquare(event);
console.log(gameCards.indexOf(clickedCard))
};

const handlePlayerClick = (event) => {
  const selectedPiece = piecePositions.find((piece) => piece.selected === true)
 if (selectedPiece) movePiece(event, selectedPiece)
 else selectPiece(event)
 ctx.clearRect (0,0, gameboard.width, gameboard.height);
  drawGameboard()
  drawPieces()
  console.log(gameCards.indexOf(clickedCard))
};

const colorConverter = (color, alpha) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
};

gameboard.addEventListener('click', handlePlayerClick, selectPiece);
gameboard.addEventListener('click', highlightSquare)

for (let i = 0; i < 5; i++) {
  const selectedCards = Object.keys(movementCards);
  const randomIndex = Math.floor(Math.random() * selectedCards.length);
  const selectedCard = selectedCards[randomIndex];
  const chosenOne = movementCards[selectedCard]
  gameCards.push(chosenOne);
  delete movementCards[selectedCard];
  selectedCards.splice(randomIndex, 1);
  createImages(gameCards[i], i)
};

