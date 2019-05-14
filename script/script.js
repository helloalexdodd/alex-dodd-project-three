$(document).ready(() => {
// an empty array to create our boardGrid inside of
    let boardGrid = [];
//function for setting up the board by looping through nested arrays and creating divs
    function setup(rows, cols) {
        for (let i = 0; i < rows; i++) {
            boardGrid[i] = [];
            for (let j = 0; j < cols; j++) {
                if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
                    boardGrid[i][j] = `<div id="${i}_${j}" class="white"></div>`
                } else {
                    boardGrid[i][j] = `<div id="${i}_${j}" class="black"></div>`
                };
            }
        }
    };
// calling the function and passing it the columns and rows
    setup(8, 8);

// looping through the boardGrid array and appending the divs to the main gameboard
    // I can't figure out why this arrow function doesn't work.
    // boardGrid.forEach((row) => {
    //     $(`#gameboard`).append(`<div class="row">${row.join(' ')}</div>`)
    // });
    boardGrid.forEach(function (row) {
        $(`#gameBoard`).append(`<div class="row">${row.join('')}</div>`)
    });
//looping through the boardGrid array and placing the game pieces in their starting positions
    for (let i = 0; i < boardGrid.length; i++) {
        for (let j = 0; j < boardGrid.length; j++) {
            if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i <= 2) {
                let cellID = `#${i}_${j}`;
                $(cellID).addClass(`blackPiece`);
            } else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5){
                let cellID = `#${i}_${j}`;
                $(cellID).addClass(`redPiece`);
            }
        }
    };
//listening event for selecting the piece a user wants to move
    $(`#gameBoard`).on(`click`, `.row > div`, function () {
        if ($(`#gameBoard > div > div`).hasClass(`blackSelected`) || $(`#gameBoard > div > div`).hasClass(`redSelected`)) {
            if (this.classList.contains(`blackSelected`)) {
                $(this).removeClass(`blackSelected`)
            } else if (this.classList.contains(`redSelected`)) {
                $(this).removeClass(`redSelected`)
            };
        } else if ($(`#gameBoard > div > div`).hasClass(`blackSelected` || `redSelected`) === false) {
            if (this.classList.contains(`blackPiece`)) {
                $(this).addClass(`blackSelected`)
            } else if (this.classList.contains(`redPiece`)) {
                $(this).addClass(`redSelected`)
            }
        };
    
    //write a click event

    });

});