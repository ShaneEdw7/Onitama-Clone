let startbtn = document.getElementById('start');
let playercolor = document.getElementById('playercolor');
let gameMode = document.getElementById('')

const colordisplay = document.getElementsByName('color');
colordisplay.forEach((color) => {
    color.addEventListener('click', (event) => {
        localStorage.setItem('playercolor', event.target.value)
    })
});
const gameMode = document.getElementsByName('gameMode');
gameMode.forEach((gameMode) => {
    gameMode.addEventListener('click', (event) => {
        localStorage.setItem('gameMode', event.target.value)
    })
});