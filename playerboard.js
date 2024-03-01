const strategyToasts = [
  "Running away is very effective.",
  "Attempting to force your opponent to give up a piece rarely works.",
  "Way of the Stream (moving your master across the board) is a more reliable way to win than the Way of the Stone (capturing the enemy master). ",
  "Way of the Stream is the most effective way to win. This goal becomes easier when the board is empty,",
  "Gradually moving your pieces into a box-shape is a good way to concentrate your army while waiting for the chance to break a stalemate.",
  "If all your disciples die you will be forced to move your master every turn and you will lose the ability to stall.",
  "The player who loses all their disciples quickly gets their master trapped and killed.",
  "Don’t be afraid to use your master.",
  "Force your opponent to one side.",
  "Position your pawns close together in a way where if one were to be taken, one of your other pawns would be able to avenge him.",
  "Don't be afraid to lose a pawn to take a pawn. Especially if you can clear one of the sides of the board to allow your master to pass.",
  "The colours on the squares indicate the favoured direction of movement: green = general, red = right, blue = left. Use this for quick analysis.",
  "Be aware that the movement card you choose will become your opponent's card on the next turn.",
];

// Displays random toast
let toastRunning = false;
let displayToast;

const randomToast = () => {
  const stratTips = document.getElementById("strategyTips");
  const toastMessage = document.getElementById("toastMessage");
  const randomIndex = Math.floor(Math.random() * strategyToasts.length);
  const stratToast = bootstrap.Toast.getOrCreateInstance(stratTips);
  toastMessage.textContent = strategyToasts[randomIndex];
  stratToast.show();
};

// Toggles Random Toast Display
const toggleToast = () => {
  if (toastRunning) {
    clearInterval(displayToast);
  } else {
    randomToast();
    displayToast = setInterval(randomToast, Math.random() * 1000 + 50000);
  }
  toastRunning = !toastRunning;
};

document.getElementById("tips").addEventListener("click", toggleToast);

const colordisplay = document.getElementsByName("color");
colordisplay.forEach((color) => {
  color.addEventListener("click", (event) => {
    localStorage.setItem("playercolor", event.target.value);
  });
});
const gameModeChoice = document.getElementsByName("gameMode");
gameModeChoice.forEach((gameMode) => {
  gameMode.addEventListener("click", (event) => {
    localStorage.setItem("botSelection", event.target.value);
  });
});

const difficulty = localStorage.getItem("difficulty");
const playercolor = localStorage.getItem("playercolor");
const botSelection = localStorage.getItem("botSelection");
let player1,
  player2,
  game,
  movementCards = {},
  commonCard;

const createImages = (createCard, i) => {
  const imgArray = document.getElementById("card" + (i + 1));
  imgArray.src = createCard.image;
};

const fetchCards = async () => {
  try {
    const response = await fetch("./basecards.json");
    const cards = await response.json();
    return cards;
  } catch (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }
};

// Select random cards for game use out of base cards.
const randomCard = async () => {
  try {
    const movementCards = await fetchCards();
    const gameCards = [];
    for (let i = 0; i < 5; i++) {
      const selectedCards = Object.keys(movementCards);
      const randomIndex = Math.floor(Math.random() * selectedCards.length);
      const selectedCard = selectedCards[randomIndex];
      const chosenOne = movementCards[selectedCard];
      gameCards.push(chosenOne);
      delete movementCards[selectedCard];
      selectedCards.splice(randomIndex, 1);
      createImages(gameCards[i], i);
    }
    return gameCards;
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
};
// Determines Opponent Color based on selection when setting up the game
const getOpponentColor = () => {
  if (playercolor === "red") return "blue";
  return "red";
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
class Game {
  constructor(player1, player2, gameCards) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameCards = gameCards;
    this.currentPlayer = player1;
    this.pieceImgs = {
      blue: {},
      red: {},
    };
    this.pieceTypes = ["student", "master"];

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
    this.selectedPiece = null;
    this.clickedCard;
    this.animationStep = 0;
    this.invalidMoveCounter = 0;
    this.gameState = null;
  }

  // Determine Start Player & Visual cue to show whos turn it is.
  determineStartPlayer = () => {
    const board = document.getElementById("gameboard");
    if (this.gameCards[4].color === this.getCurrentPlayerColor()) {
      this.gameState = "player 1";
      this.currentPlayer = this.player1;
      board.style.borderWidth = "5px";
      board.style.borderColor = this.getCurrentPlayerColor();
      board.style.borderSpacing = "5px";
    } else {
      this.gameState = "player 2";
      this.currentPlayer = this.player2;
      board.style.borderWidth = "5px";
      board.style.borderColor = getOpponentColor();
      board.style.borderSpacing = "5px";
      const sideCard = document.getElementById("card5");
      sideCard.style.transform = "rotate(0.5turn)";

      if (botSelection === "bot") {
        game.botTakeTurn();
      }
    }
  };

  getCurrentPlayerColor = () => {
    if (this.currentPlayer.color === this.player1.color)
      return this.player1.color;
    return this.player2.color;
  };
  // Draws Gameboard on Canvas
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
  // Handles Switch of players turn.
  switchPlayers() {
    const board = document.getElementById("gameboard");
    if (this.currentPlayer === this.player1) {
      if (this.gameState === "gameOver") return;
      this.gameState = "player2";
      this.currentPlayer = this.player2;
      board.style.borderColor = this.player2.color;
      board.style.borderSpacing = "5px";
      const sideCard = document.getElementById("card5");
      sideCard.style.transform = "rotate(0.5turn)";
    } else {
      if (this.gameState === "gameOver") return;
      this.gameState = "player1";
      this.currentPlayer = this.player1;
      board.style.borderColor = this.player1.color;
      board.style.borderSpacing = "5px";
      const sideCard = document.getElementById("card5");
      sideCard.style.transform = "rotate(1turn)";
    }
    // Determines if bot was selected or not.
    if (game.currentPlayer === game.player2 && botSelection === "bot") {
      game.botTakeTurn();
    }
  }
  // Loads Pieces and Images and places them in correct places.
  loadPieceType = (pieceType, color) => {
    return new Promise((resolve, reject) => {
      const piece = new Image();
      piece.onload = () => {
        this.pieceImgs[color][pieceType] = piece;
        resolve({ pieceType, color, piece });
      };
      piece.onerror = (error) => reject(error);
      piece.src = `images/${color}_${pieceType}.png`;
    });
  };

  loadPieceImgs = async () => {
    try {
      const redImages = await Promise.all(
        this.pieceTypes.map((pieceType) => this.loadPieceType(pieceType, "red"))
      );
      const blueImages = await Promise.all(
        this.pieceTypes.map((pieceType) =>
          this.loadPieceType(pieceType, "blue")
        )
      );

      this.piecePositions.forEach((position) => {
        const { row, col, piece, color } = position;
        const x = col * cellSize;
        const y = row * cellSize;
        const img =
          color === "red"
            ? redImages.find((img) => img.pieceType === piece)
            : blueImages.find((img) => img.pieceType === piece);

        if (img && img.piece) {
          ctx.drawImage(img.piece, x, y, cellSize, cellSize);
        }
      });
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  initializeGame() {
    this.getCurrentPlayerColor();
    this.loadPieceImgs();
    this.determineStartPlayer();
    if (this.player1.color === "red") {
      gameboard.style.backgroundImage = 'url("images/canvas_background.png")';
    } else {
      gameboard.style.backgroundImage =
        'url("images/canvas_background-reverse.png")';
    }
  }

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
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  }

  handlePlayerClick = (event) => {
    this.selectedPiece = this.piecePositions.find(
      (piece) => piece.selected === true
    );
    if (this.clickedCard) {
      if (this.selectedPiece) {
        this.movePiece(event, this.selectedPiece);
      } else {
        this.selectPiece(event);
      }
    } else {
      this.cardSelectionAlert();
    }
  };

  isWithinBounds(row, col) {
    return row >= 0 && row < numCells && col >= 0 && col < numCells;
  }

  isOwnPieceAt(col, row, color) {
    return this.piecePositions.some(
      (piece) => piece.col === col && piece.row === row && piece.color === color
    );
  }
  // Bot Move Piece
  movePieceSimulation(piece, move) {
    piece.startX = piece.col * cellSize;
    piece.startY = piece.row * cellSize;
    const newRow = piece.row + move.y;
    const newCol = piece.col + move.x;
    piece.row = newRow;
    piece.col = newCol;
    this.animationStep = 0;
    piece.targetX = newCol * cellSize;
    piece.targetY = newRow * cellSize;
    this.selectedPiece = piece;
    this.animatePiece();
    this.removePiece(newCol, newRow);
    this.loadPieceImgs();
  }

  botTakeTurn() {
    this.gameState = "bot_turn";
    if (this.currentPlayer !== this.player2) {
      return;
    }
    // Set timing for bot's turn for "thinking"
    setTimeout(() => {
      const cardIndex = Math.floor(Math.random() * this.player2.cards.length);
      const card = this.gameCards[cardIndex + 2];
      this.selectCard(
        `card${cardIndex + 3}`,
        cardIndex + 2,
        this.player2.color
      );
      let legalMoves = [];
      this.piecePositions.forEach((piece) => {
        if (piece.color === this.player2.color) {
          card.movement.forEach((move) => {
            const newRow = piece.row - move.y;
            const newCol = piece.col - move.x;
            if (
              this.isWithinBounds(newRow, newCol) &&
              !this.isOwnPieceAt(newCol, newRow, this.player2.color)
            ) {
              legalMoves.push({ piece: piece, move: move });
            }
          });
        }
      });
      if (legalMoves.length === 0) {
        setTimeout(() => {
          this.passTrigger();
        }, 1000);
        return;
      }

      setTimeout(() => {
        const move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        this.selectedPiece = move.piece;
        const pieceY = move.piece.row;
        const pieceX = move.piece.col;
        this.highlightSquare(pieceX, pieceY);
        setTimeout(() => {
          this.movePieceSimulation(move.piece, {
            x: -move.move.x,
            y: -move.move.y,
          });

          setTimeout(() => {
            this.switchCards();
            this.switchPlayers();
            legalMoves = [];
          }, 2200);
        }, 2000);
      }, 3000);
    }, 1000);
  }

  selectPiece = (event) => {
    const { cellX, cellY } = this.mouseClick(event);
    this.selectedPiece = this.piecePositions.find((piece) => {
      return piece.row === cellY && piece.col === cellX;
    });
    if (!this.selectedPiece) this.pieceSelectionAlert();
    if (this.currentPlayer === this.player1) {
      if (this.selectedPiece.color === this.player1.color) {
        this.selectedPiece.selected = true;
      } else {
        this.pieceSelectionAlert();
      }
    } else if (this.currentPlayer === this.player2) {
      if (this.selectedPiece.color === this.player2.color) {
        this.selectedPiece.selected = true;
      } else {
        this.pieceSelectionAlert();
      }
    }
  };

  highlightSquare = (cellX, cellY) => {
    const alpha = 0.4;
    const pieceColor = this.colorConverter(this.player1.color, alpha);
    const opponentPieceColor = this.colorConverter(this.player2.color, alpha);
    ctx.clearRect(0, 0, gameboard.width, gameboard.height);
    this.loadPieceImgs();

    const validMoves = [];
    this.clickedCard?.movement.forEach((movement) => {
      let movementCardX = movement.x;
      let movementCardY = movement.y;
      if (this.selectedPiece.color !== this.player1.color) {
        movementCardY = -movement.y;
        movementCardX = -movement.x;
      }
      validMoves.push({ x: movementCardX, y: movementCardY });
      for (let row = 0; row < numCells; row++) {
        for (let col = 0; col < numCells; col++) {
          const x = col * cellSize;
          const y = row * cellSize;
          const selectedPieceX = col - movementCardX;
          const selectedPieceY = row - movementCardY;
          if (selectedPieceX === cellX && selectedPieceY === cellY) {
            if (this.selectedPiece.color === this.player1.color) {
              ctx.fillStyle = pieceColor;
              ctx.fillRect(x, y, cellSize, cellSize);
              ctx.fillStyle = "rgba(0,0,0,0.4)";
              ctx.fillRect(
                cellX * cellSize,
                cellY * cellSize,
                cellSize,
                cellSize
              );
            } else {
              ctx.fillStyle = opponentPieceColor;
              ctx.fillRect(x, y, cellSize, cellSize);
              ctx.fillStyle = "rgba(0,0,0,0.4)";
              ctx.fillRect(
                cellX * cellSize,
                cellY * cellSize,
                cellSize,
                cellSize
              );
            }
          }
        }
      }
    });
    return validMoves;
  };

  eventHighlightSquare = (event) => {
    const { cellX, cellY } = this.mouseClick(event);
    this.highlightSquare(cellX, cellY);
  };

  selectCard(cardId, cardIndex, playerColor) {
    if (
      (this.currentPlayer === this.player1 && cardIndex > 1) ||
      (this.currentPlayer === this.player2 && cardIndex < 2)
    ) {
      return;
    }
    const selectedCard = document.getElementById(cardId);
    this.gameCards.forEach((card) => {
      card.selected = false;
    });
    const allCards = Array.from(document.getElementsByClassName("card"));
    allCards.forEach((card) => {
      card.style.borderWidth = "0px";
    });
    this.loadPieceImgs();
    if (this.currentPlayer === this.player1) {
      if (this.player1.color) {
        this.clickedCard = this.gameCards[cardIndex];
        this.clickedCard.selected = true;
        selectedCard.style.borderColor = playerColor;
        selectedCard.style.borderWidth = "2px";
        if (this.selectedPiece?.color === this.player1.color)
          this.highlightSquare(this.selectedPiece.col, this.selectedPiece.row);
      } else {
        this.cardSelectionAlert();
      }
    } else if (this.currentPlayer === this.player2) {
      if (this.player2.color) {
        this.clickedCard = this.gameCards[cardIndex];
        this.clickedCard.selected = true;
        selectedCard.style.borderColor = playerColor;
        selectedCard.style.borderWidth = "2px";
        if (this.selectedPiece?.color === this.player2.color)
          this.highlightSquare(this.selectedPiece.col, this.selectedPiece.row);
      } else {
        this.cardSelectionAlert();
      }
    }
  }

  switchCards() {
    commonCard = this.gameCards.pop();
    this.gameCards.push(this.clickedCard);
    const temp = this.gameCards.indexOf(this.clickedCard);
    this.gameCards[temp] = commonCard;
    commonCard = this.gameCards[temp];
    this.gameCards.forEach((gameCard, i) => {
      createImages(gameCard, i);
    });
    this.clickedCard.selected = false;
    this.resetCards();
  }

  removePiece = (cellX, cellY) => {
    const pieceToRemove = this.piecePositions.find((piece) => {
      return (
        piece.row === cellY &&
        piece.col === cellX &&
        piece.color !== this.getCurrentPlayerColor()
      );
    });
    if (pieceToRemove) {
      if (pieceToRemove.piece === "master") {
        this.gameState = "gameOver";
        this.gameOver();
      }
      const index = this.piecePositions.indexOf(pieceToRemove);
      this.piecePositions.splice(index, 1);
    }
  };

  createValidMoves = (moves) => {
    const newMoves = moves?.map((move) => {
      return {
        x: move.x + this.selectedPiece.col,
        y: move.y + this.selectedPiece.row,
      };
    });
    return newMoves;
  };

  movePiece = (event, selectedPiece) => {
    if (selectedPiece.color !== this.getCurrentPlayerColor()) {
      return;
    }
    const moves = this.createValidMoves(this.highlightSquare(event));
    const { cellX, cellY } = this.mouseClick(event);
    const isValidMove = moves?.find(
      (move) => move.x === cellX && move.y === cellY
    );
    selectedPiece.startX = selectedPiece.col * cellSize;
    selectedPiece.startY = selectedPiece.row * cellSize;
    selectedPiece.targetX = cellX * cellSize;
    selectedPiece.targetY = cellY * cellSize;
    this.animationStep = 0;

    const pieceCheck = this.piecePositions.find((piece) => {
      const pieceColorCheck = this.getCurrentPlayerColor() === piece.color;
      return piece.row === cellY && piece.col === cellX && pieceColorCheck;
    });
    if (
      selectedPiece.startX === selectedPiece.targetX &&
      selectedPiece.startY === selectedPiece.targetY
    ) {
      this.resetGameboard();
      this.selectedPiece.selected = false;
      this.loadPieceImgs();
    } else {
      if (isValidMove && !pieceCheck) {
        selectedPiece.row = cellY;
        selectedPiece.col = cellX;
        this.switchCards();
        this.animatePiece();

        if (
          (cellX === 2 &&
            cellY === 0 &&
            this.currentPlayer === this.player1 &&
            this.selectedPiece.piece === "master") ||
          (cellX === 2 &&
            cellY === 4 &&
            this.currentPlayer === this.player2 &&
            this.selectedPiece.piece === "master")
        )
          this.gameOver();
        this.removePiece(cellX, cellY);
        this.switchPlayers();
        this.clickedCard = undefined;
      } else {
        this.invalidMoveAlert();
      }
      this.loadPieceImgs();
    }
  };

  animatePiece = () => {
    const totalSteps = 50;
    if (this.animationStep < totalSteps) {
      const currentX =
        this.selectedPiece.startX +
        (this.selectedPiece.targetX - this.selectedPiece.startX) *
          (this.animationStep / totalSteps);
      const currentY =
        this.selectedPiece.startY +
        (this.selectedPiece.targetY - this.selectedPiece.startY) *
          (this.animationStep / totalSteps);
      ctx.clearRect(0, 0, gameboard.width, gameboard.height);

      this.piecePositions.forEach((piece) => {
        if (piece !== this.selectedPiece) {
          const img = this.pieceImgs[piece.color][piece.piece];
          ctx.drawImage(
            img,
            piece.col * cellSize,
            piece.row * cellSize,
            cellSize,
            cellSize
          );
        }
      });
      const img =
        this.pieceImgs[this.selectedPiece.color][this.selectedPiece.piece];
      ctx.drawImage(img, currentX, currentY, cellSize, cellSize);
      this.animationStep++;
      requestAnimationFrame(this.animatePiece);
    } else {
      this.selectedPiece.selected = false;
      this.selectedPiece = null;
    }
  };

  resetGameboard = () => {
    this.selectedPiece.selected = false;
    this.selectedPiece = null;
    ctx.clearRect(0, 0, gameboard.width, gameboard.height);
  };

  cardSelectionAlert = () => {
    this.gameState = "card alert";
    this.triggerAlert("Please select a Card");
    this.removeStart();
    this.removePass();
    this.resetCards();
    this.resetGameboard();
  };

  resetCards = () => {
    const allCards = Array.from(document.getElementsByClassName("card"));
    allCards.forEach((card) => {
      card.style.borderWidth = "0px";
      card.selected = false;
    });
    this.selectedCard = null;
    this.clickedCard = null;
  };

  removeStart = () => {
    const newGameButton = document.getElementById("start");
    newGameButton.style.display = "none";
  };

  removePass = () => {
    const passTurn = document.getElementById("pass");
    passTurn.style.display = "none";
  };

  triggerAlert = (alertMessage) => {
    const myModal = new bootstrap.Modal(document.getElementById("alert"));
    myModal.show();
    document.getElementById("modalText").innerText = alertMessage;
  };

  gameOver = () => {
    const winner = this.getCurrentPlayerColor();
    this.triggerAlert(
      `Game Over. ${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`
    );
    const newGameButton = document.getElementById("start");
    newGameButton.style.display = "block";
    this.gameState = "gameOver";
    this.removePass();
    this.removeClose();
  };

  removeClose = () => {
    const closeButton1 = document.getElementById("closeButtonAlert");
    const closeButton2 = document.getElementById("newGameCloseButton");
    closeButton1.style.visibility = "hidden";
    closeButton2.style.visibility = "hidden";
  };

  invalidMoveAlert = () => {
    this.gameState = "move alert";
    if (this.invalidMoveCounter < 3) {
      this.triggerAlert("Invalid Move");
      this.removeStart();
      this.invalidMoveCounter++;
      this.removePass();
      this.resetGameboard();
    } else {
      this.passAlert();
    }
  };

  passAlert = () => {
    this.gameState = "pass alert";
    this.triggerAlert(
      "If you have a legal move, you must take it—even if you don’t want to! It is possible that you will find that you cannot use any of your cards to make a legal move. If this happens —and only then— you must pass your turn. Would you like to pass?"
    );
    this.removeStart();
    const passTurn = document.getElementById("pass");
    passTurn.style.display = "block";
    this.invalidMoveCounter = 0;
  };

  passTrigger = () => {
    this.switchCards();
    this.switchPlayers();
  };

  pieceSelectionAlert = () => {
    this.gameState = "piece alert";
    this.triggerAlert("Select A Piece");
    this.removeStart();
    this.removePass();
    this.loadPieceImgs();
    this.resetGameboard();
  };
}

// Canvas (Gameboard)
const gameboard = document.getElementById("gameboard");
const passButton = document.getElementById("pass");
const ctx = gameboard.getContext("2d");
const boardSize = gameboard.width;
const numCells = 5;
const cellSize = boardSize / numCells;

randomCard().then((gameCards) => {
  commonCard = gameCards[4];
  player1 = new Player(
    localStorage.getItem("playercolor"),
    gameCards.slice(0, 2)
  );
  player2 = new Player(getOpponentColor(), gameCards.slice(2, 4));
  game = new Game(player1, player2, gameCards);
  game.initializeGame();
  gameboard.addEventListener("click", game.handlePlayerClick, game.selectPiece);
  gameboard.addEventListener("click", game.eventHighlightSquare);
  passButton.addEventListener("click", game.passTrigger);
});
