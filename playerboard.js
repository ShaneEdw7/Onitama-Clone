const colordisplay = document.getElementsByName('color');
colordisplay.forEach((color) => {
    color.addEventListener('click', (event) => {
        localStorage.setItem('playercolor', event.target.value)
    })
});
const difflevel = document.getElementsByName('difficulty');
difflevel.forEach((difficulty) => {
    difficulty.addEventListener('click', (event) => {
        localStorage.setItem('difficulty', event.target.value)
    })
});

const playercolor = localStorage.getItem('playercolor');
const difficulty = localStorage.getItem('difficulty');
const gameCards = [];
const playerCards = gameCards[0,2];
const AICards = gameCards[2,4];
let commonCard = gameCards[4];
const player1 = {
  color : localStorage.getItem('playercolor'),
  cards : playerCards
};
const card1 = document.getElementById('card1');
const card2 = document.getElementById('card2');
const card3 = document.getElementById('card3');
const card4 = document.getElementById('card4');

let currentPlayer = 1;

const getCurrentPlayerColor = () => {
  if(currentPlayer === 1) return player1.color
  return opponentColor;
}
// Disable Opponents Cards
const disableCards = (player) => {
  if (player === 1) {
    stopClick(card3);
    stopClick(card4);
   // restoreClick(card1, 0)
   // restoreClick(card2, 1)
  } else {
    stopClick(card1);
    stopClick(card2);
   // restoreClick(card3, 2)
  //  restoreClick(card4, 3)
  }
}
const stopClick = (card) => {
  card.removeAttribute('onclick')
  };

const restoreClick = (card, index) => {
  card.setAttribute('onclick', `selectCard('` + `${card}` + `', ${index}, ${getCurrentPlayerColor()})`);
    };

const switchPlayers = () => {
  if (currentPlayer === 1) {
    currentPlayer = 2
    boardBorder.style.borderColor = opponentColor
    boardBorder.style.borderSpacing = '5px';
    } else {
      currentPlayer = 1
      boardBorder.style.borderColor = player1.color;
      boardBorder.style.borderSpacing = '5px';
      };
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
    ],
    selected: false,
  },
  cobra: {
    color: 'red',
    image: 'images/cobra.png',
    movement: [
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: -1, y: 0}, // left 1 space
      {x: 1, y: 1}, // diagonally 1 space down-left
      {x:0, y:0}, // No Movement
    ],
    selected: false
  },
  crab: {
    color: 'blue',
    image: 'images/crab.png',
    movement: [
      {x: 0, y: -1}, // forward 1 space
      {x: -2, y: 0}, // left 2 spaces
      {x: 2, y: 0}, // right 2 spaces
      {x:0, y:0}, // No Movement
    ],
    selected: false
  },
  crane: {
    color: 'blue',
    image: 'images/crane.png',
    movement: [
      {x: 0, y: -1}, // forward 1 space
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x: 1, y: 1}, // diagonally 1 space down-right
      {x:0, y:0}, // No Movement
    ],
    selected: false
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
    ],
    selected: false
  },
  eel: {
    color: 'blue',
    image: 'images/eel.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x: 1, y: 0}, // right 1 space
      {x:0, y:0}, // No Movement
    ],
    selected: false
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
    ],
    selected: false
  },
  frog: {
    color: 'blue',
    image: 'images/frog.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: -2, y: 0}, // left 2 space
      {x: 1, y: 1}, // diagonally 1 space down-right
      {x:0, y:0}, // No Movement
    ],
    selected: false
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
    ],
    selected: false
  },
  horse: {
    color: 'red',
    image: 'images/horse.png',
    movement: [
      {x: 0, y: 1}, // forward 1 space
      {x: 0, y: -1}, // backward 1 space
      {x: -1, y: 0}, // left 1 space
      {x:0, y:0}, // No Movement
    ],
    selected: false
  },
  mantis: {
    color: 'red',
    image: 'images/mantis.png',
    movement: [
      {x: -1, y: -1}, // diagonally 1 space up-left
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: 0, y: 1}, // backward 1 space
      {x:0, y:0}, // No Movement
    ],
    selected: false
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
    ],
    selected: false
  },
  ox: {
    color: 'red',
    image: 'images/ox.png',
    movement: [
      {x: 0, y: 1}, // forward 1 space
      {x: 0, y: -1}, // backward 1 space
      {x: 1, y: 0}, // right 1 space
      {x:0, y:0}, // No Movement
    ],
    selected: false
  },
  rabbit: {
    color: 'blue',
    image: 'images/rabbit.png',
    movement: [
      {x: 1, y: -1}, // diagonally 1 space up-right
      {x: -1, y: 1}, // diagonally 1 space down-left
      {x: 2, y: 0}, // right 2 spaces
      {x:0, y:0}, // No Movement
    ],
    selected: false
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
    ],
    selected: false
  },
  tiger: {
    color: 'blue',
    image: 'images/tiger.png',
    movement: [
      {x: 0, y: 1}, // backward 1 space
      {x: 0, y: -2}, // forward 2 spaces
      {x:0, y:0}, // No Movement
    ],
    selected: false
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

  let loadPieceImgs = () => {
    pieceTypes.forEach((pieceType) => {
      const redPiece = new Image();
      redPiece.onload = function() {
        piecePositions.forEach((position) => {
          const { row, col, piece, color } = position;
      
          const x = col * cellSize;
          const y = row * cellSize;
      
          const img = pieceImgs[color][piece];
          ctx.drawImage(img, x, y, cellSize, cellSize);
        });
      };
      redPiece.src = `images/red_${pieceType}.png`;
      pieceImgs.red[pieceType] = redPiece;
  
      const bluePiece = new Image();
      bluePiece.onload = function() {
        piecePositions.forEach((position) => {
          const { row, col, piece, color } = position;
          const x = col * cellSize;
          const y = row * cellSize;
      
          const img = pieceImgs[color][piece];
          ctx.drawImage(img, x, y, cellSize, cellSize);
        });
      };
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
const updateBoard = () => {
  ctx.clearRect (0,0, gameboard.width, gameboard.height);
  loadPieceImgs();
  drawGameboard();
}
updateBoard();

let highlightedSquare
let selectedPiece
let pieceColor
let opponentPieceColor
let clickedCard
let cellX
let cellY
let currentLocX
let currentLocY

const mouseClick = (event) => {
  const board = gameboard.getBoundingClientRect();
  const mouseX = event.clientX - board.left;
  const mouseY = event.clientY - board.top;
  cellX = Math.floor(mouseX / cellSize);
  console.log('cellX', cellX, mouseX)
  cellY = Math.floor(mouseY / cellSize);
  console.log('cellY', cellY, mouseY)
  return { cellX, cellY };
};

const selectPiece = (event) => {
  const { cellX , cellY } = mouseClick(event);
  selectedPiece = piecePositions.find((piece) => {
    return piece.row === cellY && piece.col === cellX;
  });
  currentLocY = cellY;
  console.log(currentLocY)
  currentLocX = cellX;
  console.log(currentLocX)
  if (currentPlayer === 1) {
    if (selectedPiece.color === player1.color) {
      selectedPiece.selected = true;
    } else {
      pieceSelectionAlert();
      updateBoard();
      resetGameboard();
    }
} else if (currentPlayer === 2) {
    if (selectedPiece.color === opponentColor) {
      selectedPiece.selected = true;
    } else {
      pieceSelectionAlert();
      updateBoard();
      resetGameboard();
    };
  };
};

const highlightSquare = () => {
  const alpha = 0.2;
    pieceColor = colorConverter(player1.color, alpha);
    opponentPieceColor = colorConverter(opponentColor, alpha)
    ctx.clearRect (0,0, gameboard.width, gameboard.height);
    drawGameboard();


    const validMoves = []
    clickedCard?.movement.forEach((movement) => {
      const movementCardX = movement.x;
      let movementCardY = movement.y;
      if(selectedPiece.color !== player1.color) {
       movementCardY = -movement.y;
      }
    validMoves.push({x: movementCardX, y: movementCardY});    
    for (let row = 0; row < numCells; row++) {
      for (let col = 0; col < numCells; col++) {
          const x = col * cellSize;
          const y = row * cellSize;
          const selectedPieceX = col - movementCardX;
          const selectedPieceY = row - movementCardY;

          if (selectedPieceX === cellX && selectedPieceY === cellY) {
           if (selectedPiece.color === player1.color) {  
              ctx.fillStyle = pieceColor;
              ctx.fillRect(x, y, cellSize, cellSize);
            } else {
              ctx.fillStyle = opponentPieceColor;
              ctx.fillRect(x, y, cellSize, cellSize);
              };
            };
          };
        };
    });
  return validMoves;
};

const switchCards = () => {
  commonCard = gameCards.pop();
  gameCards.push(clickedCard);
  const temp = gameCards.indexOf(clickedCard);
  gameCards[temp] = commonCard;
  commonCard = gameCards[temp];
  gameCards.forEach((gameCard, i) => {
    createImages(gameCard, i)
    });
    clickedCard.selected = false;
    resetCards();
};

const resetCards = () => {
  const allCards = Array.from(document.getElementsByClassName('card'));
  allCards.forEach((card) => {
    card.style.borderWidth = '0px'
    card.selected = false
});
};

const selectCard = (cardId, cardIndex, playerColor) => {
  if ((currentPlayer === 1 && cardIndex > 1) || (currentPlayer === 2 && cardIndex < 2)) {
    return;
  }
  const selectedCard = document.getElementById(cardId);
  gameCards.forEach((card) => {
    card.selected = false;
  });
  const allCards = Array.from(document.getElementsByClassName('card'));
  allCards.forEach((card) => {
    card.style.borderWidth = '0px';
  });
  updateBoard();
  if (currentPlayer === 1) {
    if (player1.color) {
      clickedCard = gameCards[cardIndex];
      clickedCard.selected = true;
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (selectedPiece?.color === player1.color) highlightSquare();
    } else {
      cardSelectionAlert();
      resetCards();
    }
  } else if (currentPlayer === 2) {
    if (opponentColor) {
      clickedCard = gameCards[cardIndex];
      clickedCard.selected = true;
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (selectedPiece?.color === opponentColor) highlightSquare();
    } else {
      cardSelectionAlert();
      resetCards();
    }
  }
};

const createImages = (createCard, i) => {
  const imgArray = document.getElementById("card" + (i + 1));
  imgArray.src = createCard.image;
};

const removeStart = () => {
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'none'
}

const triggerAlert = (alertMessage) => {
  const myModal = new bootstrap.Modal(document.getElementById('alert'));
myModal.show();
  document.getElementById('modalText').innerText = alertMessage;
};

const gameOver = () => {
  const winner = getCurrentPlayerColor();
  triggerAlert(`Game Over. ${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`);
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'block'
};

const invalidMove = () => {
  triggerAlert('Invalid Move');
  removeStart();
}

const cardSelectionAlert = () => {
  triggerAlert('Please select a Card')
  removeStart();
}

const pieceSelectionAlert = () => {
  triggerAlert('Select Your Own Piece')
  removeStart();
}
const getOpponentColor = () => {
  if (currentPlayer === 1) return opponentColor;
  return player1.color;
}

const removePiece = () => {
  const pieceToRemove = piecePositions.find((piece) => {
    return piece.row === cellY && piece.col === cellX && piece.color === getOpponentColor();
  });
  if (pieceToRemove) {
    if(pieceToRemove.piece === 'master') {
      gameOver();
     };
    const index = piecePositions.indexOf(pieceToRemove);
    piecePositions.splice(index, 1);
  };
};

const createValidMoves = (moves) => {
  const newMoves = moves?.map((move) => {
    return {x: move.x + selectedPiece.col, y: move.y + selectedPiece.row}
  });
  return newMoves;
};

const movePiece = (event, selectedPiece) => {
  const moves = createValidMoves(highlightSquare(event));
  const { cellX , cellY } = mouseClick(event);
  const isValidMove = moves?.find((move) => move.x === cellX && move.y === cellY);
  //Animations??
  const animate = (event) => {
    const dY = currentLocY - cellY;
    const dX = currentLocX - cellX;
    console.log('currentLocY', currentLocY, '- cellY:',cellY, '= dY:',dY)
    console.log('currentLocX', currentLocX, '- cellX:',cellX, '= dX',dX)
  }

  const pieceCheck = piecePositions.find((piece) => {
    const pieceColorCheck = piece.color === getCurrentPlayerColor();
    return piece.row === cellY && piece.col === cellX && pieceColorCheck;
  });
    if (isValidMove && !pieceCheck) {
      selectedPiece.row = cellY;
      selectedPiece.col = cellX;
      switchCards();
  
        if (cellX === 2 && cellY === 0 && currentPlayer === 1
            || cellX === 2 && cellY === 4 && currentPlayer === 2) 
            gameOver(); 

      removePiece();
      switchPlayers();  
    } else {
        invalidMove();
        };
  resetGameboard();
  loadPieceImgs();
  animate();
};

const resetGameboard = () => {
  clickedCard.selected = false;
  selectedPiece.selected = false;
  clickedCard = null;
  cellX = null;
  cellY = null;
  resetCards();
};

const handlePlayerClick = (event) => {
  const selectedPiece = piecePositions.find((piece) => piece.selected === true)
  if (clickedCard) {
    if (selectedPiece) {
      movePiece(event, selectedPiece)
    } else { selectPiece(event)
      updateBoard();
      };
    } else {
      cardSelectionAlert();
      updateBoard();
    }
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
gameboard.addEventListener('click', highlightSquare);

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

const boardBorder = document.getElementById('gameboard');
if (gameCards[4].color === player1.color) {
  currentPlayer = 1
  boardBorder.style.borderWidth = "5px"
  boardBorder.style.borderColor = player1.color;
  boardBorder.style.borderSpacing = '5px';
} else {
  currentPlayer = 2
  boardBorder.style.borderWidth = "5px"
  boardBorder.style.borderColor = opponentColor;
  boardBorder.style.borderSpacing = '5px';
};