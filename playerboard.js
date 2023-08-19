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
// const player1 = {
//  color : localStorage.getItem('playercolor'),
//  cards : playerCards
//};
const canvasReverse = url('/images/canvas_background-reverse.png');

const pieceImgs = {
  blue: {},
  red: {}
};
const pieceTypes = ['student', 'master'];

let currentPlayer = 1;

const getCurrentPlayerColor = () => {
  if(currentPlayer === 1) return player1.color
  return opponentColor;
};

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

const canvasFlip = () => {
  gameboard.style.backgroundImage = canvasReverse;
}
 
let opponentColor = 'red';
if (playercolor === 'red') {
  opponentColor = 'blue';
} else {
  canvasFlip();
}


const AI = {
  color : opponentColor,
  cards : AICards,
  difficulty : localStorage.getItem('difficulty'),
};
class Card {
  constructor(name, color, image, movement) {
      this.name = name;
      this.color = color;
      this.image = image;
      this.movement = movement;
      this.selected = false;
  }
}
class Player {
  constructor(color, cards = []) {
      this.color = color;
      this.cards = cards;
  }
}

let player1 = new Player(localStorage.getItem('playercolor'));
let player2 = new Player(opponentColor);
class Game { constructor(player1, player2, gameCards = []) 
  { this.player1 = player1; 
    this.player2 = player2; 
    this.gameCards = gameCards; 
    this.currentPlayer = player1; 
    this.boardBorder = document.getElementById('gameboard'); 
  }

  loadPieceImgs = () => {
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

    mouseClick = (event) => {
    const board = gameboard.getBoundingClientRect();
    const mouseX = event.clientX - board.left;
    const mouseY = event.clientY - board.top;
    cellX = Math.floor(mouseX / cellSize);
    console.log('cellX', cellX, mouseX)
    cellY = Math.floor(mouseY / cellSize);
    console.log('cellY', cellY, mouseY)
    console.log('selectedPiece', selectedPiece);
    return { cellX, cellY };
  };
  
    selectPiece = (event) => {
    const { cellX , cellY } = mouseClick(event);
    selectedPiece = piecePositions.find((piece) => {
      return piece.row === cellY && piece.col === cellX;
    });
    if (!selectedPiece) pieceSelectionAlert();
    if (currentPlayer === 1) {
      if (selectedPiece.color === player1.color) {
        selectedPiece.selected = true;
      } else {
        pieceSelectionAlert();
      };
  } else if (currentPlayer === 2) {
      if (selectedPiece.color === opponentColor) {
        selectedPiece.selected = true;
      } else {
        pieceSelectionAlert();
      };
    };
  };
  
    highlightSquare = () => {
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


  
// …all the functions related to your game logic
}

let game = new Game(player1, player2)

async function fetchCards() {
  try {
      const response = await fetch('./basecards.json');
      const cards = await response.json();
      return cards;
  } catch (error) {
      console.error("Error fetching cards:", error);
      throw error;
  }
}

(async () => {
  try {
      const movementCards = await fetchCards();
      console.log(movementCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
})();

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

let highlightedSquare, selectedPiece, pieceColor, opponentPieceColor, clickedCard, cellX, cellY, animationStep = 0, invalidMoveCounter = 0



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
  };
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
    };
  } else if (currentPlayer === 2) {
    if (opponentColor) {
      clickedCard = gameCards[cardIndex];
      clickedCard.selected = true;
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (selectedPiece?.color === opponentColor) highlightSquare();
    } else {
      cardSelectionAlert();
    };
  };
};

const createImages = (createCard, i) => {
  const imgArray = document.getElementById("card" + (i + 1));
  imgArray.src = createCard.image;
};

const removeStart = () => {
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'none'
};

const removePass = () => {
  const passTurn = document.getElementById('pass');
  passTurn.style.display = 'none'
};

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
  removePass();
  removeClose();
};

const removeClose = () => {
  const closeButton1 = document.getElementById('closeButtonAlert')
  const closeButton2 = document.getElementById('newGameCloseButton')
  closeButton1.style.visibility = 'hidden'
  closeButton2.style.visibility = 'hidden'
};

const invalidMoveAlert = () => {
  if (invalidMoveCounter < 3) {
  triggerAlert('Invalid Move');
  removeStart();
  invalidMoveCounter ++;
  console.log(invalidMoveCounter);
  removePass();
} else {
    passAlert()
  };
};

const passAlert = () => {
  triggerAlert('Would you like to pass?')
  removeStart();
  const passTurn = document.getElementById('pass');
  passTurn.style.display = 'block'
  invalidMoveCounter = 0;
};

const passTrigger = () => {
  switchCards();
  switchPlayers();
};

const cardSelectionAlert = () => {
  triggerAlert('Please select a Card')
  removeStart();
  removePass();
  resetCards();
};

const pieceSelectionAlert = () => {
  triggerAlert('Select A Piece')
  removeStart();
  removePass();
  updateBoard();
  resetGameboard();
};

const getOpponentColor = () => {
  if (currentPlayer === 1) return opponentColor;
  return player1.color;
};

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

const animatePiece = () => {
  const totalSteps = 30;
  if (animationStep < totalSteps) {
    const currentX = selectedPiece.startX + (selectedPiece.targetX - selectedPiece.startX) * (animationStep / totalSteps);
    const currentY = selectedPiece.startY + (selectedPiece.targetY - selectedPiece.startY) * (animationStep / totalSteps);
    ctx.clearRect(0, 0, gameboard.width, gameboard.height);
    drawGameboard();
    piecePositions.forEach((piece) => {
      if (piece !== selectedPiece) {
        const img = pieceImgs[piece.color][piece.piece];
        ctx.drawImage(img, piece.col * cellSize, piece.row * cellSize, cellSize, cellSize);
      }
    });
    const img = pieceImgs[selectedPiece.color][selectedPiece.piece];
    ctx.drawImage(img, currentX, currentY, cellSize, cellSize);
    animationStep++;
    requestAnimationFrame(animatePiece);
  };
};

const movePiece = (event, selectedPiece) => {
  if (selectedPiece.color !== getCurrentPlayerColor()) {
    return;
  };
  const moves = createValidMoves(highlightSquare(event));
  const { cellX , cellY } = mouseClick(event);
  const isValidMove = moves?.find((move) => move.x === cellX && move.y === cellY);
  selectedPiece.startX = selectedPiece.col * cellSize;
  selectedPiece.startY = selectedPiece.row * cellSize;
  selectedPiece.targetX = cellX * cellSize;
  selectedPiece.targetY = cellY * cellSize;
  animationStep = 0;

  const pieceCheck = piecePositions.find((piece) => {
    const pieceColorCheck = piece.color === getCurrentPlayerColor();
    return piece.row === cellY && piece.col === cellX && pieceColorCheck;
  });
  if (selectedPiece.startX === selectedPiece.targetX && selectedPiece.startY === selectedPiece.targetY) {
    resetGameboard();
    loadPieceImgs();
  } else {
    if (isValidMove && !pieceCheck) {
      selectedPiece.row = cellY;
      selectedPiece.col = cellX;
      switchCards();
      animatePiece();
  
        if (cellX === 2 && cellY === 0 && currentPlayer === 1
            || cellX === 2 && cellY === 4 && currentPlayer === 2) 
            gameOver(); 

      removePiece();
      switchPlayers();  
    } else {
        invalidMoveAlert();
        };
  resetGameboard();
  clickedCard = null;
  loadPieceImgs();
  };
};

const resetGameboard = () => {
  clickedCard.selected = false;
  selectedPiece.selected = false;
 // clickedCard = null;
  cellX = null;
  cellY = null;
 // resetCards();
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
    };
};

// Convert color to include alpha for transparency on the board.
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

// Select random cards for game use out of possible 16.
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

// Visual cue to show whos turn it is.
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