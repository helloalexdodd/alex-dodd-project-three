//I like this way but I'm having trouble accessing the nested data to give classes to them.

function buildGrid(cols, rows) {
    let arr = Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
        if (i % 2 === 0) {
            arr[i].className = "beigeSquare";
        } else {
            arr[i].className = "blueSquare";
        }
    }
    return arr;
}

buildGrid(8,8);

//The way I originally did it
let rows = [];
let cols = [];
let boardGrid = [];

function setup() {
    for (let i = 0; i < 8; i++) {
        boardGrid[i] = [];
        for (let j = 0; j < 8; j++) {
            boardGrid[i][j] = $(`<div>`);
            if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
                boardGrid[i][j].className = "beigeSquare";
            } else {
                boardGrid[i][j].ClassName = "blueSquare";
            }
        }
    }
};

setup();

//This way doesn't require arrays. I pulled it off of stackoverflow 
// const board = document.getElementById("board"); 

// for(let i = 0; i < 8; i++){
//     let rows = document.createElement("div");
//     for (let j = 0; j < 8; j++) {
//         let cols = document.createElement("div");
//         if(i % 2 === j % 2){
//             cols.className = "white square"
//         }
//         else {
//             cols.className = "black square"
//         }
//         rows.appendChild(cols);
//     }
//     board.appendChild(rows);
// }