$(document).ready(() => {
// an empty array to create our boardGrid inside of
    let boardGrid = [];
//function for setting up the board by looping through nested arrays and creating divs
    function setup(rows, cols) {
        for (let i = 0; i < rows; i++) {
            boardGrid[i] = [];
            for (let j = 0; j < cols; j++) {
                if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
                    boardGrid[i][j] = `<div id="${i}_${j}" class="whiteSquare square" tabIndex="${i + 1}_${j + 1}"></div>`
                } else {
                    boardGrid[i][j] = `<div id="${i}_${j}" class="blackSquare square" tabIndex="${i + 1}_${j + 1}"></div>`
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
        let allSquares = `#gameBoard > div > div`;
        // let $selectedPiece = $(allSquares).filter('.blackSelected redSelected'); //an array of only selected pieces that I thought I might need one day

        for (let i = 0; i < rows; i++) {
            boardGrid[i] = [];
            for (let j = 0; j < cols; j++) {
                if {
                };
            }
        }    
        if (this.classList.contains(`blackSquare`)) {
            if ($(allSquares).hasClass(`blackSelected`) || $(allSquares).hasClass(`redSelected`)) {
                if (this.classList.contains(`blackSelected`)) {
                    $(this).removeClass(`blackSelected`)
                    $(this).addClass(`blackPiece`)
                } else if (this.classList.contains(`redSelected`)) {
                    $(this).removeClass(`redSelected`)
                    $(this).addClass(`redPiece`)
                } else if (this.classList.contains(`blackSelected`) === false && $(allSquares).hasClass(`blackSelected`)) {
                    $(this).addClass(`blackPiece`)
                    $(allSquares).removeClass(`blackSelected`)
                } else if (this.classList.contains(`redSelected`) === false && $(allSquares).hasClass(`redSelected`)) {
                    $(this).addClass(`redPiece`)
                    $(allSquares).removeClass(`redSelected`)
                };
            } else if ($(allSquares).hasClass(`blackSelected` || `redSelected`) === false) {
                if (this.classList.contains(`blackPiece`)) {
                    $(this).addClass(`blackSelected`)
                    $(this).removeClass(`blackPiece`)
                } else if (this.classList.contains(`redPiece`)) {
                    $(this).addClass(`redSelected`)
                    $(this).removeClass(`redPiece`)
                };
            }
        };
//create a css class of NO and use a setTimeout function to flash red when user clicks a square they can't place a piece on
        //if the div is empty
            //if the div is in a higher or lower i index (depending on the player) than the selected piece (moving backwards), that's a NO
            //else if the div is in a column more than 2 columns on either side from the piece (j index), that's a NO
            //else if the div is in a column directly adjacent to itself, add the class of $selected
            //else if the div is two columns on either side from the piece (j index), check if there's an opponent's piece in the column and row in between the starting and ending point 
                // write code about what to do if there's an opponent's piece there
        //else that's a NO
    });
});