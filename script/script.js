$(document).ready(() => {
// an empty array to create our boardGrid inside of
    const boardGrid = [];
// an empty array to create our playerPosition index inside of
    const playerPosition = [];
// empty arrays to hold x and y axis
    const boardx = [];
    const boardy = [];
// variables to hold clicked board positions
    let xy;
    let storedxy;
// variables to hold each player's move count
    let playerOneCounter = 0;
    let playerTwoCounter = 0;
// function for setting up the board by looping through nested arrays and creating divs. also fills empty global divs for access to x and y axis
    function setup(rows, cols) {
        for (let i = 0; i < rows; i++) {
            boardGrid[i] = [];
            playerPosition[i] = [];
            boardx[i] = i;
            boardy[i] = [];            
            for (let j = 0; j < cols; j++) {
                playerPosition[i][j] = 0;
                boardy[j] = j;
                if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
                    boardGrid[i][j] = `<div id="${i}_${j}" class="whiteSquare square" tabIndex="${i + 1}_${j + 1}"></div>`
                } else {
                    boardGrid[i][j] = `<div id="${i}_${j}" class="blackSquare square" tabIndex="${i + 1}_${j + 1}"></div>`
                };
            }
        }
// looping through the boardGrid array and appending the divs to the main gameboard
        boardGrid.forEach((row) => {
            $(`#gameBoard`).append(`<div class="row">${row.join('')}</div>`)
        });
    };

// function for looping through the boardGrid array and placing the game pieces in their starting positions
    function setupPieces() {    
        for (let i = 0; i < boardGrid.length; i++) {
            for (let j = 0; j < boardGrid.length; j++) {
                if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i <= 2) {
                    let cellID = `#${i}_${j}`;
                    $(`#${i}_${j}`).addClass(`blackPiece`);
                    playerPosition[i][j] = 1;
                } else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5) {
                    let cellID = `#${i}_${j}`;
                    $(cellID).addClass(`redPiece`);
                    playerPosition[i][j] = 2;
                }
            }
        };
    };

// function for switching players
    let playerSwitch = () => {
        $(`#gameBoard`).toggleClass("playerOne playerTwo");
    }
// add a move onto the PlayerOneCounter and display it to the user
    let addToPlayerOneCounter = () => {
        playerOneCounter = playerOneCounter + 1;
        $('.playerOneCounter').text(playerOneCounter);
    }
// add a move onto the PlayerTwoounter and display it to the user
    let addToPlayerTwoCounter = () => {
        playerTwoCounter = playerTwoCounter + 1;
        $('.playerTwoCounter').text(playerTwoCounter);
    }

    let checkForOpponentPiece = (value) => {
        // if () {
        //     return true
        // } else {
        //     return false
        // }
        console.log(value, xy)

        return true
    }
// calling the setup functions and passing it the columns and rows
    setup(8, 8);
    setupPieces();
// listening event for selecting the piece a user wants to move
    $(`#gameBoard`).on(`click`, `.row > div`, function () {
        let allSquares = `#gameBoard > div > div`;
// this stuff lets me access the i and j axis of my global arrays by using the id's of each div and passing it
        const idString = $(this).attr(`id`);
        const idArray = idString.split("_", 2) ;
        const i = idArray[0];
        const j = idArray[1];
//variable to hold clicked playerPosition
        let cellValue = (playerPosition[i][j])

        let hasOpponentPiece = checkForOpponentPiece(cellValue);
        console.log(hasOpponentPiece)
        //if this click is a black square (because pieces can only move on black squares)
        if (this.classList.contains(`blackSquare`)) {
            
            // if any piece is already selected
            if ($(allSquares).hasClass(`blackSelected`) || $(allSquares).hasClass(`redSelected`)) {
                   
                //if this click is already a selected black piece
                if (this.classList.contains(`blackSelected`)) {
                    // unselect the piece
                    $(this).removeClass(`blackSelected`)
                    // style the piece back to default
                    $(this).addClass(`blackPiece`)
                    // change the playerPosition
                    cellValue = 1  
                
                //if this click is already a selected red piece
                } else if (this.classList.contains(`redSelected`)) {
                    //unselect the piece
                    $(this).removeClass(`redSelected`)
                    //style the piece back to default
                    $(this).addClass(`redPiece`)
                    // change the playerPosition
                    cellValue = 2;
                
                //if this isn't already where any piece already sits and the piece that's selected is black
                } else if (cellValue === 0 && $(allSquares).hasClass(`blackSelected`)) {
                    // store the new x and y axis
                    xy = [boardx[i], boardy[j]];
                
                    // if the piece is being moved forward on the board    
                    if (xy[0] > storedxy[0]) {
                        
                        //if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one more than the starting position
                        if (xy[1] === (storedxy[1] + 1) || xy[1] === (storedxy[1] - 1) && (xy[0]) === (storedxy[0] + 1)) {
                            //place the piece here
                            $(this).addClass(`blackPiece`)
                            // remove the piece from its original square
                            $(allSquares).removeClass(`blackSelected`)
                            // change the playerPosition
                            cellValue = 1;
                            // switch players
                            playerSwitch();
                            addToPlayerOneCounter();
                        } 
                        //if the y axis of the click is two columns away from the starting position and of the x axis of the click is two columns away from the starting point and the square that is one column ahead of and in between those two squares has an opposing player's piece in it
                        else if ((xy[1] === (storedxy[1] + 2) || xy[1] === (storedxy[1] - 2)) && (xy[0] === (storedxy[0] + 2) || xy[0] === (storedxy[0] - 2)) && hasOpponentPiece) {
                            console.log(`meetscondition`)
                            //place the piece here
                            $(this).addClass(`blackPiece`)
                            // remove the piece from its original square
                            $(allSquares).removeClass(`blackSelected`)
                            // change the playerPosition
                            cellValue = 1;
                            // switch players
                            playerSwitch();
                            // add a move onto the counter and display it to the user
                            addToPlayerOneCounter();                        
                        }
                    };

                // if this isn't already where any piece already sits and the piece that is selected is red
                } else if (cellValue === 0 && $(allSquares).hasClass(`redSelected`)) {
                    // store the new x and y axis
                    xy = [boardx[i], boardy[j]];

                    // if the piece is being moved forward on the board  
                    if (xy[0] < storedxy[0]) {

                        //if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one more than the starting position
                        if (xy[1] === (storedxy[1] + 1) || xy[1] === (storedxy[1] - 1) && (xy[0]) === (storedxy[0] - 1)) {
                            //place the piece here
                            $(this).addClass(`redPiece`)
                            // remove the piece from its original square
                            $(allSquares).removeClass(`redSelected`)
                            // change the playerPosition
                            cellValue = 2;
                            // switch players
                            playerSwitch();
                            // add a move onto the counter and display it to the user
                            addToPlayerTwoCounter();
                        }

                        //if the y axis of the click is two columns away from the starting position and of the x axis of the click is two columns away from the starting point and the square that is one column ahead of and in between those two squares has an opposing player's piece in it
                        else if (xy[1] === (storedxy[1] + 2) || xy[1] === (storedxy[1] - 2) && xy[0] === (storedxy[0] + 2) || xy[0] === (storedxy[0] - 2)) {
                            
                        }
                    };
                };
            
            // if no pieces are already selected
            } else if ($(allSquares).hasClass(`blackSelected` || `redSelected`) === false) {
                // store the x and y axis
                storedxy = [boardx[i], boardy[j]]

                // if it's a black piece  
                if (cellValue === 1 && ($(`#gameBoard`).hasClass(`playerOne`))) {
                    // select the piece    
                    $(this).addClass(`blackSelected`)
                    // remove styling
                    $(this).removeClass(`blackPiece`)
                    // change the playerPosition
                    cellValue = 0; 
                
                // if it's a red piece
                } else if (cellValue === 2 && ($(`#gameBoard`).hasClass(`playerTwo`))) {
                    // select the piece
                    $(this).addClass(`redSelected`)
                    // remove styling
                    $(this).removeClass(`redPiece`)
                    // change the playerPosition
                    cellValue = 0;
                };
            };
        };
    });
});