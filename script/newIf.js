// if this click is a black square (because pieces can only move on black squares)
	// if this is a red piece and a different black piece is already selected
	// if any black piece is already selected
		// if this click is already a selected black piece
			// if this click is already a selected black king
			// if this is a black piece and a different black piece is already selected
			// if this isn't already where any piece already sits and the piece that's selected is black
			// if the piece is being moved forward on the board and isn't a king  
				// if any piece is already selected and it is the first or last row
				// if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one more than the starting position
					// if the x axis is two rows down from the starting point
					// and the y axis is two columns to the left and the square in between those two squares has an opposing player's piece in it
						// and has a double jump opportunity down
						// and the y axis of the click is two columns to the right and the square in between those two squares has an opposing player's piece in it
						// and has a double jump opportunity down
				// if the x and y axis is only one space away from the starting position
				//if the x and y axis are two rows away from the starting point and there's an opponent's piece in between
				//has double jump opportunity up and to the left
					//double jump animation
		// if any red piece is already selected
		//if this click is already a selected red piece
			//if this click is already a selected red king
			//if this is a red piece and a different red piece is already selected
			// if this isn't already where any piece already sits and the piece that is selected is red
			// store the new x and y axis
			// if the piece is being moved forward on the board and isn't a king
				//if any piece is already selected and it is the first or last row
				//if the y axis of the click is only one column away from the starting position and if the x axis of the click is only one down than the starting position
					//if the x axis is two rows down from the starting point
					// and the y axis of the click is two columns to the left and the square in between those two squares has an opposing player's piece in it
						//has double jump opportunity up and to the left
						// has double jump opportunity up and to the left
				// if the x and y axis is only one space away from the starting position
				//if the x axis is two rows down from the starting point
				//has double jump opportunity up and to the left
	// if no pieces are already selected
		// store the x and y axis
		//if it's a black king
		//if it's a red king
		// if it's a black piece  
			// if it's a red piece



if ($gameboard.hasClass(`player-one`)) {
	switch (cellValue) {
		case 0: // clicking on an empty square
			// all the moves
			break
		case 1: //clicking on your own piece
			if ($allSquares.hasClass(`black-selected`)) {
				playerPosition[i][j] = 1
				$this.addClass(`black-piece`).removeClass(`black-selected`)
				$this.hasClass(`king-selected`) ? $this.removeClass(`king-selected`).addClass(`king-piece`) : null
			} else if (!$allSquares.hasClass(`black-selected`)) {
				origXY = [boardx[i], boardy[j]]
				playerPosition[i][j] = 0
				$this.addClass(`black-selected`).removeClass(`black-piece`)
				$this.hasClass(`king-piece`) ? $this.addClass(`king-selected`).removeClass(`king-piece`) : null
			}

			break
		case 2: // clicking on opponent's piece
			noPlay($this)
			userInstructions(`Please stop trying to pick up your opponent's pieces.`)
			break
	}
} else if ($gameboard.hasClass(`player-two`)) {
	switch (cellValue) {
		case 0: // clicking on an empty square
			// all the moves
			break
		case 1: // clicking on opponent's piece
			noPlay($this)
			userInstructions(`Please stop trying to pick up your opponent's pieces.`)
			break
		case 2: //clicking on your own piece
			if ($allSquares.hasClass(`red-selected`)) {
				playerPosition[i][j] = 1
				$this.addClass(`red-piece`).removeClass(`red-selected`)
				$this.hasClass(`king-selected`) ? $this.removeClass(`king-selected`).addClass(`king-piece`) : null
			} else if (!$allSquares.hasClass(`black-selected`)) {
				origXY = [boardx[i], boardy[j]]
				playerPosition[i][j] = 0
				$this.addClass(`red-selected`).removeClass(`red-piece`)
				$this.hasClass(`king-piece`) ? $this.addClass(`king-selected`).removeClass(`king-piece`) : null
			}
			break
	}
}

// if the gameboard hasClass player-one or player-two - 6 total
// if the cell value is 0, 1, or 2 - 10
// if any red, black, king or no piece has been selected - 15 total






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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