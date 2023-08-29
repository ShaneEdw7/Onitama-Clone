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

let movement, player1, player2, game, movementCards = {}, commonCard, piecePositions = [], currentPlayer = 1, highlightedSquare, selectedPiece, pieceColor, opponentPieceColor, clickedCard, cellX, cellY, animationStep = 0, invalidMoveCounter = 0;

const canvasReverse = '/images/canvas_background-reverse.png';

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
// Select random cards for game use out of possible 16.
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

const getOpponentColor = (playercolor) => {
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
  };
  

  // Visual cue to show whos turn it is.
updateBoardColor() {
  const boardBorder = document.getElementById('gameboard');
  console.log(this.gameCards);
if (this.gameCards[4].color === this.player1.color) {
  currentPlayer = 1
  boardBorder.style.borderWidth = "5px"
  boardBorder.style.borderColor = player1.color;
  boardBorder.style.borderSpacing = '5px';
} else {
  currentPlayer = 2
  boardBorder.style.borderWidth = "5px"
  boardBorder.style.borderColor = this.player2.color;
  boardBorder.style.borderSpacing = '5px';
  };
};

getCurrentPlayerColor = () => {
  if(currentPlayer === 1) return player1.color
  return thisplayer2.color;
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
  if (currentPlayer === 1) {
    currentPlayer = 2
    boardBorder.style.borderColor = player2.color
    boardBorder.style.borderSpacing = '5px';
    } else {
      currentPlayer = 1
      boardBorder.style.borderColor = player1.color;
      boardBorder.style.borderSpacing = '5px';
      };
  };

  loadPieceImgs = () => {
    
    piecePositions = [
      { row: 0, col: 0, piece: "student", color: this.player2.color },
      { row: 0, col: 1, piece: "student", color: this.player2.color },
      { row: 0, col: 4, piece: "student", color: this.player2.color },
      { row: 0, col: 3, piece: "student", color: this.player2.color },
      { row: 0, col: 2, piece: "master", color: this.player2.color },
    
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

  updateBoard = () => {
    ctx.clearRect(0,0, gameboard.width, gameboard.height);
    this.loadPieceImgs();
    this.drawGameboard();
    };

  initializeGame() {
    this.getCurrentPlayerColor();
    this.drawGameboard();
    this.loadPieceImgs();
    this.updateBoard();
    this.updateBoardColor();
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
    selectedPiece = piecePositions.find((piece) => piece.selected === true)
    console.log(clickedCard)
    console.log(selectedPiece)
    if (clickedCard) {
      console.log(selectedPiece)
      if (selectedPiece) {
        console.log(this.movement.movePiece());
        this.movement.movePiece(event, selectedPiece)
      } else { this.selectPiece(event)
        this.updateBoard();
        };
      } else {
        this.cardSelectionAlert;
        this.updateBoard;
      };
  };
  selectPiece = (event) => {
    const { cellX , cellY } = this.mouseClick(event);
    selectedPiece = piecePositions.find((piece) => {
      return piece.row === cellY && piece.col === cellX;
    });
    if (!selectedPiece) this.pieceSelectionAlert();
    if (currentPlayer === 1) {
      if (selectedPiece.color === this.player1.color) {
        selectedPiece.selected = true;
      } else {
        this.pieceSelectionAlert();
      };
  } else if (currentPlayer === 2) {
      if (selectedPiece.color === this.player2.color) {
        selectedPiece.selected = true;
      } else {
        this.pieceSelectionAlert;
      };
    };
    console.log(selectedPiece)
    return selectedPiece
  };
   
    highlightSquare = () => {
    const alpha = 0.2;
      pieceColor = this.colorConverter(this.player1.color, alpha);
      opponentPieceColor = this.colorConverter(this.player2.color, alpha)
      ctx.clearRect(0,0, gameboard.width, gameboard.height);
      this.drawGameboard();
  
  
      const validMoves = []
      console.log(selectedPiece.color)
      clickedCard.movement.forEach((movement) => {
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
                    if (selectedPiece.color === this.player1.color) {  
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
  if ((currentPlayer === 1 && cardIndex > 1) || (currentPlayer === 2 && cardIndex < 2)) {
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
  if (currentPlayer === 1) {
    if (player1.color) {
      clickedCard = this.gameCards[cardIndex];
      clickedCard.selected = true;
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (selectedPiece?.color === player1.color) this.highlightSquare();
    } else {
      cardSelectionAlert();
    };
  } else if (currentPlayer === 2) {
    if (this.player2.color) {
      clickedCard = this.gameCards[cardIndex];
      clickedCard.selected = true;
      selectedCard.style.borderColor = playerColor;
      selectedCard.style.borderWidth = '2px';
      if (selectedPiece?.color === this.player2.color) this.highlightSquare(ctx);
    } else {
      cardSelectionAlert();
      };
    };
  };
  updateBoard();
this.updateBoard();
};

switchCards() {
  commonCard = gameCards.pop();
  gameCards.push(clickedCard);
  const temp = gameCards.indexOf(clickedCard);
  gameCards[temp] = commonCard;
  commonCard = gameCards[temp];
  gameCards.forEach((gameCard, i) => {
    this.createImages(gameCard, i)
    });
    clickedCard.selected = false;
    this.resetCards();
};
removePiece() {
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

movePiece(event, selectedPiece) {
  if (selectedPiece.color !== this.getCurrentPlayerColor()) {
    return;
  };
  const moves = this.createValidMoves(this.highlightSquare(event));
  const { cellX , cellY } = this.Game.mouseClick(event);
  const isValidMove = moves?.find((move) => move.x === cellX && move.y === cellY);
  selectedPiece.startX = selectedPiece.col * cellSize;
  selectedPiece.startY = selectedPiece.row * cellSize;
  selectedPiece.targetX = cellX * cellSize;
  selectedPiece.targetY = cellY * cellSize;
  animationStep = 0;

  const pieceCheck = piecePositions.find((piece) => {
    const pieceColorCheck = piece.color === this.getCurrentPlayerColor();
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
  
        if (cellX === 2 && cellY === 0 && currentPlayer === 1
            || cellX === 2 && cellY === 4 && currentPlayer === 2) 
            this.Game.gameOver(); 

      this.removePiece();
      this.switchPlayers();  
    } else {
        this.invalidMoveAlert();
        };
  this.resetGameboard();
  clickedCard = null;
  this.loadPieceImgs();
  };
};

animatePiece() {
  const totalSteps = 30;
  if (animationStep < totalSteps) {
    const currentX = selectedPiece.startX + (selectedPiece.targetX - selectedPiece.startX) * (animationStep / totalSteps);
    const currentY = selectedPiece.startY + (selectedPiece.targetY - selectedPiece.startY) * (animationStep / totalSteps);
    ctx.clearRect(0, 0, gameboard.width, gameboard.height);
    this.drawGameboard();
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

createValidMoves(moves){
  console.log(selectedPiece)
  const newMoves = moves?.map((move) => {
    return {x: move.x + selectedPiece.col, y: move.y + selectedPiece.row}
  });
  return newMoves;
};

resetGameboard() {
  clickedCard.selected = false;
  this.selectedPiece.selected = false;
 // clickedCard = null;
  cellX = null;
  cellY = null;
 // resetCards();
};

cardSelectionAlert() {
  this.triggerAlert('Please select a Card')
  this.removeStart();
  this.removePass();
  this.resetCards();
};

resetCards() {
  const allCards = Array.from(document.getElementsByClassName('card'));
  allCards.forEach((card) => {
    card.style.borderWidth = '0px'
    card.selected = false
});
};

removeStart() {
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'none'
};

removePass() {
  const passTurn = document.getElementById('pass');
  passTurn.style.display = 'none'
};

triggerAlert(alertMessage) {
  const myModal = new bootstrap.Modal(document.getElementById('alert'));
  myModal.show();
  document.getElementById('modalText').innerText = alertMessage;
};

gameOver() {
  const winner = getCurrentPlayerColor();
  this.triggerAlert(`Game Over. ${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`);
  const newGameButton = document.getElementById('start');
  newGameButton.style.display = 'block'
  this.removePass();
  this.removeClose();
};

removeClose() {
  const closeButton1 = document.getElementById('closeButtonAlert')
  const closeButton2 = document.getElementById('newGameCloseButton')
  closeButton1.style.visibility = 'hidden'
  closeButton2.style.visibility = 'hidden'
};

invalidMoveAlert() {
  if (invalidMoveCounter < 3) {
  this.triggerAlert('Invalid Move');
  this.removeStart();
  invalidMoveCounter ++;
  console.log(invalidMoveCounter);
  this.removePass();
} else {
    this.passAlert()
  };
};

passAlert() {
  this.triggerAlert('Would you like to pass?')
  this.removeStart
  const passTurn = document.getElementById('pass');
  passTurn.style.display = 'block'
  invalidMoveCounter = 0;
};

passTrigger() {
  this.switchCards();
  this.switchPlayers();
};



pieceSelectionAlert() {
  this.triggerAlert('Select A Piece')
  this.removeStart();
  this.removePass();
  this.updateBoard();
  this.movement.resetGameboard();
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