const checkers = {
	boardGrid: [], // an empty array to create our boardGrid
	cellValue: [], // an empty array to create our cellValue index
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
	anySquare: `#game-board > div > div`
}

// setting up the board and filling empty global divs for access to x and y axis
checkers.setup = (rows, cols) => {
	const { boardGrid, cellValue, boardx, boardy, $gameboard } = checkers
	for (let i = 0; i < rows; i++) {
		boardGrid[i] = []
		cellValue[i] = []
		boardx[i] = i
		boardy[i] = []
		let n = String.fromCharCode(104 - i)
		for (let j = 0; j < cols; j++) {
			cellValue[i][j] = 0
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
	const { cellValue } = checkers
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let cellID = `#${i}_${j}`
			if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i <= 2) {
				$(cellID).addClass(`black-piece`)
				cellValue[i][j] = 1
			} else if ((i % 2 === 0 && j % 2 !== 0 || i % 2 !== 0 && j % 2 === 0) && i >= 5) {
				$(cellID).addClass(`red-piece`)
				cellValue[i][j] = 2
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

checkers.checkForOppo = (cell, xy, direction) => {
	const { cellValue } = checkers
	let origX = 0
	let origY = 0
	let oppoX = 0
	let oppoY = 0
	const oppoPosition = []
	const origSelection = []

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
	origSelection.push(origX, origY)
	const origDOMId = origSelection.join(`_`)
	const $origDOMId = $($(`#${origDOMId}`))

	oppoPosition.push(oppoX, oppoY)
	const oppoDOMId = oppoPosition.join(`_`)
	const $oppoDOMId = $($(`#${oppoDOMId}`))

	if (oppoX <= 7 && oppoX >= 0) {
		const oppoCell = cellValue[oppoX][oppoY]
		// if the opponent's piece is between the origin and new location of the piece
		if ($origDOMId.hasClass(`black-selected`) && oppoCell == 2 && cell == 0) {
			$oppoDOMId.removeClass(`red-piece king-piece`)
			cellValue[oppoX][oppoY] = 0
			return true
			// if the opponent's piece is between the origin and new location of the piece
		} else if ($origDOMId.hasClass(`red-selected`) && oppoCell == 1 && cell == 0) {
			$oppoDOMId.removeClass(`black-piece king-piece`)
			cellValue[oppoX][oppoY] = 0
			return true
		}
		return false
	}
}

checkers.checkForDouble = (cell, xy, direction) => {
	const { cellValue, $gameboard } = checkers
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
		const oppoCell = cellValue[oppoX][oppoY]
		const destCell = cellValue[destX][destY]
		if ((($gameboard.hasClass(`player-one`)) && oppoCell == 2 && destCell === 0 && cell == 0) ||
			(($gameboard.hasClass(`player-two`)) && oppoCell === 1 && destCell === 0 && cell === 0)) {
			return true
		}
	}
	return false
}

checkForSingleMove = (destXY, origXY) => {
	const { $gameboard } = checkers
	if ($gameboard.hasClass(`player-one`)) {
		return (destXY[1] === (origXY[1] + 1) || destXY[1] === (origXY[1] - 1)) && (destXY[0]) === (origXY[0] + 1)
	}
	return (destXY[1] === (origXY[1] + 1) || destXY[1] === (origXY[1] - 1)) && (destXY[0]) === (origXY[0] - 1)
}

checkForJumpMove = (cell, destXY, origXY) => {
	const { checkForOppo, $gameboard } = checkers
	const checkForOpponentDownLeft = checkForOppo(cell, destXY, `downLeft`)
	const checkForOpponentDownRight = checkForOppo(cell, destXY, `downRight`)
	const checkForOpponentUpLeft = checkForOppo(cell, destXY, `upLeft`)
	const checkForOpponentUpRight = checkForOppo(cell, destXY, `upRight`)
	
	if ($gameboard.hasClass(`player-one`)) {
		return (destXY[0] === (origXY[0] + 2)) && (((destXY[1] === (origXY[1] - 2)) && checkForOpponentDownLeft) || ((destXY[1] === (origXY[1] + 2)) && checkForOpponentDownRight))
	}
	return (destXY[0] === (origXY[0] - 2)) && (((destXY[1] === (origXY[1] - 2)) && checkForOpponentUpLeft) || ((destXY[1] === (origXY[1] + 2)) && checkForOpponentUpRight))
}

checkers.playPiece = ($this, add) => {
	const { anySquare, addToCounter, switchPlayer } = checkers
	$this.addClass(add)
	$(anySquare).removeClass(`black-selected red-selected king-selected`)
	addToCounter()
	switchPlayer()
}

checkers.getDOMId = (origXY) => {
	const origSelection = []
	const origX = origXY[0]
	const origY = origXY[1]
	origSelection.push(origX, origY)
	const origDOMId = origSelection.join(`_`)
	const $origDOMId = $($(`#${origDOMId}`))
	return $origDOMId
}

checkers.stopPlay = ($this) => {
	$this.addClass(`no-play`)
	setTimeout(() => {
		$this.removeClass(`no-play`)
	}, 1000)
}

checkers.animateDoubleJump = ($blackSquares, $whiteSquares) => {
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
checkers.animateGold = ($blackSquares, $whiteSquares, $anySquare) => {
	$blackSquares.addClass(`gold-jump`)
	$whiteSquares.addClass(`black-jump`)
	setTimeout(function () {
		$anySquare.removeClass('gold-jump black-jump')
	}, 3500)
}

// black and red animations
checkers.animateJump = ($anySquare) => {
	const { $gameboard, addToEatCounter } = checkers
	if ($gameboard.hasClass(`player-two`)) {
		$anySquare.addClass('black-jump')
	} else {
		$anySquare.addClass('red-jump')
	}
	setTimeout(function () {
		$anySquare.removeClass(`red-jump`)
		$anySquare.removeClass(`black-jump`)
	}, 2000)
	addToEatCounter()
}

checkers.messagePlayer = (string) => {
	const { $instructions, $instructionsBox } = checkers
	$instructionsBox.css(`height`, `150px`)
	$instructionsBox.fadeIn(`1000`)
	$instructions.text(string)
	setTimeout(() => {
		$instructionsBox.fadeOut(`slow`)
	}, 2500)
}

checkers.onClick = () => {
	let { anySquare, $instructionsBox, cellValue, destXY, origXY, boardx, boardy, checkForOppo, checkForDouble, getDOMId, $gameboard, stopPlay, messagePlayer, animateGold, animateJump, animateDoubleJump, playPiece } = checkers

	$gameboard.on(`click keypress`, `.row > div`, function() {		
		const $anySquare = $(anySquare)
		const $blackSquares = $(`.black-square`)
		const $whiteSquares = $(`.white-square`)
		const $this = $(this)

		$instructionsBox.hide()

		// this stuff lets me access the i and j axis of my global arrays by using the id's of each div and passing it
		const $idString = $this.attr(`id`)
		const idArrayString = $idString.split("_", 2)
		const i = idArrayString[0]
		const j = idArrayString[1]

		cell = (cellValue[i][j])
		destXY = [boardx[i], boardy[j]]

		const isDoubleDownLeft = checkForDouble(cell, destXY, `downLeft`)
		const isDoubleDownRight = checkForDouble(cell, destXY, `downRight`)
		const isDoubleUpLeft = checkForDouble(cell, destXY, `upLeft`)
		const isDoubleUpRight = checkForDouble(cell, destXY, `upRight`)
		const isSingleMove = checkForSingleMove(destXY, origXY)
		const isJumpMove = checkForJumpMove(cell, destXY, origXY)
		const $prevSelection = getDOMId(origXY)

		if ($gameboard.hasClass(`player-one`)) {
			switch (cell) {
				case 0: // clicking on an empty square
					if ($anySquare.hasClass(`black-selected`)) {
						if ($this.hasClass(`black-selected`)) {
							cellValue[i][j] = 1
							$this.addClass(`black-piece`).removeClass(`black-selected`)
							$this.hasClass(`king-selected`) ? $this.addClass(`king-piece`).removeClass(`king-selected`) : null
						}
						if (isSingleMove) {
							playPiece($this, `black-piece`)
							cellValue[i][j] = 1
						}
						if (isJumpMove) {
							playPiece($this, `black-piece`)
							cellValue[i][j] = 1
							animateJump($anySquare)
							if (isDoubleDownLeft || isDoubleDownRight) {
								animateDoubleJump($blackSquares, $whiteSquares)
							}
						}
					} else {
						stopPlay($this)
					}
					break
				case 1: //clicking on your own piece
					if ($anySquare.hasClass(`black-selected`)) {
						if ($this.hasClass(`black-piece`)) {
							cellValue[origXY[0]][origXY[1]] = 1
							origXY = [boardx[i], boardy[j]]
							cellValue[i][j] = 0
							$prevSelection.removeClass(`black-selected`).addClass(`black-piece`)
							$this.addClass(`black-selected`).removeClass(`black-piece`)
							$this.hasClass(`king-piece`) ? $this.addClass(`king-selected`).removeClass(`king-piece`) : null	
						}
					} else if (!$anySquare.hasClass(`black-selected`)) {
						origXY = [boardx[i], boardy[j]]
						cellValue[i][j] = 0
						$this.addClass(`black-selected`).removeClass(`black-piece`)
						$this.hasClass(`king-piece`) ? $this.addClass(`king-selected`).removeClass(`king-piece`) : null
					}
					break
				case 2: // clicking on opponent's piece
					stopPlay($this)
					!$anySquare.hasClass(`black-selected`) ? messagePlayer(`Please stop trying to pick up your opponent's pieces.`) : null
					break
			}
		} else if ($gameboard.hasClass(`player-two`)) {
			switch (cell) {
				case 0: // clicking on an empty square
					if ($anySquare.hasClass(`red-selected`)) {
						if ($this.hasClass(`red-selected`)) {
							cellValue[i][j] = 2
							$this.addClass(`red-piece`).removeClass(`red-selected`)
							$this.hasClass(`king-selected`) ? $this.addClass(`king-piece`).removeClass(`king-selected`) : null
						}
						if (isSingleMove) {
							playPiece($this, `red-piece`)
							cellValue[i][j] = 2
						}
						if (isJumpMove) {
							playPiece($this, `red-piece`)
							cellValue[i][j] = 2
							animateJump($anySquare)
							if (isDoubleUpLeft || isDoubleUpRight) {
								animateDoubleJump($blackSquares, $whiteSquares)
							}
						}
					} else {
						stopPlay($this)
					}
					break
				case 2: //clicking on your own piece
					if ($anySquare.hasClass(`red-selected`)) {
						if ($this.hasClass(`red-piece`)) {
							cellValue[origXY[0]][origXY[1]] = 2
							origXY = [boardx[i], boardy[j]]
							cellValue[i][j] = 0
							$prevSelection.removeClass(`red-selected`).addClass(`red-piece`)
							$this.addClass(`red-selected`).removeClass(`red-piece`)
							$this.hasClass(`king-piece`) ? $this.addClass(`king-selected`).removeClass(`king-piece`) : null
						}
					} else if (!$anySquare.hasClass(`red-selected`)) {
						origXY = [boardx[i], boardy[j]]
						cellValue[i][j] = 0
						$this.addClass(`red-selected`).removeClass(`red-piece`)
						$this.hasClass(`king-piece`) ? $this.addClass(`king-selected`).removeClass(`king-piece`) : null
					}
					break
				case 1: // clicking on opponent's piece
					stopPlay($this)
					!$anySquare.hasClass(`red-selected`) ? messagePlayer(`Please stop trying to pick up your opponent's pieces.`) : null
					break
			}
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