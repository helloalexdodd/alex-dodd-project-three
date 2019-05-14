$(document).ready(() => {
    let boardGrid = [];

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

    setup(8, 8);

    // can't figure out why this arrow function doesn't work.
    // boardGrid.forEach((row) => {
    //     $(`#gameboard`).append(`<div class="row">${row.join(' ')}</div>`)
    // });
    boardGrid.forEach(function (row) {
        $(`#gameBoard`).append(`<div class="row">${row.join('')}</div>`)
    });

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

    for (let i = 0; i < 1; i++) {
        for (let j = 0; j < 1; j++) {
            $(`.row > div`).on(`click`, function () {
                let cellID = `#${i}_${j}`;
                let arr = [i, j];
                console.log(this)
                // if (i % 2 === 0 && j % 2 !== 0 || i % 2 !== 00 && j === 0) {
                    $(this).toggleClass(`blackSelected`)
                // };
            });
        };
    };
});