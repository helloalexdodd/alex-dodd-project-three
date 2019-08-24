const checkers = {
	boardGrid: [], // an empty array to create our boardGrid
	playerPosition: [], // an empty array to create our playerPosition index
	boardx: [], // empty arrays to hold x and y axis
	boardy: [],
	destXY: {}, // variables to hold clicked board positions
	origXY: {},
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
	const { boardGrid, playerPosition, boardx, boardy, $gameboard } = checkers
	for (let i = 0; i < rows; i++) {
		boardGrid[i] = []
		playerPosition[i] = []
		boardx[i] = i
		boardy[i] = []
		let n = String.fromCharCode(104 - i)
		for (let j = 0; j < cols; j++) {
			playerPosition[i][j] = 0
			boardy[j] = j
			if (i % 2 === 0 && j % 2 === 0 || i % 2 !== 0 && j % 2 !== 0) {
				boardGrid[i][j] = `<div id="${i}_${j}" class="white-square square" aria-label="${n}${j + 1}" role="button"></div>`
			} else {
				boardGrid[i][j] = `<div id="${i}_${j}" class="black-square square" tabIndex="${i + 1}_${j + 2}" aria-label="${n}${j + 1}" role="button"></div>`
			}
		}
	}
	// appending the divs to the game-board
	boardGrid.forEach((row) => {
		$gameboard.append(`<div class="row">${row.join('')}</div>`)
	})
}

// assigning game pieces to their starting positions
checkers.setupPieces = (rows, cols) => {
	const { playerPosition } = checkers
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let cellID = `#${i}_${j}`
			if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i <= 2) {
				$(cellID).addClass(`black-piece`)
				playerPosition[i][j] = 1
			} else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5) {
				$(cellID).addClass(`red-piece`)
				playerPosition[i][j] = 2
			}
		}
	}
}

checkers.switchPlayer = () => {
	const { $h2, $h3, $gameboard } = checkers
	if ($gameboard.hasClass(`player-two`)) {
		$h2.toggleClass(`player-two-turn`)
		$h3.toggleClass(`player-two-turn`)
	}
	$h2.toggleClass(`player-one-turn player-turn`)
	$h3.toggleClass(`player-one-turn`)
	$gameboard.toggleClass(`player-one player-two`)
}

checkers.alertWinner = (winnerMessage) => {
	checkers.$gameboard.append(`<div class="winner">${winnerMessage}</div>`)
	setTimeout(function () {
	}, 2000)
}

checkers.addToCounter = () => {
	let { $gameboard, playerOneCounter, playerTwoCounter } = checkers
	if ($gameboard.hasClass(`player-two`)) {
		playerOneCounter = playerOneCounter + 1
		$('.player-one-counter').text(playerOneCounter)
	} else {
		playerTwoCounter = playerTwoCounter + 1
		$('.player-two-counter').text(playerTwoCounter)
	}
}

checkers.addToEatCounter = () => {
	let { $gameboard, playerOneEatCounter, playerTwoEatCounter, alertWinner } = checkers
	if ($gameboard.hasClass(`player-one`)) {
		playerOneEatCounter = playerOneEatCounter + 1
		$('.player-one-eat-counter').text(playerOneEatCounter)
	} else {
		playerTwoEatCounter = playerTwoEatCounter + 1
		$('.player-two-eat-counter').text(playerTwoEatCounter)
	}
	if (playerOneEatCounter === 12 || playerTwoEatCounter === 12) {
		let winnerMessage = `You Win!`
		alertWinner(winnerMessage)
	}
}

checkers.checkForOppo = (cellValue, xy, direction) => {
	const { playerPosition } = checkers
	let origX = 0
	let origY = 0
	let oppoX = 0
	let oppoY = 0
	const origPosition = []
	const oppoPosition = []

	switch (direction) {
		case `downLeft`:
			origX = xy[0] - 2
			origY = xy[1] + 2
			oppoX = xy[0] - 1
			oppoY = xy[1] + 1
			break
		case `downRight`:
			origX = xy[0] - 2
			origY = xy[1] - 2
			oppoX = xy[0] - 1
			oppoY = xy[1] - 1
			break
		case `upLeft`:
			origX = xy[0] + 2
			origY = xy[1] + 2
			oppoX = xy[0] + 1
			oppoY = xy[1] + 1
			break
		case `upRight`:
			origX = xy[0] + 2
			origY = xy[1] - 2
			oppoX = xy[0] + 1
			oppoY = xy[1] - 1
			break
	}

	origPosition.push(origX, origY)
	const origDOMId = origPosition.join(`_`)
	const $origDOMId = $($(`#${origDOMId}`))

	oppoPosition.push(oppoX, oppoY)
	const oppoDOMId = oppoPosition.join(`_`)
	const $oppoDOMId = $($(`#${oppoDOMId}`))

	if (oppoX <= 7 && oppoX >= 0) {
		const oppoCellValue = playerPosition[oppoX][oppoY]
		// if the opponent's piece is between the origin and new location of the piece
		if ($origDOMId.hasClass(`black-selected`) && oppoCellValue == 2 && cellValue == 0) {
			$oppoDOMId.removeClass(`red-piece king-piece`)
			playerPosition[oppoX][oppoY] = 0
			return true
			// if the opponent's piece is between the origin and new location of the piece
		} else if ($origDOMId.hasClass(`red-selected`) && oppoCellValue == 1 && cellValue == 0) {
			$oppoDOMId.removeClass(`black-piece king-piece`)
			playerPosition[oppoX][oppoY] = 0
			return true
		}
		return false
	}
}

checkers.checkForDouble = (cellValue, xy, direction) => {
	const { playerPosition, $gameboard } = checkers
	let destX = 0
	let destY = 0
	let oppoX = 0
	let oppoY = 0

	switch (direction) {
		case `downLeft`:
			destX = xy[0] + 2
			destY = xy[1] - 2
			oppoX = xy[0] + 1
			oppoY = xy[1] - 1
			break
		case `downRight`:
			destX = xy[0] + 2
			destY = xy[1] + 2
			oppoX = xy[0] + 1
			oppoY = xy[1] + 1
			break
		case `upLeft`:
			destX = xy[0] - 2
			destY = xy[1] - 2
			oppoX = xy[0] - 1
			oppoY = xy[1] - 1
			break
		case `upRight`:
			destX = xy[0] + -2
			destY = xy[1] + 2
			oppoX = xy[0] - 1
			oppoY = xy[1] + 1
			break
	}
	
	if (destX <= 7 && destX >= 0 && destY <= 7 && destY >= 0) {
		const oppoCellValue = playerPosition[oppoX][oppoY]
		const destCellValue = playerPosition[destX][destY]
		// if the opponent's piece is between the origin and new location of the piece
		if ((($gameboard.hasClass(`player-one`)) && oppoCellValue == 2 && destCellValue === 0 && cellValue == 0) ||
			(($gameboard.hasClass(`player-two`)) && oppoCellValue === 1 && destCellValue === 0 && cellValue === 0)) {
			return true
		}
	}
	return false
}

checkers.playPiece = ($this, add) => {
	const { allSquares, addToCounter, switchPlayer } = checkers
	$this.addClass(add)
	$(allSquares).removeClass(`black-selected red-selected king-selected`)
	addToCounter()
	switchPlayer()
}

checkers.noPlay = ($this) => {
	$this.addClass(`no-play`)
	setTimeout(() => {
		$this.removeClass(`no-play`)
	}, 1000)
}

checkers.doubleJumpAnimation = ($blackSquares, $whiteSquares) => {
	const { switchPlayer, $instructions, $instructionsBox } = checkers
	switchPlayer()
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
		$instructionsBox.css(`height`, `100px`)
		$instructionsBox.fadeIn(`1000`)
		$instructions.text(`Go For The Double Jump!`)
		setTimeout(() => {
			$instructionsBox.fadeOut(`slow`)
		}, 2500)
	}, 2000)
}

// kinging animation
checkers.goldAnimation = ($this, $blackSquares, $whiteSquares, $allSquares) => {
	$this.addClass(`king-piece`)
	$blackSquares.addClass(`gold-jump`)
	$whiteSquares.addClass(`black-jump`)
	setTimeout(function () {
		$allSquares.removeClass('gold-jump black-jump')
	}, 3500)
}

// black and red animations
checkers.jumpAnimation = ($allSquares) => {
	const { $gameboard, addToEatCounter } = checkers
	if ($gameboard.hasClass(`player-two`)) {
		$allSquares.addClass('black-jump')
	} else {
		$allSquares.addClass('red-jump')
	}
	setTimeout(function () {
		$allSquares.removeClass(`red-jump`)
		$allSquares.removeClass(`black-jump`)
	}, 2000)
	addToEatCounter()
}

checkers.userInstructions = (string) => {
	const { $instructions, $instructionsBox } = checkers
	$instructionsBox.css(`height`, `150px`)
	$instructionsBox.fadeIn(`1000`)
	$instructions.text(string)
	setTimeout(() => {
		$instructionsBox.fadeOut(`slow`)
	}, 2500)
}

checkers.onClick = () => {
	let { allSquares, $instructionsBox, playerPosition, destXY, origXY, boardx, boardy, checkForOppo, checkForDouble, $gameboard, noPlay, userInstructions, goldAnimation, jumpAnimation, doubleJumpAnimation, playPiece } = checkers

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

		destXY = [boardx[i], boardy[j]]

		const hasOpponentPieceDownLeft = checkForOppo(cellValue, destXY, `downLeft`)
		const hasOpponentPieceDownRight = checkForOppo(cellValue, destXY, `downRight`)
		const hasOpponentPieceUpLeft = checkForOppo(cellValue, destXY, `upLeft`)
		const hasOpponentPieceUpRight = checkForOppo(cellValue, destXY, `upRight`)
		const hasDoubleJumpDownLeft = checkForDouble(cellValue, destXY, `downLeft`)
		const hasDoubleJumpDownRight = checkForDouble(cellValue, destXY, `downRight`)
		const hasDoubleJumpUpLeft = checkForDouble(cellValue, destXY, `upLeft`)
		const hasDoubleJumpUpRight = checkForDouble(cellValue, destXY, `upRight`)

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
					playerPosition[i][j] = 1
					
					// if this click is already a selected black king
				} else if ($this.hasClass(`king-selected`)) {
					$this.addClass(`black-piece king-piece`).removeClass(`black-selected king-selected`)
					playerPosition[i][j] = 1

					// if this is a black piece and a different black piece is already selected
				} else if (cellValue === 1 && ($allSquares.hasClass(`black-selected`))) {
					noPlay($this)

/////////////////////////////////

					// if this isn't already where any piece already sits and the piece that's selected is black
				} else if (cellValue === 0 && $allSquares.hasClass(`black-selected`)) {

					// if the piece is being moved forward on the board and isn't a king  
					if (destXY[0] > origXY[0] && $allSquares.hasClass(`king-selected`) === false) {

						// if any piece is already selected and it is the first or last row
						if (destXY[0] === 7) {
							goldAnimation($this, $blackSquares, $whiteSquares, $allSquares)
						}
					
						// if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one more than the starting position
						if ((destXY[1] === (origXY[1] + 1) || destXY[1] === (origXY[1] - 1)) && (destXY[0]) === (origXY[0] + 1)) {
							playPiece($this, `black-piece`)
							playerPosition[i][j] = 1

							// if the x axis is two rows down from the starting point
						} else if (destXY[0] === (origXY[0] + 2)) {
					
							// and the y axis is two columns to the left and the square in between those two squares has an opposing player's piece in it
							if ((destXY[1] === (origXY[1] - 2)) && hasOpponentPieceDownLeft) {
								playPiece($this, `black-piece`)
								playerPosition[i][j] = 1
								jumpAnimation($allSquares)
					
								// and has a double jump opportunity down
								if (hasDoubleJumpDownLeft || hasDoubleJumpDownRight) {
									doubleJumpAnimation($blackSquares, $whiteSquares)
								}
					
								// and the y axis of the click is two columns to the right and the square in between those two squares has an opposing player's piece in it
							} else if ((destXY[1] === (origXY[1] + 2)) && hasOpponentPieceDownRight) {
								playPiece($this, `black-piece`)
								playerPosition[i][j] = 1
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
					} else if (((destXY[1] === (origXY[1] + 1)) || (destXY[1] === (origXY[1] - 1) || (destXY[0]) === (origXY[0] + 1)) || (destXY[0] === (origXY[0] - 1))) && ($allSquares.hasClass(`king-selected`))) {
						playPiece($this, `black-piece king-piece`)
						playerPosition[i][j] = 1
					
						//if the x and y axis are two rows away from the starting point and there's an opponent's piece in between
					} else if
						(((destXY[0] === (origXY[0] - 2)) && (destXY[1] === (origXY[1] - 2)) && ($allSquares.hasClass(`king-selected`))) ||
						((destXY[0] === (origXY[0] - 2)) && (destXY[1] === (origXY[1] + 2)) && ($allSquares.hasClass(`king-selected`))) ||
						((destXY[0] === (origXY[0] + 2)) && (destXY[1] === (origXY[1] + 2))) ||
						((destXY[0] === (origXY[0] + 2)) && (destXY[1] === (origXY[1] - 2))) && (hasOpponentPieceUpLeft || hasOpponentPieceUpRight || hasOpponentPieceDownLeft || hasOpponentPieceDownRight)) {
						playPiece($this, `black-piece king-piece`)
						playerPosition[i][j] = 1
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
					destXY = [boardx[i], boardy[j]]

					// if the piece is being moved forward on the board and isn't a king
					if (destXY[0] < origXY[0] && $allSquares.hasClass(`king-selected`) === false) {

						//if any piece is already selected and it is the first or last row
						if (destXY[0] === 0) {
							goldAnimation($this, $blackSquares, $whiteSquares, $allSquares)
						}
						//if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one down than the starting position
						if ((destXY[1] === (origXY[1] + 1) || destXY[1] === (origXY[1] - 1)) && (destXY[0]) === (origXY[0] - 1)) {
							playPiece($this, `red-piece`)
							playerPosition[i][j] = 2

							//if the x axis is two rows down from the starting point
						} else if (destXY[0] === (origXY[0] - 2)) {

							// and the y axis of the click is two columns to the left and the square in between those two squares has an opposing player's piece in it
							if ((destXY[1] === (origXY[1] - 2)) && hasOpponentPieceUpLeft) {
								playPiece($this, `red-piece`)
								playerPosition[i][j] = 2
								jumpAnimation($allSquares)

								//has double jump opportunity up and to the left
								if (hasDoubleJumpUpLeft || hasDoubleJumpUpRight) {
									doubleJumpAnimation($blackSquares, $whiteSquares)
								}
							} else if ((destXY[1] === (origXY[1] + 2)) && hasOpponentPieceUpRight) {
								playPiece($this, `red-piece`)
								playerPosition[i][j] = 2
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
					} else if (((destXY[1] === (origXY[1] + 1)) || (destXY[1] === (origXY[1] - 1) || (destXY[0]) === (origXY[0] + 1)) || (destXY[0] === (origXY[0] - 1))) && ($allSquares.hasClass(`king-selected`))) {
						playPiece($this, `red-piece king-piece`)
						playerPosition[i][j] = 2
						
						//if the x axis is two rows down from the starting point
					} else if
						(((destXY[0] === (origXY[0] - 2)) && (destXY[1] === (origXY[1] - 2))) ||
						((destXY[0] === (origXY[0] - 2)) && (destXY[1] === (origXY[1] + 2))) ||
						((destXY[0] === (origXY[0] + 2)) && (destXY[1] === (origXY[1] + 2)) && ($allSquares.hasClass(`king-selected`))) ||
						((destXY[0] === (origXY[0] + 2)) && (destXY[1] === (origXY[1] - 2)) && ($allSquares.hasClass(`king-selected`))) && (hasOpponentPieceUpLeft || hasOpponentPieceUpRight || hasOpponentPieceDownLeft || hasOpponentPieceDownRight)) {
						playPiece($this, `red-piece king-piece`)
						playerPosition[i][j] = 2
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
				origXY = [boardx[i], boardy[j]]

				//if it's a black king
				if (cellValue === 1 && ($gameboard.hasClass(`player-one`) && $this.hasClass(`king-piece`))) {
					$this.addClass(`black-selected king-selected`).removeClass(`black-piece king-piece`)
					playerPosition[i][j] = 0
				}
			
				//if it's a red king
				if (cellValue === 2 && ($gameboard.hasClass(`player-two`) && $this.hasClass(`king-piece`))) {
					$this.addClass(`red-selected king-selected`).removeClass(`red-piece king-piece`)
					playerPosition[i][j] = 0
				}
			
				// if it's a black piece  
				else if (cellValue === 1 && ($gameboard.hasClass(`player-one`))) {
					$this.addClass(`black-selected`).removeClass(`black-piece`)
					playerPosition[i][j] = 0

					// if it's a red piece
				} else if (cellValue === 2 && ($gameboard.hasClass(`player-two`))) {
					$this.addClass(`red-selected`).removeClass(`red-piece`)
					playerPosition[i][j] = 0
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
	checkers.onClick()
}

$(() => {
	checkers.init()
})