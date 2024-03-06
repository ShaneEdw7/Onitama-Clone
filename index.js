//Stores color and gameModeChoice to local storage
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
