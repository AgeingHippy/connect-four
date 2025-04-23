const Piece = Object.freeze({
  Red: "Red",
  Black: "Black",
});

class BoardStorage {
  #rows = 0;
  #cols = 0;
  #cells = [];

  constructor(rows, cols) {
    this.#rows = rows;
    this.#cols = cols;
    this.clear();
  }

  //drop a piece into a column
  //return y position of piece (0 based)
  dropPiece(col, piece) {
    if (col < 0 || col > this.#cols - 1) {
      throw new RangeError(`Column '${col}' out of bounds`);
    }

    let column = this.#cells[col];
    if (column.length >= this.#rows) {
      throw new RangeError(`Column '${col}' is full`);
    }

    return column.push(piece) - 1;
  }

  //return the element contained in cell row,col
  peek(row, col) {
    return this.#cells[row][col];
  }

  //reset the board to an empty state
  clear() {
    for (let x = 0; x < this.#cols; x++) {
      this.#cells[x] = [];
    }
  }
}

function drawWinner(winningArray) {
  logDebug("drawWinner");
  winningArray.forEach((element) => {
    document
      .getElementById(`square-${element.x}-${element.y}`)
      .classList.add("winner");
  });
}

//check for for pieces in a row
//Algorithm is to, in turn, check from the given piece location in the positive direction and the negative direction
//Stop checking in a given direction when no match
//add results of negative and positive directions with the current position and if >= 4 we have a winner
//If we have a winner, the array of locations is returned
//else undefined is returned
function getWinnerArray(boardStorage, x, y) {
  logDebug("getWinnerArray");
  let deltaArray = [
    { deltaX: 1, deltaY: 0 },
    { deltaX: 0, deltaY: 1 },
    { deltaX: 1, deltaY: 1 },
    { deltaX: 1, deltaY: -1 },
  ];
  let winningArray;
  //function to check for a winner in a particular direction i.e. vertical/horizontal/forwardDiagonal/backwardsDiagonal
  //direction indicated by the deltaX and deltaY IN THE POSITIVE DIRECTION
  //returns an array containing matching elements in a row
  function checkDirection(boardStorage, x, y, deltaX, deltaY) {
    let playerPiece = boardStorage.peek(x, y);

    let ix;
    let iy;
    let winningArray = [{ x: x, y: y }];

    let negCount = 0;
    ix = x - deltaX;
    iy = y - deltaY;
    while (ix >= 0 && ix < G_cols && iy >= 0 && iy < G_rows) {
      if (boardStorage.peek(ix, iy) == playerPiece) {
        negCount++;
        winningArray.unshift({ x: ix, y: iy });
        ix = ix - deltaX;
        iy = iy - deltaY;
      } else {
        ix = -1;
      }
    }

    let posCount = 0;
    ix = x + deltaX;
    iy = y + deltaY;
    while (ix >= 0 && ix < G_cols && iy >= 0 && iy < G_rows) {
      if (boardStorage.peek(ix, iy) == playerPiece) {
        posCount++;
        winningArray.push({ x: ix, y: iy });
        ix = ix + deltaX;
        iy = iy + deltaY;
      } else {
        ix = -1;
      }
    }

    return winningArray;
  }

  //check all 4 directions
  for (i in deltaArray) {
    delta = deltaArray[i];
    winningArray = checkDirection(
      boardStorage,
      x,
      y,
      delta.deltaX,
      delta.deltaY
    );
    if (winningArray.length >= 4) {
      break;
    }
  }

  if (winningArray.length >= 4) {
    return winningArray;
  } else {
    return undefined;
  }
}

function toggleTurn() {
  logDebug("toggleTurn");
  let oldTurn = G_turn.toLowerCase();
  //change turn piece
  G_turn = G_turn == Piece.Red ? Piece.Black : Piece.Red;
  let newTurn = G_turn.toLowerCase();

  //change drop indicators
  let dropButtons = document.querySelectorAll(".drop-button");
  dropButtons.forEach((btn) => {
    btn.classList.remove(`game-piece-${oldTurn}`);
    btn.classList.add(`game-piece-${newTurn}`);
  });
}

function resetDrop() {
  logDebug("resetDrop");
  let dropButtons = document.querySelectorAll(".drop-button");
  dropButtons.forEach((btn) => {
    btn.disabled = false;
    btn.innerText = "drop here";
  });
}

function lockdownDrop() {
  logDebug("lockdownDrop");
  let dropButtons = document.querySelectorAll(".drop-button");
  dropButtons.forEach((btn) => {
    btn.disabled = true;
  });
}

function resetBoard() {
  logDebug("resetBoard");
  G_boardStorage = new BoardStorage(G_rows, G_cols);
  let boardSquares = document.querySelectorAll(".board-square");
  boardSquares.forEach((square) => {
    square.classList.remove("winner");
    square.classList.remove("game-piece-red");
    square.classList.remove("game-piece-black");
    square.innerText = "";
  });
  resetDrop();
  toggleTurn();
}

function resetCompetition() {
  logDebug("resetCompetition");
  //reset scores
  G_turnCount = 0;
  G_scoreRed = 0;
  G_scoreBlack = 0;
  //reset board
  resetBoard();
  updateScoreboard("", 0, 0);
}

function updateScoreboard(result, scoreRed, scoreBlack) {
  logDebug(`updateScoreboard(${result}, ${scoreRed}, ${scoreBlack})`);
  document.getElementById("score-red").value = scoreRed;
  document.getElementById("score-black").value = scoreBlack;
  document.getElementById("result").innerText = result;
}

function logDebug(debugText) {
    let debugElement = document.createElement("p");
    debugElement.innerText = debugText;
    document.getElementById("debug-log").prepend(debugElement);
}
