const checkers = {
// an empty array to create our boardGrid inside of
	boardGrid: [],
// an empty array to create our playerPosition index inside of
	playerPosition: [],
// empty arrays to hold x and y axis
	boardx: [],
	boardy: [],
// variables to hold clicked board positions
	xy: {},
	storedxy: {},
	playerOneCounter: 0,
	playerTwoCounter: 0,
	playerOneEatCounter: 0,
	playerTwoEatCounter: 0,
	$instructionsBox: $(`.instructions-box`),
	$instructions: $(`.instructions`),
	$gameboard: $(`#game-board`),
	$h2: $(`h2`),
	$h3: $(`h3`),
	allSquares: `#game-board > div > div`
}

// setting up the board and filling empty global divs for access to x and y axis
checkers.setup = (rows, cols) => {
	const { } = checkers
	for (let i = 0; i < rows; i++) {
		checkers.boardGrid[i] = []
		checkers.playerPosition[i] = []
		checkers.boardx[i] = i
		checkers.boardy[i] = []
		let n = String.fromCharCode(104 - i)
		for (let j = 0; j < cols; j++) {
			checkers.playerPosition[i][j] = 0
			checkers.boardy[j] = j
			if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
				checkers.boardGrid[i][j] = `<div id="${i}_${j}" class="white-square square" aria-label="${n}${j + 1}" role="button"></div>`
			} else {
				checkers.boardGrid[i][j] = `<div id="${i}_${j}" class="black-square square" tabIndex="${i + 1}_${j + 2}" aria-label="${n}${j + 1}" role="button"></div>`
			}
		}
	}
	// appending the divs to the game-board
	checkers.boardGrid.forEach((row) => {
		checkers.$gameboard.append(`<div class="row">${row.join('')}</div>`)
	})
}

// placing the game pieces in their starting positions
checkers.setupPieces = (rows, cols) => {
	const { } = checkers
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let cellID = `#${i}_${j}`
			if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i <= 2) {
				$(cellID).addClass(`black-piece`)
				checkers.playerPosition[i][j] = 1
			} else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5) {
				$(cellID).addClass(`red-piece`)
				checkers.playerPosition[i][j] = 2
			}
		}
	}
}

// switching players
checkers.playerSwitch = () => {
	const { } = checkers
	if (checkers.$gameboard.hasClass(`player-two`)) {
		checkers.$h2.toggleClass(`player-two-turn`)
		checkers.$h3.toggleClass(`player-two-turn`)
	}
	checkers.$h2.toggleClass(`player-one-turn`)
	checkers.$h3.toggleClass(`player-one-turn`)
	checkers.$h2.toggleClass(`player-turn`)
	checkers.$gameboard.toggleClass(`player-one player-two`)
}

checkers.winnerAlert = (winnerMessage) => {
	const { } = checkers
	checkers.$gameboard.append(`<div class="winner">${winnerMessage}</div>`)
	setTimeout(function () {
	}, 2000)
}

checkers.addToPlayerCounter = () => {
	const { } = checkers
	if (checkers.$gameboard.hasClass(`player-two`)) {
		checkers.playerOneCounter = checkers.playerOneCounter + 1
		$('.player-one-counter').text(checkers.playerOneCounter)
	} else {
		checkers.playerTwoCounter = checkers.playerTwoCounter + 1
		$('.player-two-counter').text(checkers.playerTwoCounter)
	}
}

checkers.addToPlayerEatCounter = () => {
	const { } = checkers
	if (checkers.$gameboard.hasClass(`player-one`)) {
		checkers.playerOneEatCounter = checkers.playerOneEatCounter + 1
		$('.player-one-eat-counter').text(checkers.playerOneEatCounter)
	} else {
		checkers.playerTwoEatCounter = checkers.playerTwoEatCounter + 1
		$('.player-two-eat-counter').text(checkers.playerTwoEatCounter)
	}
	if (checkers.playerOneEatCounter === 12 || checkers.playerTwoEatCounter === 12) {
		let winnerMessage = `You Win!`
		checkers.winnerAlert(winnerMessage)
	}
}

checkers.checkForOpponentPiece = (cellValue, storedxy, direction) => {
	const { } = checkers
	let originSquareX
	let originSquareY
	let opponentSquareX
	let opponentSquareY

	switch (direction) {
		case `downLeft`:
			originSquareX = storedxy[0] - 2
			originSquareY = storedxy[1] + 2
			opponentSquareX = storedxy[0] - 1
			opponentSquareY = storedxy[1] + 1
			break
		case `downRight`:
			originSquareX = storedxy[0] - 2
			originSquareY = storedxy[1] - 2
			opponentSquareX = storedxy[0] - 1
			opponentSquareY = storedxy[1] - 1
			break
		case `upLeft`:
			originSquareX = storedxy[0] + 2
			originSquareY = storedxy[1] + 2
			opponentSquareX = storedxy[0] + 1
			opponentSquareY = storedxy[1] + 1
			break
		case `upRight`:
			originSquareX = storedxy[0] + 2
			originSquareY = storedxy[1] - 2
			opponentSquareX = storedxy[0] + 1
			opponentSquareY = storedxy[1] - 1
			break
	}
	// making an array of the origin of the player
	const originSquarePosition = []
	originSquarePosition.push(originSquareX, originSquareY)
	// turning that array into an ID
	const originDOMId = originSquarePosition.join(`_`)
	const $originDOMId = $(`#${originDOMId}`)
	// making an array of the opponent piece position
	const opponentSquarePosition = []
	opponentSquarePosition.push(opponentSquareX, opponentSquareY)
	// turning that array into an ID
	const opponentDOMId = opponentSquarePosition.join(`_`)
	const $opponentDOMId = $(`#${opponentDOMId}`)
	//check to make sure the opponent piece isn't off the board
	if (opponentSquareX <= 7 && opponentSquareX >= 0) {
		// getting the cellValue of the opponent and destination
		const opponentCellValue = checkers.playerPosition[opponentSquareX][opponentSquareY]
		// if the opponent's piece is between the origin and new location of the piece
		if (opponentCellValue == 2 && $($originDOMId).hasClass(`black-selected`) && cellValue == 0) {
			// remove the opponent piece
			$($opponentDOMId).removeClass(`red-piece king-piece`)
			// change the opponent piece position's cellValue
			checkers.playerPosition[opponentSquareX][opponentSquareY] = 0
			// run this function
			return true
			// if the opponent's piece is between the origin and new location of the piece
		} else if (opponentCellValue == 1 && $($originDOMId).hasClass(`red-selected`) && cellValue == 0) {
			// remove the opponent piece
			$($opponentDOMId).removeClass(`black-piece king-piece`)
			// change the opponent piece position's cellValue
			checkers.playerPosition[opponentSquareX][opponentSquareY] = 0
			// run this function
			return true
		} else {
			return false
		}
	}
}

checkers.doubleJumpDetection = (cellValue, storedxy, direction) => {
	const { } = checkers
	let destinationSquareX
	let destinationSquareY
	let opponentSquareX
	let opponentSquareY

	switch (direction) {
		case `downLeft`:
			destinationSquareX = storedxy[0] + 2
			destinationSquareY = storedxy[1] - 2
			opponentSquareX = storedxy[0] + 1
			opponentSquareY = storedxy[1] - 1
			break
		case `downRight`:
			destinationSquareX = storedxy[0] + 2
			destinationSquareY = storedxy[1] + 2
			opponentSquareX = storedxy[0] + 1
			opponentSquareY = storedxy[1] + 1
			break
		case `upLeft`:
			destinationSquareX = storedxy[0] - 2
			destinationSquareY = storedxy[1] - 2
			opponentSquareX = storedxy[0] - 1
			opponentSquareY = storedxy[1] - 1
			break
		case `upRight`:
			destinationSquareX = storedxy[0] + -2
			destinationSquareY = storedxy[1] + 2
			opponentSquareX = storedxy[0] - 1
			opponentSquareY = storedxy[1] + 1
			break
	}// making an array of the destination of the player
	const destinationSquarePosition = []
	destinationSquarePosition.push(destinationSquareX, destinationSquareY)
	// making an array of the opponent piece position
	const opponentSquarePosition = []
	opponentSquarePosition.push(opponentSquareX, opponentSquareY)
	//check to make sure the player destination isn't off the board
	if (destinationSquareX <= 7 && destinationSquareX >= 0 && destinationSquareY <= 7 && destinationSquareY >= 0) {
		// getting the cellValue of the opponent piece
		const opponentCellValue = checkers.playerPosition[opponentSquareX][opponentSquareY]
		const destinationCellValue = checkers.playerPosition[destinationSquareX][destinationSquareY]
		// if the opponent's piece is between the origin and new location of the piece
		if ((opponentCellValue == 2 && destinationCellValue == 0 && cellValue == 0 && ($(`#game-board`).hasClass(`player-one`))) ||
			(opponentCellValue === 1 && destinationCellValue === 0 && cellValue === 0 && ($(`#game-board`).hasClass(`player-two`)))) {
			// run this function
			return true
		} else {
			return false
		}
	}
}

checkers.playThePiece = ($this, $allSquares, add, remove, position, i, j) => {
	//place the piece here
	$this.addClass(add)
	// remove the piece from its original square
	$allSquares.removeClass(remove)
	// change the playerPosition
	checkers.playerPosition[i][j] = position
	// add a move onto the counter and display it to the user
	checkers.addToPlayerCounter()
	// switch players
	checkers.playerSwitch()
}

checkers.noPlay = ($this) => {
	$this.addClass(`no-play`)
	setTimeout(() => {
		$this.removeClass(`no-play`)
	}, 1000)
}

checkers.doubleJumpAnimation = ($blackSquares, $whiteSquares) => {
	const { } = checkers
	checkers.playerSwitch()
	setTimeout(function () {
	    $blackSquares.addClass('black-flicker')
	    setTimeout(function () {
	        $blackSquares.removeClass('black-flicker')
	    }, 4000)
	}, 1000)
	setTimeout(function () {
	    $whiteSquares.addClass('white-flicker')
	    setTimeout(function () {
	        $whiteSquares.removeClass('white-flicker')
	    }, 4000)
	}, 1000)
// text notification
	setTimeout(function () {
		checkers.$instructionsBox.css(`height`, `100px`)
		checkers.$instructionsBox.fadeIn(`1000`)
		checkers.$instructions.text(`Go For The Double Jump!`)
		setTimeout(() => {
			checkers.$instructionsBox.fadeOut(`slow`)
		}, 2500)
	}, 2000)
}

// kinging animation
checkers.goldAnimation = ($this, $blackSquares, $whiteSquares, $allSquares) => {
	const { } = checkers
	$this.addClass(`king-piece`)
	$blackSquares.addClass(`gold-jump`)
	$whiteSquares.addClass(`black-jump`)
	setTimeout(function () {
		$allSquares.removeClass('gold-jump black-jump')
	}, 3500)
}

// black and red animations
checkers.jumpAnimation = ($allSquares) => {
	const { } = checkers
	if (checkers.$gameboard.hasClass(`player-two`)) {
		$allSquares.addClass('black-jump')
	} else {
		$allSquares.addClass('red-jump')
	}
	setTimeout(function () {
		$allSquares.removeClass(`red-jump`)
		$allSquares.removeClass(`black-jump`)
	}, 2000)
	checkers.addToPlayerEatCounter()
}

checkers.userInstructions = (string) => {
	const { } = checkers
	checkers.$instructionsBox.css(`height`, `150px`)
	checkers.$instructionsBox.fadeIn(`1000`)
	checkers.$instructions.text(string)
	setTimeout(() => {
		checkers.$instructionsBox.fadeOut(`slow`)
	}, 2500)
}

checkers.click = () => {
	let { allSquares, $instructionsBox, playerPosition, xy, storedxy, boardx, boardy, checkForOpponentPiece, doubleJumpDetection, $gameboard, noPlay, userInstructions, goldAnimation, jumpAnimation, doubleJumpAnimation, playThePiece } = checkers

	$gameboard.on(`click keypress`, `.row > div`, function () {		
		const $allSquares = $(allSquares)
		const $blackSquares = $(`.black-square`)
		const $whiteSquares = $(`.white-square`)
		const $this = $(this)

		$instructionsBox.hide()

		// this stuff lets me access the i and j axis of my global arrays by using the id's of each div and passing it
		const $idString = $this.attr(`id`)
		const idArrayString = $idString.split("_", 2)
		const i = idArrayString[0]
		const j = idArrayString[1]

		cellValue = (playerPosition[i][j])

		xy = [boardx[i], boardy[j]]

		const hasOpponentPieceDownLeft = checkForOpponentPiece(cellValue, xy, `downLeft`)
		const hasOpponentPieceDownRight = checkForOpponentPiece(cellValue, xy, `downRight`)
		const hasOpponentPieceUpLeft = checkForOpponentPiece(cellValue, xy, `upLeft`)
		const hasOpponentPieceUpRight = checkForOpponentPiece(cellValue, xy, `upRight`)
		const hasDoubleJumpDownLeft = doubleJumpDetection(cellValue, xy, `downLeft`)
		const hasDoubleJumpDownRight = doubleJumpDetection(cellValue, xy, `downRight`)
		const hasDoubleJumpUpLeft = doubleJumpDetection(cellValue, xy, `upLeft`)
		const hasDoubleJumpUpRight = doubleJumpDetection(cellValue, xy, `upRight`)

		// if this click is a black square (because pieces can only move on black squares)
		if ($this.hasClass(`black-square`)) {

			// if this is a red piece and a different black piece is already selected
			if (cellValue === 2 && ($gameboard.hasClass(`player-one`)) || (cellValue === 1 && $gameboard.hasClass(`player-two`))) {
				noPlay($this)
				userInstructions(`Please stop trying to pick up your opponent's pieces.`)
			}

			// if any black piece is already selected
			if ($allSquares.hasClass(`black-selected`)) {

				// if this click is already a selected black piece
				if ($this.hasClass(`black-selected`) && ($this.hasClass(`king-selected`) === false)) {
					$this.addClass(`black-piece`).removeClass(`black-selected`)
					checkers.playerPosition[i][j] = 1
					
					// if this click is already a selected black king
				} else if ($this.hasClass(`king-selected`)) {
					$this.addClass(`black-piece king-piece`).removeClass(`black-selected king-selected`)
					checkers.playerPosition[i][j] = 1

					// if this is a black piece and a different black piece is already selected
				} else if (cellValue === 1 && ($allSquares.hasClass(`black-selected`))) {
					noPlay($this)

/////////////////////////////////

					// if this isn't already where any piece already sits and the piece that's selected is black
				} else if (cellValue === 0 && $allSquares.hasClass(`black-selected`)) {

					// if the piece is being moved forward on the board and isn't a king  
					if (xy[0] > storedxy[0] && $allSquares.hasClass(`king-selected`) === false) {

						// if any piece is already selected and it is the first or last row
						if (xy[0] === 7) {
							goldAnimation($this, $blackSquares, $whiteSquares, $allSquares)
						}
					
						// if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one more than the starting position
						if ((xy[1] === (storedxy[1] + 1) || xy[1] === (storedxy[1] - 1)) && (xy[0]) === (storedxy[0] + 1)) {
							playThePiece($this, $allSquares, `black-piece`, `black-selected`, 1, i, j)

							// if the x axis is two rows down from the starting point
						} else if (xy[0] === (storedxy[0] + 2)) {
					
							// and the y axis is two columns to the left and the square in between those two squares has an opposing player's piece in it
							if ((xy[1] === (storedxy[1] - 2)) && hasOpponentPieceDownLeft) {
								playThePiece($this, $allSquares, `black-piece`, `black-selected`, 1, i, j)
								jumpAnimation($allSquares)
					
								// and has a double jump opportunity down
								if (hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
									doubleJumpAnimation($blackSquares, $whiteSquares)
								}
					
								// and the y axis of the click is two columns to the right and the square in between those two squares has an opposing player's piece in it
							} else if ((xy[1] === (storedxy[1] + 2)) && hasOpponentPieceDownRight) {
								playThePiece($this, $allSquares, `black-piece`, `black-selected`, 1, i, j)
								jumpAnimation($allSquares)
					
								// and has a double jump opportunity down
								if (hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
									doubleJumpAnimation($blackSquares, $whiteSquares)
								}
							} else {
								noPlay($this)
							}
						} else {
							noPlay($this)
						}
					
						// if the x and y axis is only one space away from the starting position
					} else if (((xy[1] === (storedxy[1] + 1)) || (xy[1] === (storedxy[1] - 1) || (xy[0]) === (storedxy[0] + 1)) || (xy[0] === (storedxy[0] - 1))) && ($allSquares.hasClass(`king-selected`))) {
						playThePiece($this, $allSquares, `black-piece king-piece`, `black-selected king-selected`, 1, i, j)
					
						//if the x and y axis are two rows away from the starting point and there's an opponent's piece in between
					} else if
						(((xy[0] === (storedxy[0] - 2)) && (xy[1] === (storedxy[1] - 2)) && ($allSquares.hasClass(`king-selected`))) ||
						((xy[0] === (storedxy[0] - 2)) && (xy[1] === (storedxy[1] + 2)) && ($allSquares.hasClass(`king-selected`))) ||
						((xy[0] === (storedxy[0] + 2)) && (xy[1] === (storedxy[1] + 2))) ||
						((xy[0] === (storedxy[0] + 2)) && (xy[1] === (storedxy[1] - 2))) && (hasOpponentPieceUpLeft || hasOpponentPieceUpRight || hasOpponentPieceDownLeft || hasOpponentPieceDownRight)) {
						playThePiece($this, $allSquares, `black-piece king-piece`, `black-selected king-selected`, 1, i, j)
						jumpAnimation($allSquares)
					
						//has double jump opportunity up and to the left
						if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight || hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
					
							//double jump animation
							doubleJumpAnimation($blackSquares, $whiteSquares)
						}
					} else {
					noPlay($this)
				}
				} else {
					noPlay($this)
				}

				// if any red piece is already selected
			} else if ($allSquares.hasClass(`red-selected`)) {

				//if this click is already a selected red piece
				if (this.classList.contains(`red-selected`) && (this.classList.contains(`king-selected`) === false)) {
					$this.addClass(`red-piece`).removeClass(`red-selected`)
					playerPosition[i][j] = 2

					//if this click is already a selected red king
				} else if (this.classList.contains(`king-selected`)) {
					$this.addClass(`red-piece king-piece`).removeClass(`red-selected king-selected`)
					playerPosition[i][j] = 2

					//if this is a red piece and a different red piece is already selected
				} else if (cellValue === 2 && ($allSquares.hasClass(`red-selected`))) {
					noPlay($this)
					userInstructions(`Please unselect the first piece before selecting a new one.`)

					// if this isn't already where any piece already sits and the piece that is selected is red
				} else if (cellValue === 0 && $allSquares.hasClass(`red-selected`)) {

					// store the new x and y axis
					xy = [boardx[i], boardy[j]]

					// if the piece is being moved forward on the board and isn't a king
					if (xy[0] < storedxy[0] && $allSquares.hasClass(`king-selected`) === false) {

						//if any piece is already selected and it is the first or last row
						if (xy[0] === 0) {
							goldAnimation($this, $blackSquares, $whiteSquares, $allSquares)
						}
						//if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one down than the starting position
						if ((xy[1] === (storedxy[1] + 1) || xy[1] === (storedxy[1] - 1)) && (xy[0]) === (storedxy[0] - 1)) {
							playThePiece($this, $allSquares, `red-piece`, `red-selected`, 2, i, j)

							//if the x axis is two rows down from the starting point
						} else if (xy[0] === (storedxy[0] - 2)) {

							// and the y axis of the click is two columns to the left and the square in between those two squares has an opposing player's piece in it
							if ((xy[1] === (storedxy[1] - 2)) && hasOpponentPieceUpLeft) {
								playThePiece($this, $allSquares, `red-piece`, `red-selected`, 2, i, j)
								jumpAnimation($allSquares)

								//has double jump opportunity up and to the left
								if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight) {
									doubleJumpAnimation($blackSquares, $whiteSquares)
								}
							} else if ((xy[1] === (storedxy[1] + 2)) && hasOpponentPieceUpRight) {
								playThePiece($this, $allSquares, `red-piece`, `red-selected`, 2, i, j)
								jumpAnimation($allSquares)

								// has double jump opportunity up and to the left
								if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight) {
									doubleJumpAnimation($blackSquares, $whiteSquares)
								}
							} else {
								noPlay($this)
							}
						} else {
							noPlay($this)
						}

						// if the x and y axis is only one space away from the starting position
					} else if (((xy[1] === (storedxy[1] + 1)) || (xy[1] === (storedxy[1] - 1) || (xy[0]) === (storedxy[0] + 1)) || (xy[0] === (storedxy[0] - 1))) && ($allSquares.hasClass(`king-selected`))) {
						playThePiece($this, $allSquares, `red-piece king-piece`, `red-selected king-selected`, 2, i, j)
						
						//if the x axis is two rows down from the starting point
					} else if
						(((xy[0] === (storedxy[0] - 2)) && (xy[1] === (storedxy[1] - 2))) ||
						((xy[0] === (storedxy[0] - 2)) && (xy[1] === (storedxy[1] + 2))) ||
						((xy[0] === (storedxy[0] + 2)) && (xy[1] === (storedxy[1] + 2)) && ($allSquares.hasClass(`king-selected`))) ||
						((xy[0] === (storedxy[0] + 2)) && (xy[1] === (storedxy[1] - 2)) && ($allSquares.hasClass(`king-selected`))) && (hasOpponentPieceUpLeft || hasOpponentPieceUpRight || hasOpponentPieceDownLeft || hasOpponentPieceDownRight)) {
						playThePiece($this, $allSquares, `red-piece king-piece`, `red-selected king-selected`, 2, i, j)
						jumpAnimation($allSquares)
						
						//has double jump opportunity up and to the left
						if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight || hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
							doubleJumpAnimation($blackSquares, $whiteSquares)
						}
					} else {
						noPlay($this)
					}
				} else {
					noPlay($this)
				}
			}
			
			// if no pieces are already selected
			else if ($allSquares.hasClass(`black-selected` || `red-selected`) === false) {

				// store the x and y axis
				storedxy = [boardx[i], boardy[j]]

				//if it's a black king
				if (cellValue === 1 && ($gameboard.hasClass(`player-one`) && $this.hasClass(`king-piece`))) {
					$this.addClass(`black-selected king-selected`).removeClass(`black-piece king-piece`)
					checkers.playerPosition[i][j] = 0
				}
			
				//if it's a red king
				if (cellValue === 2 && ($gameboard.hasClass(`player-two`) && $this.hasClass(`king-piece`))) {
					$this.addClass(`red-selected king-selected`).removeClass(`red-piece king-piece`)
					checkers.playerPosition[i][j] = 0
				}
			
				// if it's a black piece  
				else if (cellValue === 1 && ($gameboard.hasClass(`player-one`))) {
					$this.addClass(`black-selected`).removeClass(`black-piece`)
					checkers.playerPosition[i][j] = 0

					// if it's a red piece
				} else if (cellValue === 2 && ($gameboard.hasClass(`player-two`))) {
					$this.addClass(`red-selected`).removeClass(`red-piece`)
					checkers.playerPosition[i][j] = 0
				} else {
					noPlay($this)
				}
			}
		} else {
			noPlay($this)
		}
	})
}

checkers.init = () => {
	checkers.setup(8, 8)
	checkers.setupPieces(8, 8)
	checkers.click()
}

$(() => {
	checkers.init()
})