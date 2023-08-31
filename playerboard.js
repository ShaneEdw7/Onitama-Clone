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



const canvasReverse = '/images/canvas_background-reverse.png';

const createImages = (createCard, i) => {
  console.log('createImages function')
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
// Select random cards for game use out of possible 16.
const randomCard = async () => {
  console.log('randomCard function')
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
  console.log('getOpponentColor function')
  console.log(playercolor)
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
    this.currentPlayer = player1;
    this.boardBorder = document.getElementById('gameboard');
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
  this.selectedPiece
  this.pieceColor
  this.opponentPieceColor
  this.clickedCard
  this.animationStep = 0
  this.invalidMoveCounter = 0;
};
  // Visual cue to show whos turn it is.
updateBoardColor() {
  console.log('updateBoardColor function')
  const boardBorder = document.getElementById('gameboard');
  console.log(this.gameCards);
  console.log(this.getCurrentPlayerColor())
if (this.gameCards[4].color === this.getCurrentPlayerColor()) {
  boardBorder.style.borderWidth = "5px"
  boardBorder.style.borderColor = this.getCurrentPlayerColor();
  boardBorder.style.borderSpacing = '5px';
} else {
  boardBorder.style.borderWidth = "5px"
  boardBorder.style.borderColor = this.getCurrentPlayerColor();
  boardBorder.style.borderSpacing = '5px';
  };
};

getCurrentPlayerColor = () => {
  
  if(this.currentPlayer.color === this.player1.color) return player1.color
  console.log(this.currentPlayer.color === this.player1.color,'currentplayer = this.player')
  return this.player2.color;
};

drawGameboard = () => {
  console.log('drawGameboard function')
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
  console.log('switchPlayers function')
  if (this.currentPlayer.color === this.player1.color) {
    this.currentPlayer = this.player2
    this.boardBorder.style.borderColor = player2.color
    this.boardBorder.style.borderSpacing = '5px';
    } else {
      this.currentPlayer = this.player2
      this.boardBorder.style.borderColor = player1.color;
      this.boardBorder.style.borderSpacing = '5px';
      };
  };

  loadPieceImgs = () => {
    console.log('loadpieceimgs function')
    console.log(this.piecePositions,'piecepositions')
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
    console.log('updateboard function')
    ctx.clearRect(0,0, gameboard.width, gameboard.height);
    this.loadPieceImgs();
    this.drawGameboard();
    };

  initializeGame() {
    console.log('initializing')
    this.getCurrentPlayerColor();
    this.drawGameboard();
    this.loadPieceImgs();
    this.updateBoardColor();
  };

  mouseClick = (event) => {
    console.log('mouseClick function')
    const board = gameboard.getBoundingClientRect();
    const mouseX = event.clientX - board.left;
    const mouseY = event.clientY - board.top;
    const cellX = Math.floor(mouseX / cellSize);
    const cellY = Math.floor(mouseY / cellSize);
    return { cellX, cellY };
  };

  // Convert color to include alpha for transparency on the board.
  colorConverter(color, alpha) {
    console.log('colorConverter function')
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
    console.log('handlePlayerclick')
    console.log(this.selectedPiece)
    this.selectedPiece = this.piecePositions.find((piece) => piece.selected === true)
    console.log(this.clickedCard)
    console.log(this.selectedPiece)
    if (this.clickedCard) {
      console.log('this.clickedCard true')
      if (this.selectedPiece) {
        console.log('this.selectedPiece true')
        this.movePiece(event, this.selectedPiece)
      } else { 
        console.log('this.selectedPiece false')
        this.selectPiece(event);
        this.updateBoard();
        };
      } else {
        console.log('this.clickedCard false')
        this.cardSelectionAlert;
        this.updateBoard;
      };
  };

  selectPiece = (event) => {
    console.log('selectPiece function')
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
    console.log(this.selectedPiece)
    // this.updateBoard();
   // return this.selectedPiece
  };

   
    highlightSquare = (event) => {
      console.log('highlightSquare function')
      const { cellX , cellY } = this.mouseClick(event);
    const alpha = 0.2;
      this.pieceColor = this.colorConverter(this.player1.color, alpha);
      this.opponentPieceColor = this.colorConverter(this.player2.color, alpha)
      ctx.clearRect(0,0, gameboard.width, gameboard.height);
      this.drawGameboard();
  
  
      const validMoves = []
      console.log('this.selectedPiece.color', this.selectedPiece.color);
      console.log('this.clickedCard', this.clickedCard);
      this.clickedCard?.movement.forEach((movement) => {
        console.log('this.clickedCard.movement', this.clickedCard.movement)
        const movementCardX = movement.x;
        let movementCardY = movement.y;
        console.log(movementCardY,'movementcardY before')
        console.log('does this.selectedPiece.color = player1.color?', this.selectedPiece.color !== this.player1.color)
          if(this.selectedPiece.color !== this.player1.color) {
            console.log(this.selectedPiece.color !== this.player1.color,'piece != player color')
              movementCardY = -movement.y;
              console.log(movementCardY,'movementcardY after')
              }
              console.log(validMoves, 'validMoves')
        validMoves.push({x: movementCardX, y: movementCardY});    
          for (let row = 0; row < numCells; row++) {
            for (let col = 0; col < numCells; col++) {
              const x = col * cellSize;
              const y = row * cellSize;
              const selectedPieceX = col - movementCardX;
              const selectedPieceY = row - movementCardY;
                  if (selectedPieceX === cellX && selectedPieceY === cellY) 
                  console.log(selectedPieceX === cellX && selectedPieceY === cellY,'pieceX = cellX and pieceY = cellY')
                  {
                    if (this.selectedPiece.color === this.player1.color) {
                      console.log(this.selectedPiece.color === this.player1.color, '*** piece color = player color')  
                      ctx.fillStyle = this.pieceColor;
                      ctx.fillRect(x, y, cellSize, cellSize);
                    } else {
                      console.log(this.selectedPiece.color !== this.player1.color, '*** * piece color != player color')
                      ctx.fillStyle = this.opponentPieceColor;
                      ctx.fillRect(x, y, cellSize, cellSize);
                    };
                  };
              };
          };
      });
      console.log('validMoves', validMoves)
    return validMoves;
  };

selectCard(cardId, cardIndex, playerColor){
  console.log('selectCard function')
  console.log(this.currentPlayer,'this.currentPlayer', '=', cardIndex, 'cardIndex')
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
    console.log('this.currentPlayer === 1 true')
    if (player1.color) {
      console.log('player1.color true')
      this.clickedCard = this.gameCards[cardIndex];
      this.clickedCard.selected = true;
      console.log('this.clickedCard.selected true')
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (this.selectedPiece?.color === player1.color) console.log('piece.color = playercolor'), this.highlightSquare(event);
    } else {
      console.log('player.color false')
      this.cardSelectionAlert();
    };
  } else if (this.currentPlayer === this.player2) {
    console.log('this.currentPlayer = 2')
    if (this.player2.color) {
      console.log('player2.color true')
      this.clickedCard = this.gameCards[cardIndex];
      this.clickedCard.selected = true;
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (this.selectedPiece?.color === this.player2.color) console.log('piece.color = playercolor'),this.highlightSquare(event);
    } else {
      console.log('player.color false')
      this.cardSelectionAlert();
      };
    };
  };
  updateBoard();
  this.loadPieceImgs()
  this.updateBoard();
  console.log(this.clickedCard)
};

switchCards() {
  console.log('switchCards function')
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
  console.log('removePiece function')
  const pieceToRemove = this.piecePositions.find((piece) => {
    return piece.row === cellY && piece.col === cellX && piece.color === getOpponentColor();
  });
  console.log(piecetoRemove, 'piecetoRemove')
  if (pieceToRemove) {
    if(pieceToRemove.piece === 'master') {
      this.gameOver();
     };
    const index = this.piecePositions.indexOf(pieceToRemove);
    this.piecePositions.splice(index, 1);
  };
};

createValidMoves = (moves) => {
  console.log('createValidMoves function')
  console.log(this.selectedPiece)
  const newMoves = moves?.map((move) => {
    return {x: move.x + this.selectedPiece.col, y: move.y + this.selectedPiece.row}
  });
  return newMoves;
};

movePiece = (event, selectedPiece) => {
  console.log('movePiece function')
  if (selectedPiece.color !== this.getCurrentPlayerColor()) {
    console.log('selectedPiece.color != currentplayercolor')
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
    const pieceColorCheck = piece.color === this.getCurrentPlayerColor();
    return piece.row === cellY && piece.col === cellX && pieceColorCheck;
  });
  console.log(pieceCheck,'pieceCheck');
  console.log(this.piecePositions, 'this.piecePositions');
  if (selectedPiece.startX === selectedPiece.targetX && selectedPiece.startY === selectedPiece.targetY) {
    console.log('resetGame')
    this.resetGameboard();
    this.loadPieceImgs();
  } else {
    if (isValidMove && !pieceCheck) {
      console.log('isValidMove & !pieceCheck', isValidMove && !pieceCheck)
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
  console.log('animatePiece function')
  const totalSteps = 30;
  if (this.animationStep < totalSteps) {
    const currentX = this.selectedPiece.startX + (this.selectedPiece.targetX - this.selectedPiece.startX) * (this.animationStep / totalSteps);
    const currentY = this.selectedPiece.startY + (this.selectedPiece.targetY - this.selectedPiece.startY) * (this.animationStep / totalSteps);
    ctx.clearRect(0, 0, gameboard.width, gameboard.height);
    this.drawGameboard();
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
  console.log('resetGameboard function')
  this.clickedCard.selected = false;
  this.selectedPiece.selected = false;
 // this.clickedCard = null;
  cellX = null;
  cellY = null;
 // resetCards();
};

cardSelectionAlert = () => {
  console.log('cardSelectionAlert function')
  this.triggerAlert('Please select a Card')
  this.removeStart();
  this.removePass();
  this.resetCards();
};

resetCards = () => {
  console.log('resetCards function')
  const allCards = Array.from(document.getElementsByClassName('card'));
  allCards.forEach((card) => {
    card.style.borderWidth = '0px'
    card.selected = false
});
};

removeStart = () => {
  console.log('removeStart function')
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'none'
};

removePass = () => {
  console.log('removePass function')
  const passTurn = document.getElementById('pass');
  passTurn.style.display = 'none'
};

triggerAlert = (alertMessage) => {
  console.log('triggerAlert function')
  const myModal = new bootstrap.Modal(document.getElementById('alert'));
  myModal.show();
  document.getElementById('modalText').innerText = alertMessage;
};

gameOver = () => {
  console.log('gameOver function')
  const winner = getCurrentPlayerColor();
  this.triggerAlert(`Game Over. ${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`);
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'block'
  this.removePass();
  this.removeClose();
};

removeClose = () => {
  console.log('removeClose function')
  const closeButton1 = document.getElementById('closeButtonAlert')
  const closeButton2 = document.getElementById('newGameCloseButton')
  closeButton1.style.visibility = 'hidden'
  closeButton2.style.visibility = 'hidden'
};

invalidMoveAlert = () => {
  console.log('invalidMoveAlert function')
  if (this.invalidMoveCounter < 3) {
  this.triggerAlert('Invalid Move');
  this.removeStart();
  this.invalidMoveCounter ++;
  console.log(this.invalidMoveCounter);
  this.removePass();
} else {
    this.passAlert()
  };
};

passAlert = () => {
  console.log('passAlert function')
  this.triggerAlert('Would you like to pass?')
  this.removeStart
  const passTurn = document.getElementById('pass');
  passTurn.style.display = 'block'
  this.invalidMoveCounter = 0;
};

passTrigger = () => {
  console.log('passTrigger function')
  this.switchCards();
  this.switchPlayers();
};

pieceSelectionAlert = () => {
  console.log('pieceSelectionAlert function')
  this.triggerAlert('Select A Piece')
  this.removeStart();
  this.removePass();
  this.updateBoard();
  // this.resetGameboard();
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
  console.log(game.piecePositions,'piecepositions')
  game.initializeGame();
  gameboard.addEventListener('click', game.handlePlayerClick, game.selectPiece);
  gameboard.addEventListener('click', game.highlightSquare);
});