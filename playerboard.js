const gamemat = document.getElementById("gamemat");
const canvas = gamemat.getContext("2d");

function drawBoard() {
  canvas.fillStyle = "brown";
  canvas.fillRect(0, 0, gamemat.width, gamemat.height);
}
drawBoard();
