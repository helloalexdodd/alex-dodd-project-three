$(document).ready(() => {
// an empty array to create our boardGrid inside of
    const boardGrid = [];
    const playerPosition = [];
// function for setting up the board by looping through nested arrays and creating divs
    function setup(rows, cols) {
        for (let i = 0; i < rows; i++) {
            boardGrid[i] = [];
            playerPosition[i] = [];
            for (let j = 0; j < cols; j++) {
                playerPosition[i][j] = 0;
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
                $(`#${i}_${j}`).addClass(`blackPiece gamePiece`);
                playerPosition[i][j] = 1;
            } else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5) {
                let cellID = `#${i}_${j}`;
                $(cellID).addClass(`redPiece gamePiece`);
                playerPosition[i][j] = 2;
            }
        }
    };
// listening event for selecting the piece a user wants to move
    $(`#gameBoard`).on(`click`, `.row > div`, function () {
        let allSquares = `#gameBoard > div > div`;
        const idString = $(this).attr(`id`);
        let idArray = idString.split("_", 2) ;
        let idArrayOne = idArray[0];
        let idArrayTwo = idArray[1];
        
        // console.log(idArray)
        //if this click is a black square (because pieces can only move on black squares)
        // if (idArray[0] % 2 === 0 && idArray[1] % 2 !== 0 || idArray[0] % 2 !== 0 && idArray[1] % 2 === 0 ) {
        // is this a cleaner way to write it? haha.
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
                //if this isn't already where any piece already sits and a black piece somewhere is already selected
                } else if (this.classList.contains(`gamePiece`) === false && $(allSquares).hasClass(`blackSelected`)) {
                    //place the piece here
                    $(this).addClass(`blackPiece gamePiece`)
                    // remove the piece from its original square
                    $(allSquares).removeClass(`blackSelected`)
                // if this isn't already where any piece already sits and a red piece somewhere is already selected
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
                    // change the playerPosition
                    let cellValue = playerPosition[idArrayOne][idArrayTwo];
                    console.log(cellValue);
                    // if it's a red piece
                } else if (this.classList.contains(`redPiece`)) {
                    // select the piece
                    $(this).addClass(`redSelected`)
                    // remove styling
                    $(this).removeClass(`redPiece gamePiece`)
                };
            };
        };

        //if the div is in a higher or lower i index (depending on the player) than the selected piece (moving backwards), that's a NO
        //else if the div is in a column more than 2 columns on either side from the piece (j index), that's a NO
        //else if the div is in a column directly adjacent to itself, add the class of $selected
        //else if the div is two columns on either side from the piece (j index), check if there's an opponent's piece in the column and row in between the starting and ending point 
        // write code about what to do if there's an opponent's piece there
    });
});