$(document).ready(() => {
let boardGrid = [];

function setup() {
    for (let i = 0; i < 8; i++) {
        boardGrid[i] = [];
        for (let j = 0; j < 8; j++) {
            if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
                boardGrid[i][j] = `<div id="${i}_${j}" class="white"></div>`
            } else {
                boardGrid[i][j] = `<div id="${i}_${j}" class="black"></div>`
            };
        }
    }
};

setup();


// can't figure out why this arrow function doesn't work.
// boardGrid.forEach((row) => {
//     $(`#gameboard`).append(`<div class="row">${row.join(' ')}</div>`)
// });
boardGrid.forEach(function (row) {
    $(`#gameBoard`).append(`<div class="row">${row.join('')}</div>`)
});

for (let i = 0; i < boardGrid.length; i++) {
        for (let j = 0; j < 8; j++) {
            if (i === 0 && j % 2 !== 0 || i === 1 && j % 2 === 0 || i === 2 && j % 2 !== 0) {
                let cellID = `#${i}_${j}`
                $(cellID).addClass(`blackPiece`);
            } else if (i === 5 && j % 2 === 0 || i === 6 && j % 2 !== 0 || i === 7 && j % 2 === 0){
                let cellID = `#${i}_${j}`
                $(cellID).addClass(`redPiece`);
            }
    }
}

// boardGrid.forEach(function () {
//     // console.log(boardGrid);
//     if (boardGrid.len) {
//         let blackPieces = $(boardGrid).filter(`.black`);
//         $(`.black`).addClass(`blackPiece`);
//         // console.log(blackPieces)
//     } else {
//         let redPieces = $(boardGrid).filter(`.red`);
//         $(`.black`).addClass(`redPiece`);
//     }
// });
});


//I like this way but I'm having trouble accessing the rows nested in the cols to give classes to them. The way its written now it just
// gives the classes to the columns

// function buildGrid(cols, rows) {
//     let arr = Array(cols);
//     for (let i = 0; i < arr.length; i++) {
//         arr[i] = new Array(rows);
//         if (i % 2 === 0) {
//             arr[i].className = "beigeSquare";
//         } else {
//             arr[i].className = "blueSquare";
//         }
//     }
//     return arr;
// }

// buildGrid(8, 8);

//This way doesn't require any arrays. I pulled it off of stackoverflow and i don't like it but it works. I keep it here to try to help me figure out how to make the other two work.

// for(let i = 0; i < 8; i++){
//     let rows = document.createElement("div");
//     for (let j = 0; j < 8; j++) {
//         let cols = document.createElement("div");
//         if(i % 2 === j % 2){
//             cols.className = "white"
//         }
//         else {
//             cols.className = "black"
//         }
//         rows.appendChild(cols);
//     }
//     gameBoard.appendChild(rows);
// }