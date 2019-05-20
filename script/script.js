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
//variable to hold each player's eat count
    let playerOneEatCounter = 0;
    let playerTwoEatCounter = 0;

    const $gameboard = $(`#game-board`);
    const $h2 = $(`h2`);
// function for setting up the board by looping through nested arrays and creating divs. also fills empty global divs for access to x and y axis
    function setup(rows, cols) {
        
        for (let i = 0; i < rows; i++) {
            boardGrid[i] = [];
            playerPosition[i] = [];
            boardx[i] = i;
            boardy[i] = [];
            let n = String.fromCharCode(i + 97);
            for (let j = 0; j < cols; j++) {
                playerPosition[i][j] = 0;
                boardy[j] = j;
                if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
                    boardGrid[i][j] = `<div id="${i}_${j}" class="white-square square" tabIndex="${i + 1}_${j + 2}" aria-label="${n}${j}" role="button"></div>`
                } else {
                    boardGrid[i][j] = `<div id="${i}_${j}" class="black-square square" tabIndex="${i + 1}_${j + 2}" aria-label="${n}${j}" role="button"></div>`
                };
            }
        }
// looping through the boardGrid array and appending the divs to the main game-board
        boardGrid.forEach((row) => {
            $gameboard.append(`<div class="row">${row.join('')}</div>`)
        });
    };
// function for looping through the boardGrid array and placing the game pieces in their starting positions
    function setupPieces(rows, cols) {    
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i <= 2) {
                    let cellID = `#${i}_${j}`;
                    $(`#${i}_${j}`).addClass(`black-piece`);
                    playerPosition[i][j] = 1;
                } else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5) {
                    let cellID = `#${i}_${j}`;
                    $(cellID).addClass(`red-piece`);
                    playerPosition[i][j] = 2;
                }
            }
        };
    };
// function for switching players
    const playerSwitch = () => {
        if ($gameboard.hasClass(`player-two`)) {
           $h2.toggleClass(`player-two-turn`);
        };
        $h2.toggleClass(`player-one-turn`);
        $h2.toggleClass(`player-turn`);
        $gameboard.toggleClass(`player-one player-two`);
    };
// add a move onto the PlayerOneCounter and display it to the user
    const addToPlayerCounter = () => {
        if ($gameboard.hasClass(`player-one`)) {
            playerOneCounter = playerOneCounter + 1;
            $('.player-one-counter').text(playerOneCounter);
        } else {
            playerTwoCounter = playerTwoCounter + 1;
            $('.player-two-counter').text(playerTwoCounter);
        }
    };
// add an opponent piece onto the PlayerOneEatCounter and display it to the user
    const addToPlayerEatCounter = () => {
        if ($gameboard.hasClass(`player-one`)) {
            playerOneEatCounter = playerOneEatCounter + 1
            $('.player-one-eat-counter').text(playerOneEatCounter);
        } else {
            playerTwoEatCounter = playerTwoEatCounter + 1
            $('.player-two-eat-counter').text(playerTwoEatCounter);
        }
};
// function for checking if there's an opponent piece on jump when moving down and to the left
    let checkForOpponentPieceDownLeft = (cellValue, idArrayString) => {
// making an array of ID numbers
        const idArrayNums = idArrayString.map((num) => {
            return Number(num);
        });
// making an array of the origin of the player
        const originSquarePosition = [];
        const originSquareX = idArrayNums[0] - 2;
        const originSquareY = idArrayNums[1] + 2;
        originSquarePosition.push(originSquareX, originSquareY);
// turning that array into an ID
        const originDOMId = originSquarePosition.join(`_`);
        const $originDOMId = $(`#${originDOMId}`);
// making an array of the opponent piece; position
        const opponentSquarePosition = [];
        const opponentSquareX = idArrayNums[0] - 1;
        const opponentSquareY = idArrayNums[1] + 1;
        opponentSquarePosition.push(opponentSquareX, opponentSquareY);
// turning that array into an ID
        const opponentDOMId = opponentSquarePosition.join(`_`);
        const $opponentDOMId = $(`#${opponentDOMId}`);        
        //check to make sure the opponent piece isn't off the board
        if (opponentSquareX <= 7 && opponentSquareX >= 0) {
            // getting the cellValue of the opponent and destination
            const opponentCellValue = playerPosition[opponentSquareX][opponentSquareY];
            // if the opponent's piece is between the origin and new location of the piece
            if (opponentCellValue == 2 && $($originDOMId).hasClass(`black-selected`) && cellValue == 0) {
                // remove the opponent piece
                $($opponentDOMId).removeClass(`red-piece`);
                // change the opponent piece position's cellValue
                playerPosition[opponentSquareX][opponentSquareY] = 0;
                // run this function
                return true
            } else if (opponentCellValue == 1 && $($originDOMId).hasClass(`red-selected`) && cellValue == 0) {
                // remove the opponent piece
                $($opponentDOMId).removeClass(`black-piece`);
                // change the opponent piece position's cellValue
                playerPosition[opponentSquareX][opponentSquareY] = 0;
                // run this function
                return true 
            } else {
                return false
            };
        };
    };
// function for checking if there's an opponent piece on jump when moving down and to the left
    let checkForOpponentPieceDownRight = (cellValue, idArrayString) => {
        // making an array of ID numbers
        const idArrayNums = idArrayString.map((num) => {
            return Number(num);
        });
        // making an array of the origin of the player
        const originSquarePosition = [];
        const originSquareX = idArrayNums[0] - 2;
        const originSquareY = idArrayNums[1] - 2;
        originSquarePosition.push(originSquareX, originSquareY);
        // turning that array into an ID
        const originDOMId = originSquarePosition.join(`_`);
        const $originDOMId = $(`#${originDOMId}`);
        // making an array of the opponent piece; position
        const opponentSquarePosition = [];
        const opponentSquareX = idArrayNums[0] - 1;
        const opponentSquareY = idArrayNums[1] - 1;
        opponentSquarePosition.push(opponentSquareX, opponentSquareY);
        // turning that array into an ID
        const opponentDOMId = opponentSquarePosition.join(`_`);
        const $opponentDOMId = $(`#${opponentDOMId}`);
        //check to make sure the opponent piece isn't off the board
        if (opponentSquareX <= 7 && opponentSquareX >= 0) {
            const opponentCellValue = playerPosition[opponentSquareX][opponentSquareY];
            // if the opponent's piece is between the origin and new location of the piece
            if (opponentCellValue == 2 && $($originDOMId).hasClass(`black-selected`) && cellValue == 0) {
                // remove the opponent piece
                $($opponentDOMId).removeClass(`red-piece`);
                // change the opponent piece position's cellValue
                playerPosition[opponentSquareX][opponentSquareY] = 0;
                // run this function
                return true
            } else if (opponentCellValue == 1 && $($originDOMId).hasClass(`red-selected`) && cellValue == 0) {
                // remove the opponent piece
                $($opponentDOMId).removeClass(`black-piece`);
                // change the opponent piece position's cellValue
                playerPosition[opponentSquareX][opponentSquareY] = 0;
                // run this function
                return true
            } else {
                return false
            };
        }
    };
// function for checking if there's an opponent piece on jump when moving down and to the left
    let checkForOpponentPieceUpLeft = (cellValue, idArrayString) => {
        // making an array of ID numbers
        const idArrayNums = idArrayString.map((num) => {
            return Number(num);
        });
        // making an array of the origin of the player
        const originSquarePosition = [];
        const originSquareX = idArrayNums[0] + 2;
        const originSquareY = idArrayNums[1] + 2;
        originSquarePosition.push(originSquareX, originSquareY);
        // turning that array into an ID
        const originDOMId = originSquarePosition.join(`_`);
        const $originDOMId = $(`#${originDOMId}`);
        // making an array of the opponent piece; position
        const opponentSquarePosition = [];
        const opponentSquareX = idArrayNums[0] + 1;
        const opponentSquareY = idArrayNums[1] + 1;
        opponentSquarePosition.push(opponentSquareX, opponentSquareY);
        // turning that array into an ID
        const opponentDOMId = opponentSquarePosition.join(`_`);
        const $opponentDOMId = $(`#${opponentDOMId}`);
        //check to make sure the opponent piece isn't off the board
        if (opponentSquareX <= 7 && opponentSquareX >=0) {        
        // getting the cellValue of the opponent piece
            const opponentCellValue = playerPosition[opponentSquareX][opponentSquareY];
            // if the opponent's piece is between the origin and new location of the piece
            if (opponentCellValue == 2 && $($originDOMId).hasClass(`black-selected`) && cellValue == 0) {
                // remove the opponent piece
                $($opponentDOMId).removeClass(`red-piece`);
                // change the opponent piece position's cellValue
                playerPosition[opponentSquareX][opponentSquareY] = 0;
                // run this function
                return true
            } else if (opponentCellValue == 1 && $($originDOMId).hasClass(`red-selected`) && cellValue == 0) {
                // remove the opponent piece
                $($opponentDOMId).removeClass(`black-piece`);
                // change the opponent piece position's cellValue
                playerPosition[opponentSquareX][opponentSquareY] = 0;
                // run this function
                return true 
            } else {
                return false
            };
        };
    };
// function for checking if there's an opponent piece on jump when moving down and to the left
    let checkForOpponentPieceUpRight = (cellValue, idArrayString) => {
        // making an array of ID numbers
        const idArrayNums = idArrayString.map((num) => {
            return Number(num);
        });
        // making an array of the origin of the player
        const originSquarePosition = [];
        const originSquareX = idArrayNums[0] + 2;
        const originSquareY = idArrayNums[1] - 2;
        originSquarePosition.push(originSquareX, originSquareY);
        // turning that array into an ID
        const originDOMId = originSquarePosition.join(`_`);
        const $originDOMId = $(`#${originDOMId}`);
        // making an array of the opponent piece; position
        const opponentSquarePosition = [];
        const opponentSquareX = idArrayNums[0] + 1;
        const opponentSquareY = idArrayNums[1] - 1;
        opponentSquarePosition.push(opponentSquareX, opponentSquareY);
        // turning that array into an ID
        const opponentDOMId = opponentSquarePosition.join(`_`);
        const $opponentDOMId = $(`#${opponentDOMId}`);
        //check to make sure the opponent piece isn't off the board
        if (opponentSquareX <= 7 && opponentSquareX >= 0) {
            // getting the cellValue of the opponent piece
            const opponentCellValue = playerPosition[opponentSquareX][opponentSquareY];
            // if the opponent's piece is between the origin and new location of the piece
            if (opponentCellValue == 2 && $($originDOMId).hasClass(`black-selected`) && cellValue == 0) {
                // remove the opponent piece
                $($opponentDOMId).removeClass(`red-piece`);
                // change the opponent piece position's cellValue
                playerPosition[opponentSquareX][opponentSquareY] = 0;
                // run this function
                return true
            } else if (opponentCellValue == 1 && $($originDOMId).hasClass(`red-selected`) && cellValue == 0) {
                // remove the opponent piece
                $($opponentDOMId).removeClass(`black-piece`);
                // change the opponent piece position's cellValue
                playerPosition[opponentSquareX][opponentSquareY] = 0;
                // run this function
                return true
            } else {
                return false
            };
        };
    };
// function for checking if there's a double jump opportunity down and to the left
    let DoubleJumpDownLeft = (cellValue, idArrayString) => {
        // making an array of ID numbers
        const idArrayNums = idArrayString.map((num) => {
            return Number(num);
        });
        // making an array of the destination of the player
        const destinationSquarePosition = [];
        const destinationSquareX = idArrayNums[0] + 2;
        const destinationSquareY = idArrayNums[1] - 2;
        destinationSquarePosition.push(destinationSquareX, destinationSquareY);
        // making an array of the opponent piece position
        const opponentSquarePosition = [];
        const opponentSquareX = idArrayNums[0] + 1;
        const opponentSquareY = idArrayNums[1] - 1;
        opponentSquarePosition.push(opponentSquareX, opponentSquareY);
        //check to make sure the player destination isn't off the board
        if (destinationSquareX <= 7 && destinationSquareY >= 0) {
            // getting the cellValue of the opponent piece
            const opponentCellValue = playerPosition[opponentSquareX][opponentSquareY];
            const destinationCellValue = playerPosition[destinationSquareX][destinationSquareY];
            // $(destinationDOMId).filter(`black-piece red-piece`)
            // if the opponent's piece is between the origin and new location of the piece
            console.log(opponentCellValue)
            console.log(destinationCellValue)
            console.log(cellValue)
            if ((opponentCellValue == 2 && destinationCellValue == 0 && cellValue == 0 && ($(`#game-board`).hasClass(`player-one`))) ||
                (opponentCellValue === 1 && destinationCellValue === 0 && cellValue === 0 && ($(`#game-board`).hasClass(`player-two`)))) {
                // run this function
                return true
            } else {
                return false
            };
        };
    };
    // function for checking if there's a double jump opportunity down and to the left
    let DoubleJumpDownRight = (cellValue, idArrayString) => {
        // making an array of ID numbers
        const idArrayNums = idArrayString.map((num) => {
            return Number(num);
        });
        // making an array of the destination of the player
        const destinationSquarePosition = [];
        const destinationSquareX = idArrayNums[0] + 2;
        const destinationSquareY = idArrayNums[1] + 2;
        destinationSquarePosition.push(destinationSquareX, destinationSquareY);
        // making an array of the opponent piece position
        const opponentSquarePosition = [];
        const opponentSquareX = idArrayNums[0] + 1;
        const opponentSquareY = idArrayNums[1] + 1;
        opponentSquarePosition.push(opponentSquareX, opponentSquareY);
        //check to make sure the player destination isn't off the board
        if (destinationSquareX <= 7 && destinationSquareY <= 7) {
            // getting the cellValue of the opponent piece
            const opponentCellValue = playerPosition[opponentSquareX][opponentSquareY];
            const destinationCellValue = playerPosition[destinationSquareX][destinationSquareY];
            // $(destinationDOMId).filter(`black-piece red-piece`)
            // if the opponent's piece is between the origin and new location of the piece
            if ((opponentCellValue == 2 && destinationCellValue == 0 && cellValue == 0 && ($(`#game-board`).hasClass(`player-one`))) ||
                (opponentCellValue === 1 && destinationCellValue === 0 && cellValue === 0 && ($(`#game-board`).hasClass(`player-two`)))) {
                // run this function
                return true
            } else {
                return false
            };
        };
    };
    // function for checking if there's a double jump opportunity down and to the left
    let DoubleJumpUpLeft = (cellValue, idArrayString) => {
        // making an array of ID numbers
        const idArrayNums = idArrayString.map((num) => {
            return Number(num);
        });
        // making an array of the destination of the player
        const destinationSquarePosition = [];
        const destinationSquareX = idArrayNums[0] - 2;
        const destinationSquareY = idArrayNums[1] - 2;
        destinationSquarePosition.push(destinationSquareX, destinationSquareY);
        // making an array of the opponent piece position
        const opponentSquarePosition = [];
        const opponentSquareX = idArrayNums[0] - 1;
        const opponentSquareY = idArrayNums[1] - 1;
        opponentSquarePosition.push(opponentSquareX, opponentSquareY);
        //check to make sure the player destination isn't off the board
        if (destinationSquareX >= 0 && destinationSquareY >= 0) {
            // getting the cellValue of the opponent piece
            const opponentCellValue = playerPosition[opponentSquareX][opponentSquareY];
            const destinationCellValue = playerPosition[destinationSquareX][destinationSquareY];
            // $(destinationDOMId).filter(`black-piece red-piece`)
            // if the opponent's piece is between the origin and new location of the piece
            if ((opponentCellValue == 2 && destinationCellValue == 0 && cellValue == 0 && ($(`#game-board`).hasClass(`player-one`))) ||
                (opponentCellValue === 1 && destinationCellValue === 0 && cellValue === 0 && ($(`#game-board`).hasClass(`player-two`)))) {
                // run this function
                return true
            } else {
                return false
            };
        };
    };
    // function for checking if there's a double jump opportunity down and to the left
    let DoubleJumpUpRight = (cellValue, idArrayString) => {
        // making an array of ID numbers
        const idArrayNums = idArrayString.map((num) => {
            return Number(num);
        });
        // making an array of the destination of the player
        const destinationSquarePosition = [];
        const destinationSquareX = idArrayNums[0] - 2;
        const destinationSquareY = idArrayNums[1] + 2;
        destinationSquarePosition.push(destinationSquareX, destinationSquareY);
        // making an array of the opponent piece position
        const opponentSquarePosition = [];
        const opponentSquareX = idArrayNums[0] - 1;
        const opponentSquareY = idArrayNums[1] + 1;
        opponentSquarePosition.push(opponentSquareX, opponentSquareY);
        //check to make sure the player destination isn't off the board
        if (destinationSquareX >= 0 & destinationSquareY <= 7) {
            // getting the cellValue of the opponent piece
            const opponentCellValue = playerPosition[opponentSquareX][opponentSquareY];
            const destinationCellValue = playerPosition[destinationSquareX][destinationSquareY];
            // $(destinationDOMId).filter(`black-piece red-piece`)
            // if the opponent's piece is between the origin and new location of the piece
            if ((opponentCellValue == 2 && destinationCellValue == 0 && cellValue == 0 && ($(`#game-board`).hasClass(`player-one`))) ||
                (opponentCellValue === 1 && destinationCellValue === 0 && cellValue === 0 && ($(`#game-board`).hasClass(`player-two`)))) {
                // run this function
                return true
            } else {
                return false
            };
        };
    };

// calling the setup functions and passing it the columns and rows
    setup(8, 8);
    setupPieces(8, 8);
// listening event for selecting the piece a user wants to move
    $gameboard.on(`click keypress`, `.row > div`, function () {
//declaring some useful variables declarations
        const allSquares = `#game-board > div > div`;
        const $allSquares = $(allSquares);
        const $this = $(this);
        const $blackSquare = $(`.black-square`);
        const $whiteSquare = $(`.white-square`);
        const $instructionBox = $(`instruction-box`);
// this stuff lets me access the i and j axis of my global arrays by using the id's of each div and passing it
        const $idString = $this.attr(`id`);
        const idArrayString = $idString.split("_", 2);
        const i = idArrayString[0];
        const j = idArrayString[1];
//variable to hold clicked playerPosition
        let cellValue = (playerPosition[i][j]);
//passing the arguments to the function and placing it in a variable to use later on in an if statement
        let hasOpponentPieceDownLeft = checkForOpponentPieceDownLeft(cellValue, idArrayString);
        let hasOpponentPieceDownRight = checkForOpponentPieceDownRight(cellValue, idArrayString);
        let hasOpponentPieceUpLeft = checkForOpponentPieceUpLeft(cellValue, idArrayString);
        let hasOpponentPieceUpRight = checkForOpponentPieceUpRight(cellValue, idArrayString);
        let hasDoubleJumpDownLeft = DoubleJumpDownLeft(cellValue, idArrayString);
        let hasDoubleJumpDownRight = DoubleJumpDownRight(cellValue, idArrayString);
        let hasDoubleJumpUpLeft = DoubleJumpUpLeft(cellValue, idArrayString);
        let hasDoubleJumpUpRight = DoubleJumpUpRight(cellValue, idArrayString);


        //make the instructions disappear
        $instructionBox.addClass(`hide`);
        
        //if this click is a black square (because pieces can only move on black squares)
        if (this.classList.contains(`black-square`)) {
           
            // store the new x and y axis
            xy = [boardx[i], boardy[j]];
            
            // if any black piece is already selected
            if ($allSquares.hasClass(`black-selected`)) {
                   
                //if this click is already a selected black piece
                if (this.classList.contains(`black-selected`) && (this.classList.contains(`king-selected`) === false)) {
                    // unselect the piece
                    $this.removeClass(`black-selected`);
                    // style the piece back to default
                    $this.addClass(`black-piece`);
                    // change the playerPosition
                    playerPosition[i][j] = 1;
                    console.log(playerPosition[i][j]);

                //if this click is already a selected black king
                } else if (this.classList.contains(`king-selected`)) {
                    // unselect the piece
                    $allSquares.removeClass(`black-selected king-selected`);
                    // style the piece back to default
                    $this.addClass(`black-piece king-piece`);
                    // change the playerPosition
                    playerPosition[i][j] = 1;
                    console.log(playerPosition[i][j]);

                //if this is a black piece and a different black piece is already selected
                } else if (cellValue !== 0 && ($allSquares.hasClass(`black-selected`))) {
                    $this.addClass(`no-play`)
                    setTimeout(() => {
                        $this.removeClass(`no-play`)
                    }, 1000);

                //if this isn't already where any piece already sits and the piece that's selected is black
                } else if (cellValue === 0 && $allSquares.hasClass(`black-selected`)) {

                    // if the piece is being moved forward on the board and isn't a king  
                    if (xy[0] > storedxy[0] && $allSquares.hasClass(`king-selected`) === false) {

                        //if any piece is already selected and it is the first or last row
                        if (xy[0] === 7) {
                            $this.addClass(`king-piece`)
                            // gold animation
                            $blackSquare.addClass(`gold-jump`);
                            $whiteSquare.addClass(`black-jump`)
                            setTimeout(function () {
                                $allSquares.removeClass('gold-jump black-jump');
                            }, 2000);

                        };
                        //if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one more than the starting position
                        if (xy[1] === (storedxy[1] + 1) || xy[1] === (storedxy[1] - 1) && (xy[0]) === (storedxy[0] + 1)) {
                            //place the piece here
                            $this.addClass(`black-piece`)
                            // remove the piece from its original square
                            $allSquares.removeClass(`black-selected`)
                            // change the playerPosition
                            playerPosition[i][j] = 1;
                            console.log(playerPosition[i][j]);
                            // add a move onto the counter and display it to the user
                            addToPlayerCounter();
                            // switch players
                            playerSwitch();
                        //if the x axis is two rows down from the starting point
                        } else if (xy[0] === (storedxy[0] + 2)) {
                            // and the y axis is two columns to the left and the square in between those two squares has an opposing player's piece in it
                            if ((xy[1] === (storedxy[1] - 2)) && hasOpponentPieceDownLeft) {
                                //place the piece here
                                $this.addClass(`black-piece`)
                                // remove the piece from its original square
                                $allSquares.removeClass(`black-selected`)
                                // change the playerPosition
                                playerPosition[i][j] = 1;
                                console.log(playerPosition[i][j]);
                                //black animation
                                $allSquares.addClass('black-jump');
                                setTimeout(function () {
                                    $allSquares.removeClass('black-jump');
                                }, 2000);
                                //add an opponent piece to the counter and display it to the user
                                addToPlayerEatCounter();
                                // add a move onto the counter and display it to the user
                                addToPlayerCounter();
                                // switch players
                                playerSwitch();
                                //and has a double jump opportunity down and to the left
                                if (hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
                                    // switch back players
                                    playerSwitch();
                                    //double jump animation
                                    setTimeout(function () {
                                    $blackSquare.addClass('black-flicker');
                                    setTimeout(function () {
                                        $blackSquare.removeClass('black-flicker');
                                    }, 4000);
                                    }, 1200);
                                    setTimeout(function () {
                                    $whiteSquare.addClass('white-flicker');
                                    setTimeout(function () {
                                        $whiteSquare.removeClass('white-flicker');
                                    }, 4000);
                                    }, 1200);
                                }
                            // and the y axis of the click is two columns to the right and the square in between those two squares has an opposing player's piece in it
                            } else if ((xy[1] === (storedxy[1] + 2)) && hasOpponentPieceDownRight) {
                                //place the piece here
                                $this.addClass(`black-piece`)
                                // remove the piece from its original square
                                $allSquares.removeClass(`black-selected`)
                                // change the playerPosition
                                playerPosition[i][j] = 1;
                                console.log(playerPosition[i][j]);
                                // black animation
                                $allSquares.addClass('black-jump');
                                setTimeout(function () {
                                    $allSquares.removeClass('black-jump');
                                }, 2000);
                                //add an opponent piece to the counter and display it to the user
                                addToPlayerEatCounter();
                                // add a move onto the counter and display it to the user
                                addToPlayerCounter();
                                // switch players
                                playerSwitch();
                                //and has a double jump opportunity down and to the left
                                if (hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
                                    // switch back players
                                    playerSwitch();
                                    //double jump animation
                                    setTimeout(function () {
                                    $blackSquare.addClass('black-flicker');
                                    setTimeout(function () {
                                        $blackSquare.removeClass('black-flicker');
                                    }, 4000);
                                    }, 1200);
                                    setTimeout(function () {
                                    $whiteSquare.addClass('white-flicker');
                                    setTimeout(function () {
                                        $whiteSquare.removeClass('white-flicker');
                                    }, 4000);
                                    }, 1200);
                                }
                            };
                        };
// KIIIIIIIIIIIIIIIIIIIINNNNNNGGGGGSSSSS!!!! if the x and y axis is only one space away from the starting position
                    } else if (((xy[1] === (storedxy[1] + 1)) || (xy[1] === (storedxy[1] - 1) || (xy[0]) === (storedxy[0] + 1)) || (xy[0] === (storedxy[0] - 1))) && ($allSquares.hasClass(`king-selected`))) {
                        //place the piece here
                        $this.addClass(`black-piece king-piece`)
                        // remove the piece from its original square
                        $allSquares.removeClass(`black-selected king-selected`)
                        // change the playerPosition
                        playerPosition[i][j] = 1;
                        console.log(playerPosition[i][j]);
                        // add a move onto the counter and display it to the user
                        addToPlayerCounter();
                        // switch players
                        playerSwitch();
                        //if the x and y axis are two rows away from the starting point
                    } else if 
                        (((xy[0] === (storedxy[0] - 2)) && (xy[1] === (storedxy[1] - 2))) || 
                        ((xy[0] === (storedxy[0] - 2)) && (xy[1] === (storedxy[1] + 2))) || 
                        ((xy[0] === (storedxy[0] + 2)) && (xy[1] === (storedxy[1] + 2))) || 
                        ((xy[0] === (storedxy[0] + 2)) && (xy[1] === (storedxy[1] - 2)))) { 
                            // and the y axis of the click is two columns to the left and the square in between those two squares has an opposing player's piece in it
                            if (hasOpponentPieceUpLeft || hasOpponentPieceUpRight || hasOpponentPieceDownLeft || hasOpponentPieceDownRight) {
                                //place the piece here
                                $this.addClass(`black-piece king-piece`)
                                // remove the piece from its original square
                                $allSquares.removeClass(`black-selected king-selected`)
                                // change the playerPosition
                                playerPosition[i][j] = 1;
                                console.log(playerPosition[i][j]);
                                //red animation
                                $allSquares.addClass('black-jump');
                                setTimeout(function () {
                                    $allSquares.removeClass('black-jump');
                                }, 2000);
                                //add an opponent piece to the counter and display it to the user
                                addToPlayerEatCounter();
                                // add a move onto the counter and display it to the user
                                addToPlayerCounter();
                                // switch players
                                playerSwitch();
                                //has double jump opportunity up and to the left
                                if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight || hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
                                    // switch back players
                                    playerSwitch();
                                    //double jump animation
                                    setTimeout(function () {
                                    $blackSquare.addClass('black-flicker');
                                    $whiteSquare.addClass('white-flicker');
                                    setTimeout(function () {
                                        $blackSquare.removeClass('black-flicker');
                                        $whiteSquare.removeClass('white-flicker');
                                    }, 4000);
                                    }, 1200);
                                }
                            } 
                        }
                    } else {
                        $this.addClass(`no-play`)
                        setTimeout(() => {
                            $this.removeClass(`no-play`)
                        }, 1000);
                    };

                // if any red piece is already selected
                 } else if ($allSquares.hasClass(`red-selected`)) {

                    //if this click is already a selected red piece
                    if (this.classList.contains(`red-selected`) && (this.classList.contains(`king-selected`) === false)) {
                        // unselect the piece
                        $this.removeClass(`red-selected`);
                        // style the piece back to default
                        $this.addClass(`red-piece`);
                        // change the playerPosition
                        playerPosition[i][j] = 2;
                        console.log(playerPosition[i][j]);

                        //if this click is already a selected red king
                    } else if (this.classList.contains(`king-selected`)) {
                        // unselect the piece
                        $allSquares.removeClass(`red-selected king-selected`);
                        // style the piece back to default
                        $this.addClass(`red-piece king-piece`);
                        // change the playerPosition
                        playerPosition[i][j] = 2;
                        console.log(playerPosition[i][j]);

                        //if this is a red piece and a different black piece is already selected
                    } else if (cellValue !== 0 && ($allSquares.hasClass(`red-selected`))) {
                        $this.addClass(`no-play`)
                        setTimeout(() => {
                            $this.removeClass(`no-play`)
                        }, 1000);

                // if this isn't already where any piece already sits and the piece that is selected is red
                } else if (cellValue === 0 && $allSquares.hasClass(`red-selected`)) {
                    
                    // store the new x and y axis
                    xy = [boardx[i], boardy[j]];
                    
                    // if the piece is being moved forward on the board and isn't a king
                    if (xy[0] < storedxy[0] && $allSquares.hasClass(`king-selected`) === false) {
                        
                        //if any piece is already selected and it is the first or last row
                        if (xy[0] === 0) {
                            $this.addClass(`king-piece`);
                            // gold animation
                            $blackSquare.addClass(`gold-jump`);
                            $whiteSquare.addClass(`red-jump`);
                            setTimeout(function () {
                                $allSquares.removeClass('gold-jump');
                            }, 2000);
                        };
                        //if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one down than the starting position
                        if (xy[1] === (storedxy[1] + 1) || xy[1] === (storedxy[1] - 1) && (xy[0]) === (storedxy[0] - 1)) {
                            //place the piece here
                            $this.addClass(`red-piece`)
                            // remove the piece from its original square
                            $allSquares.removeClass(`red-selected`)
                            // change the playerPosition
                            playerPosition[i][j] = 2;
                            console.log(playerPosition[i][j]);
                            // add a move onto the counter and display it to the user
                            addToPlayerCounter();
                            // switch players
                            playerSwitch();
                        //if the x axis is two rows down from the starting point
                        } else if (xy[0] === (storedxy[0] - 2)) {
                            // and the y axis of the click is two columns to the left and the square in between those two squares has an opposing player's piece in it
                            if ((xy[1] === (storedxy[1] - 2)) && hasOpponentPieceUpLeft) {
                                //place the piece here
                                $this.addClass(`red-piece`)
                                // remove the piece from its original square
                                $allSquares.removeClass(`red-selected`)
                                // change the playerPosition
                                playerPosition[i][j] = 2;
                                console.log(playerPosition[i][j]);
                                //red animation
                                $allSquares.addClass('red-jump');
                                setTimeout(function () {
                                    $allSquares.removeClass('red-jump');
                                }, 2000);
                                //add an opponent piece to the counter and display it to the user
                                addToPlayerEatCounter();
                                // add a move onto the counter and display it to the user
                                addToPlayerCounter();
                                // switch players
                                playerSwitch();
                                //has double jump opportunity up and to the left
                                if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight) {
                                    // switch back players
                                    playerSwitch();
                                    //double jump animation
                                    setTimeout(function () {
                                    $blackSquare.addClass('black-flicker');
                                    setTimeout(function () {
                                        $blackSquare.removeClass('black-flicker');
                                    }, 4000);
                                    }, 1200);
                                    setTimeout(function () {
                                    $whiteSquare.addClass('white-flicker');
                                    setTimeout(function () {
                                        $whiteSquare.removeClass('white-flicker');
                                    }, 4000);
                                    }, 1200);
                                }
                            } else if ((xy[1] === (storedxy[1] + 2)) && hasOpponentPieceUpRight) {
                                //place the piece here
                                $this.addClass(`red-piece`)
                                // remove the piece from its original square
                                $allSquares.removeClass(`red-selected`)
                                // change the playerPosition
                                playerPosition[i][j] = 2;
                                console.log(playerPosition[i][j]);
                                // red animation
                                $allSquares.addClass('red-jump');
                                setTimeout(function () {
                                    $allSquares.removeClass('red-jump');
                                }, 2000);
                                //add an opponent piece to the counter and display it to the user
                                addToPlayerEatCounter();
                                // add a move onto the counter and display it to the user
                                addToPlayerCounter();
                                // switch players
                                playerSwitch();
                                // has double jump opportunity up and to the left
                                if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight) {
                                    // switch back players
                                    playerSwitch();
                                    //double jump animation
                                    setTimeout(function () {
                                    $blackSquare.addClass('black-flicker');
                                    setTimeout(function () {
                                        $blackSquare.removeClass('black-flicker');
                                    }, 4000);
                                    }, 1200);
                                    setTimeout(function () {
                                    $whiteSquare.addClass('white-flicker');
                                    setTimeout(function () {
                                        $whiteSquare.removeClass('white-flicker');
                                    }, 4000);
                                    }, 1200);
                                }
                            };
                        };
// KKKKKKKKKKKKKKKKKIIIIIIIIIIIIIINNNNNNNNGGGGGGSSSSSS!!!!!!!!
                    } else if (((xy[1] === (storedxy[1] + 1)) || (xy[1] === (storedxy[1] - 1) || (xy[0]) === (storedxy[0] + 1)) || (xy[0] === (storedxy[0] - 1))) && ($allSquares.hasClass(`king-selected`))) {
                        //place the piece here
                        $this.addClass(`red-piece king-piece`)
                        // remove the piece from its original square
                        $allSquares.removeClass(`red-selected king-selected`)
                        // change the playerPosition
                        playerPosition[i][j] = 2;
                        console.log(playerPosition[i][j]);
                        // add a move onto the counter and display it to the user
                        addToPlayerCounter();
                        // switch players
                        playerSwitch();
                        //if the x axis is two rows down from the starting point
                    } else if
                        (((xy[0] === (storedxy[0] - 2)) && (xy[1] === (storedxy[1] - 2))) ||
                        ((xy[0] === (storedxy[0] - 2)) && (xy[1] === (storedxy[1] + 2))) ||
                        ((xy[0] === (storedxy[0] + 2)) && (xy[1] === (storedxy[1] + 2))) ||
                        ((xy[0] === (storedxy[0] + 2)) && (xy[1] === (storedxy[1] - 2)))) {
                        // and the y axis of the click is two columns to the left and the square in between those two squares has an opposing player's piece in it
                        if (hasOpponentPieceUpLeft || hasOpponentPieceUpRight || hasOpponentPieceDownLeft || hasOpponentPieceDownRight) {
                            //place the piece here
                            $this.addClass(`red-piece king-piece`)
                            // remove the piece from its original square
                            $allSquares.removeClass(`red-selected king-selected`)
                            // change the playerPosition
                            playerPosition[i][j] = 2;
                            console.log(playerPosition[i][j]);
                            console.log(playerPosition);
                            //red animation
                            $allSquares.addClass('red-jump');
                            setTimeout(function () {
                                $allSquares.removeClass('red-jump');
                            }, 2000);
                            //add an opponent piece to the counter and display it to the user
                            addToPlayerEatCounter();
                            // add a move onto the counter and display it to the user
                            addToPlayerCounter();
                            // switch players
                            playerSwitch();
                            //has double jump opportunity up and to the left
                            if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight || hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
                                // switch back players
                                playerSwitch();
                                //double jump animation
                                setTimeout(function () {
                                    $blackSquare.addClass('black-flicker');
                                    $whiteSquare.addClass('white-flicker');
                                    setTimeout(function () {
                                        $blackSquare.removeClass('black-flicker');
                                        $whiteSquare.removeClass('white-flicker');
                                    }, 4000);
                                }, 2000);
                            }
                        }
                    }
                } else {
                    $this.addClass(`no-play`)
                    setTimeout(() => {
                        $this.removeClass(`no-play`)
                    }, 1000);
                }
            } 
            // if no pieces are already selected
            else if ($allSquares.hasClass(`black-selected` || `red-selected`) === false) {
               
                // store the x and y axis
                storedxy = [boardx[i], boardy[j]]
                
                //if it's a black king
                if (cellValue === 1 && ($gameboard.hasClass(`player-one`) && $this.hasClass(`king-piece`))) {
                    // select the piece
                    $this.addClass(`black-selected king-selected`)
                    // remove styling
                    $this.removeClass(`black-piece king-piece`)
                    //change the playerPosition
                    playerPosition[i][j] = 0
                    console.log(playerPosition[i][j])
                }
                //if it's a red king
                if (cellValue === 2 && ($gameboard.hasClass(`player-two`) && $this.hasClass(`king-piece`))) {
                    // select the piece
                    $this.addClass(`red-selected king-selected`)
                    // remove styling
                    $this.removeClass(`red-piece king-piece`)
                    //change the playerPosition
                    playerPosition[i][j] = 0
                    console.log(playerPosition[i][j])
                }
                // if it's a black piece  
                else if (cellValue === 1 && ($gameboard.hasClass(`player-one`))) {
                    // select the piece    
                    $this.addClass(`black-selected`)
                    // remove styling
                    $this.removeClass(`black-piece`)
                    // change the playerPosition
                    playerPosition[i][j] = 0; 
                    console.log(playerPosition[i][j])
                
                // if it's a red piece
                } else if (cellValue === 2 && ($gameboard.hasClass(`player-two`))) {
                    // select the piece
                    $this.addClass(`red-selected`)
                    // remove styling
                    $this.removeClass(`red-piece`)
                    // change the playerPosition
                    playerPosition[i][j] = 0;
                    console.log(playerPosition[i][j])

                } else {
                    $this.addClass(`no-play`)
                    setTimeout(() => {
                        $this.removeClass(`no-play`)
                    }, 1000);
                }
            };
        } else {
            $this.addClass(`no-play`)
            setTimeout(() => {
                $this.removeClass(`no-play`)
            }, 1000);
        };
    });
});