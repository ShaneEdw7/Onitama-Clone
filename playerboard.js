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

const difficulty = localStorage.getItem('difficulty');  
const playercolor = localStorage.getItem('playercolor');
let player1, player2, game, movementCards = {}, commonCard

const createImages = (createCard, i) => {
  const imgArray = document.getElementById("card" + (i + 1));
  imgArray.src = createCard.image;
  };

  const fetchCards = async () => {
    try {
        const response = await fetch('./basecards.json');
        const cards = await response.json();
        return cards;
    } catch (error) {
        console.error("Error fetching cards:", error);
        throw error;
    }
  } 
// Select random cards for game use out of base cards.
const randomCard = async () => {
  try {
    const movementCards = await fetchCards();
    const gameCards = [];
  for (let i = 0; i < 5; i++) {
    const selectedCards = Object.keys(movementCards);
    const randomIndex = Math.floor(Math.random() * selectedCards.length);
    const selectedCard = selectedCards[randomIndex];
    const chosenOne = movementCards[selectedCard]
    gameCards.push(chosenOne);
    delete movementCards[selectedCard];
    selectedCards.splice(randomIndex, 1);
    createImages(gameCards[i], i);
    };
    return gameCards;
  } 
  catch (error) {
    console.error("Error fetching cards:", error);
  }
}

const getOpponentColor = () => {
  if (playercolor === 'red') return 'blue'
  return 'red'
};

 class Card {
  constructor(name, color, image, movement) {
      this.name = name;
      this.color = color;
      this.image = image;
      this.movement = movement;
      this.selected = false;
  };
    };
class Player {
  constructor(color, cards = []) {
      this.color = color;
      this.cards = cards;
  }
};
class Game { 

  constructor(player1, player2, gameCards) 
  { this.player1 = player1;
    this.player2 = player2;
    this.gameCards = gameCards;
    this.currentPlayer = player1
    this.pieceImgs = {
      blue: {},
      red: {}
    };
    this.pieceTypes = ['student', 'master'];
  
    this.piecePositions = [
    { row: 0, col: 0, piece: "student", color: this.player2.color },
    { row: 0, col: 1, piece: "student", color: this.player2.color },
    { row: 0, col: 4, piece: "student", color: this.player2.color },
    { row: 0, col: 3, piece: "student", color: this.player2.color },
    { row: 0, col: 2, piece: "master", color: this.player2.color },
  
    { row: 4, col: 0, piece: "student", color: this.player1.color },
    { row: 4, col: 1, piece: "student", color: this.player1.color },
    { row: 4, col: 4, piece: "student", color: this.player1.color },
    { row: 4, col: 3, piece: "student", color: this.player1.color },
    { row: 4, col: 2, piece: "master", color: this.player1.color },
  ];
  this.selectedPiece = null
  this.clickedCard
  this.animationStep = 0
  this.invalidMoveCounter = 0;
};
// Determine Start Player & Visual cue to show whos turn it is.
determineStartPlayer = () => {
  const board = document.getElementById('gameboard');
if (this.gameCards[4].color === this.getCurrentPlayerColor()) {
  this.currentPlayer = this.player1
  board.style.borderWidth = "5px"
  board.style.borderColor = this.getCurrentPlayerColor();
  board.style.borderSpacing = '5px'; 
} else {
  this.currentPlayer = this.player2
  board.style.borderWidth = "5px"
  board.style.borderColor = getOpponentColor();
  board.style.borderSpacing = '5px';
  };
};

getCurrentPlayerColor = () => { 
  if(this.currentPlayer.color === this.player1.color) return this.player1.color 
  return this.player2.color;
};

drawGameboard = () => {
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

switchPlayers() {
  const board = document.getElementById('gameboard');
  if (this.currentPlayer === this.player1) {
    this.currentPlayer = this.player2
    board.style.borderColor = this.player2.color
    board.style.borderSpacing = '5px';
    } else {
      this.currentPlayer = this.player1
      board.style.borderColor = this.player1.color;
      board.style.borderSpacing = '5px';
      };
  };

  loadPieceImgs = () => {
    this.pieceTypes.forEach((pieceType) => {
      const redPiece = new Image();
      redPiece.onload = () => {
        this.piecePositions.forEach((position) => {
          const { row, col, piece, color } = position;
          const x = col * cellSize;
          const y = row * cellSize;
          const img = this.pieceImgs[color][piece];
          ctx.drawImage(img, x, y, cellSize, cellSize);
        });
      }
      redPiece.src = `images/red_${pieceType}.png`;
      this.pieceImgs.red[pieceType] = redPiece;
  
      const bluePiece = new Image();
      bluePiece.onload = () => {
        this.piecePositions.forEach((position) => {
          const { row, col, piece, color } = position;
          const x = col * cellSize;
          const y = row * cellSize;
      
          const img = this.pieceImgs[color][piece];
          ctx.drawImage(img, x, y, cellSize, cellSize);
        });
      };
      bluePiece.src = `images/blue_${pieceType}.png`;
      this.pieceImgs.blue[pieceType] = bluePiece;
    });
  };

  updateBoard = () => {
    ctx.clearRect(0,0, gameboard.width, gameboard.height);
   // this.drawGameboard();
    this.loadPieceImgs();
    };

  initializeGame() {
    console.log('initializing')
    this.getCurrentPlayerColor();
   // this.drawGameboard();
    this.loadPieceImgs();
    this.determineStartPlayer();
    console.log('finished initializing')
  };

  mouseClick = (event) => {
    const board = gameboard.getBoundingClientRect();
    const mouseX = event.clientX - board.left;
    const mouseY = event.clientY - board.top;
    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);
    return { cellX, cellY };
  };

  // Convert color to include alpha for transparency on the board.
  colorConverter(color, alpha) {
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

  handlePlayerClick = (event) => {
    this.selectedPiece = this.piecePositions.find((piece) => piece.selected === true)
    if (this.clickedCard) {
      if (this.selectedPiece) {
        this.movePiece(event, this.selectedPiece)
      } else { 
        this.selectPiece(event);
        this.updateBoard();
        };
      } else {
        this.cardSelectionAlert;
        this.updateBoard;
      };
    }; 

  selectPiece = (event) => {
    const { cellX , cellY } = this.mouseClick(event);
    this.selectedPiece = this.piecePositions.find((piece) => {
    return piece.row === cellY && piece.col === cellX;
    });
    if (!this.selectedPiece) this.pieceSelectionAlert();
    if (this.currentPlayer === this.player1) {
      if (this.selectedPiece.color === this.player1.color) {
        this.selectedPiece.selected = true;
      } else {
        this.pieceSelectionAlert();
      };
  } else if (this.currentPlayer === this.player2) {
      if (this.selectedPiece.color === this.player2.color) {
        this.selectedPiece.selected = true;
      } else {
        this.pieceSelectionAlert;
      };
    };
  };

   
    highlightSquare = (event) => {
      const { cellX , cellY } = this.mouseClick(event);
    const alpha = 0.2;
    const pieceColor = this.colorConverter(this.player1.color, alpha);
    const opponentPieceColor = this.colorConverter(this.player2.color, alpha)
      ctx.clearRect(0,0, gameboard.width, gameboard.height);
     // this.drawGameboard();

      const validMoves = []
      this.clickedCard?.movement.forEach((movement) => {
        const movementCardX = movement.x;
        let movementCardY = movement.y;
          if(this.selectedPiece.color !== this.player1.color) {
              movementCardY = -movement.y;
              }
        validMoves.push({x: movementCardX, y: movementCardY});    
          for (let row = 0; row < numCells; row++) {
            for (let col = 0; col < numCells; col++) {
              const x = col * cellSize;
              const y = row * cellSize;
              const selectedPieceX = col - movementCardX;
              const selectedPieceY = row - movementCardY;
                  if (selectedPieceX === cellX && selectedPieceY === cellY) 
                  {
                    if (this.selectedPiece.color === this.player1.color) {
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

selectCard(cardId, cardIndex, playerColor){
  if ((this.currentPlayer === this.player1 && cardIndex > 1) || (this.currentPlayer === this.player2 && cardIndex < 2)) {
    return;
  };
  const selectedCard = document.getElementById(cardId);
  this.gameCards.forEach((card) => {
    card.selected = false;
  });
  const allCards = Array.from(document.getElementsByClassName('card'));
  allCards.forEach((card) => {
    card.style.borderWidth = '0px';
  });
  const updateBoard = () => {
  if (this.currentPlayer === this.player1) {
    if (this.player1.color) {
      this.clickedCard = this.gameCards[cardIndex];
      this.clickedCard.selected = true;
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (this.selectedPiece?.color === this.player1.color) this.highlightSquare();
    } else {
      this.cardSelectionAlert();
    };
  } else if (this.currentPlayer === this.player2) {
    if (this.player2.color) {
      this.clickedCard = this.gameCards[cardIndex];
      this.clickedCard.selected = true;
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (this.selectedPiece?.color === this.player2.color) this.highlightSquare();
    } else {
      this.cardSelectionAlert();
      };
    };
    console.log(this.clickedCard)
  };
  updateBoard();
  this.updateBoard();
};

switchCards() {
  commonCard = this.gameCards.pop();
  this.gameCards.push(this.clickedCard);
  const temp = this.gameCards.indexOf(this.clickedCard);
  this.gameCards[temp] = commonCard;
  commonCard = this.gameCards[temp];
  this.gameCards.forEach((gameCard, i) => {
    createImages(gameCard, i)
    });
    this.clickedCard.selected = false;
    this.resetCards();
};

removePiece = (cellX,cellY) => {
  const pieceToRemove = this.piecePositions.find((piece) => {
    return piece.row === cellY && piece.col === cellX && piece.color !== this.getCurrentPlayerColor();
  });
  if (pieceToRemove) {
    if(pieceToRemove.piece === 'master') {
      this.gameOver();
     };
    const index = this.piecePositions.indexOf(pieceToRemove);
    this.piecePositions.splice(index, 1);
  };
};

createValidMoves = (moves) => {
  const newMoves = moves?.map((move) => {
    return {x: move.x + this.selectedPiece.col, y: move.y + this.selectedPiece.row}
  });
  return newMoves;
};

movePiece = (event, selectedPiece) => {
  if (selectedPiece.color !== this.getCurrentPlayerColor()) {
    return;
  };
  const moves = this.createValidMoves(this.highlightSquare(event));
  const { cellX , cellY } = this.mouseClick(event);
  const isValidMove = moves?.find((move) => move.x === cellX && move.y === cellY);
  selectedPiece.startX = selectedPiece.col * cellSize;
  selectedPiece.startY = selectedPiece.row * cellSize;
  selectedPiece.targetX = cellX * cellSize;
  selectedPiece.targetY = cellY * cellSize;
  this.animationStep = 0;

  const pieceCheck = this.piecePositions.find((piece) => {
    const pieceColorCheck = this.getCurrentPlayerColor() === piece.color;
    return piece.row === cellY && piece.col === cellX && pieceColorCheck;
  });
  if (selectedPiece.startX === selectedPiece.targetX && selectedPiece.startY === selectedPiece.targetY) {
    this.resetGameboard();
    this.loadPieceImgs();
  } else {
    if (isValidMove && !pieceCheck) {
      selectedPiece.row = cellY;
      selectedPiece.col = cellX;
      this.switchCards();
      this.animatePiece();
  
        if (cellX === 2 && cellY === 0 && this.currentPlayer === this.player1
            || cellX === 2 && cellY === 4 && this.currentPlayer === this.player2) 
            this.gameOver(); 
      this.removePiece(cellX,cellY);
      this.switchPlayers();  
    } else {
        this.invalidMoveAlert();
        };
  this.resetGameboard();
  this.clickedCard = null;
  this.loadPieceImgs();
  };
};

animatePiece = () => {
  const totalSteps = 50;
  if (this.animationStep < totalSteps) {
    const currentX = this.selectedPiece.startX + (this.selectedPiece.targetX - this.selectedPiece.startX) * (this.animationStep / totalSteps);
    const currentY = this.selectedPiece.startY + (this.selectedPiece.targetY - this.selectedPiece.startY) * (this.animationStep / totalSteps);
    ctx.clearRect(0, 0, gameboard.width, gameboard.height);
   // this.drawGameboard();
    this.piecePositions.forEach((piece) => {
      if (piece !== this.selectedPiece) {
        const img = this.pieceImgs[piece.color][piece.piece];
        ctx.drawImage(img, piece.col * cellSize, piece.row * cellSize, cellSize, cellSize);
      }
    });
    const img = this.pieceImgs[this.selectedPiece.color][this.selectedPiece.piece];
    ctx.drawImage(img, currentX, currentY, cellSize, cellSize);
    this.animationStep++;
    requestAnimationFrame(this.animatePiece);
  };
};

resetGameboard = () => {
  this.clickedCard.selected = false;
  this.selectedPiece.selected = false;
 // this.clickedCard = null;
  this.cellX = null;
  this.cellY = null;
 // this.resetCards();
};

cardSelectionAlert = () => {
  this.triggerAlert('Please select a Card')
  this.removeStart();
  this.removePass();
  this.resetCards();
};

resetCards = () => {
  const allCards = Array.from(document.getElementsByClassName('card'));
  allCards.forEach((card) => {
    card.style.borderWidth = '0px'
    card.selected = false
});
};

removeStart = () => {
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'none'
};

removePass = () => {
  const passTurn = document.getElementById('pass');
  passTurn.style.display = 'none'
};

triggerAlert = (alertMessage) => {
  const myModal = new bootstrap.Modal(document.getElementById('alert'));
  myModal.show();
  document.getElementById('modalText').innerText = alertMessage;
};

gameOver = () => {
  const winner = this.getCurrentPlayerColor();
  this.triggerAlert(`Game Over. ${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`);
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'block'
  this.removePass();
  this.removeClose();
};

removeClose = () => {
  const closeButton1 = document.getElementById('closeButtonAlert')
  const closeButton2 = document.getElementById('newGameCloseButton')
  closeButton1.style.visibility = 'hidden'
  closeButton2.style.visibility = 'hidden'
};

invalidMoveAlert = () => {
  if (this.invalidMoveCounter < 3) {
  this.triggerAlert('Invalid Move');
  this.removeStart();
  this.invalidMoveCounter ++;
  this.removePass();
} else {
    this.passAlert()
  };
};

passAlert = () => {
  this.triggerAlert('Would you like to pass?')
  this.removeStart
  const passTurn = document.getElementById('pass');
  passTurn.style.display = 'block'
  this.invalidMoveCounter = 0;
};

passTrigger = () => {
  this.switchCards();
  this.switchPlayers();
};

pieceSelectionAlert = () => {
  this.triggerAlert('Select A Piece')
  this.removeStart();
  this.removePass();
  this.updateBoard();
  this.resetGameboard();
  };
};

      // Canvas (Gameboard)
      const gameboard = document.getElementById("gameboard");
      const ctx = gameboard.getContext("2d");
      const boardSize = gameboard.width;
      const numCells = 5;
      const cellSize = boardSize / numCells;


randomCard().then((gameCards) => {
  commonCard = gameCards[4];
  player1 = new Player(localStorage.getItem('playercolor'), gameCards.slice(0,2)); 
  player2 = new Player(getOpponentColor(), gameCards.slice(2,4));
  game = new Game(player1, player2, gameCards)
  game.initializeGame();
  gameboard.addEventListener('click', game.handlePlayerClick, game.selectPiece);
  gameboard.addEventListener('click', game.highlightSquare);
});