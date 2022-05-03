// Board variables:
var board = [];
var ROWS = 8;
var COLS = 8;

// Mines variables:
var minesCount = 10;
var minesLocation = [];
var tilesClicked = 0;

// Boolean variables:
var flagEnabled = false;
var gameOver = false;

// Code section:
window.onload = function () {
  startGame();
};

function setMines() {
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let row = Math.floor(Math.random() * ROWS);
    let col = Math.floor(Math.random() * COLS);
    let id = row.toString() + "-" + col.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft--;
    }
  }
}

function startGame() {
  document.getElementById("mines-count").innerText = minesCount;
  document.getElementById("flag-btn").addEventListener("click", setFlag);
  setMines();

  //Create the board
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      let tile = document.createElement("div");
      tile.id = r.toString() + "-" + c.toString();
      tile.addEventListener("click", clickTile);
      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

function setFlag() {
  if (flagEnabled) {
    flagEnabled = false;
    document.getElementById("flag-btn").style.backgroundColor = "lightgray";
  } else {
    flagEnabled = true;
    document.getElementById("flag-btn").style.backgroundColor = "darkgray";
  }
}

function clickTile() {
  if (gameOver || this.classList.contains("tile-clicked")) {
    return;
  }

  let tile = this;
  if (flagEnabled) {
    if (tile.innerText == "") {
      tile.innerText = "🚩";
    } else if (tile.innerText == "🚩") {
      tile.innerText = "";
    }
    return;
  }

  if (minesLocation.includes(tile.id)) {
    alert("GAME OVER");
    gameOver = true;
    revealMines();
    return;
  }

  let coords = tile.id.split("-");
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  checkMine(r, c);
}

function revealMines() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let tile = board[row][col];
      if (minesLocation.includes(tile.id)) {
        tile.innerText = "💣";
        tile.style.backgroundColor = "red";
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) {
    return;
  }
  if (board[r][c].classList.contains("tile-clicked")) {
    return;
  }

  board[r][c].classList.add("tile-clicked");
  tilesClicked += 1;

  let minesFound = 0;

  // top 3
  minesFound += checkTile(r - 1, c - 1); // top left
  minesFound += checkTile(r - 1, c); // top
  minesFound += checkTile(r - 1, c + 1); // top right

  // left and right
  minesFound += checkTile(r, c - 1); // left
  minesFound += checkTile(r, c + 1); // right

  // bottom 3
  minesFound += checkTile(r + 1, c - 1); // bottom left
  minesFound += checkTile(r + 1, c); // bottom
  minesFound += checkTile(r + 1, c + 1); // bottom right

  if (minesFound > 0) {
    board[r][c].innerText = minesFound;
    board[r][c].classList.add("x" + minesFound.toString());
  } else {
    // top 3
    checkMine(r - 1, c - 1); // top left
    checkMine(r - 1, c); // top
    checkMine(r - 1, c + 1); // top right

    // left and right
    checkMine(r, c - 1); // left
    checkMine(r, c + 1); // right

    // bottom 3
    checkMine(r + 1, c - 1); // bottom left
    checkMine(r + 1, c); // bottom
    checkMine(r + 1, c + 1); // bottom right
  }

  if (tilesClicked == ROWS * COLS - minesCount) {
    document.getElementById("mines-count").innerText = "Cleared";
    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) {
    return 0;
  }
  if (minesLocation.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}
