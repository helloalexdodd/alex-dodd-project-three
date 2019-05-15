$(document).ready(() => {
// an empty array to create our boardGrid inside of
    let boardGrid = [];
// function for setting up the board by looping through nested arrays and creating divs
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
    boardGrid.forEach((row) => {
        $(`#gameBoard`).append(`<div class="row">${row.join('')}</div>`)
    });
// looping through the boardGrid array and placing the game pieces in their starting positions
    for (let i = 0; i < boardGrid.length; i++) {
        for (let j = 0; j < boardGrid.length; j++) {
            if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i <= 2) {
                let cellID = `#${i}_${j}`;
                $(cellID).addClass(`blackPiece gamePiece`);
            } else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5){
                let cellID = `#${i}_${j}`;
                $(cellID).addClass(`redPiece gamePiece`);
            }
        }
    };
// listening event for selecting the piece a user wants to move
    $(`#gameBoard`).on(`click`, `.row > div`, function (rows, cols) {
        let allSquares = `#gameBoard > div > div`;
//this is an array of only selected pieces that I thought I might need one day
        // let $selectedPiece = $(allSquares).filter('.blackSelected redSelected');

        //if this click is a black square (because pieces can only move on black squares)
        if (this.classList.contains(`blackSquare`)) {
            // if any piece is already selected
            if ($(allSquares).hasClass(`blackSelected`) || $(allSquares).hasClass(`redSelected`)) {
                //if this click is already a selected black piece
                if (this.classList.contains(`blackSelected`)) {
                    // unselect the piece
                    $(this).removeClass(`blackSelected`)
                    // style the piece back to default
                    $(this).addClass(`blackPiece gamePiece`)
                    //if this click is already a selected red piece
                } else if (this.classList.contains(`redSelected`)) {
                    //unselect the piece
                    $(this).removeClass(`redSelected`)
                    //style the piece back to default
                    $(this).addClass(`redPiece gamePiece`)
                    //if this isn't already where any piece already sits and a piece somewhere is already selected
                } else if (this.classList.contains(`gamePiece`) === false && $(allSquares).hasClass(`blackSelected`)) {
                    //place the piece here
                    $(this).addClass(`blackPiece gamePiece`)
                    // remove the piece from its original square
                    $(allSquares).removeClass(`blackSelected`)
                // if this isn't already where any piece already sits and a piece somewhere is already selected
                } else if (this.classList.contains(`gamePiece`) === false && $(allSquares).hasClass(`redSelected`)) {
                    //place the piece here
                    $(this).addClass(`redPiece gamePiece`)
                    // remove the piece from its original square
                    $(allSquares).removeClass(`redSelected`)
                };
            // if no pieces are already selected
            } else if ($(allSquares).hasClass(`blackSelected` || `redSelected`) === false) {
                // if it's a black piece
                if (this.classList.contains(`blackPiece`)) {
                    // select the piece    
                    $(this).addClass(`blackSelected`)
                    // remove styling
                    $(this).removeClass(`blackPiece gamePiece`)
                // if it's a red piece
                } else if (this.classList.contains(`redPiece`)) {
                    // select the piece
                    $(this).addClass(`redSelected`)
                    // remove styling
                    $(this).removeClass(`redPiece gamePiece`)
                };
            };
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