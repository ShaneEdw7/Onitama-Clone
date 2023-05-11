let startbtn = document.getElementById('start');
let playercolor = document.getElementById('playercolor');
let aidiff = document.getElementById('aidiff')

    startbtn.addEventListener('click', () => {
        let colordisplay = document.getElementsByName('color');
        colordisplay.forEach((color) => {
           if (color.checked) {
              playercolor.innerText = `Player Color: ${color.value}`;
              }
         });
         let difflevel = document.getElementsByName('difficulty');
         difflevel.forEach((difficulty) => {
            if (difficulty.checked) {
               aidiff.innerText = `Difficulty: ${difficulty.value}`;
               }
          });
    }); 