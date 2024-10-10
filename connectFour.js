// Initial references
// Create global variables for the different elements in the document

const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const message = document.getElementById("message");

// initialize board
let initialMatrix = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

let currentPlayer;
let isGameActive;

function gameOverCheck() {
  let count = 0;

  for (innerArray of initialMatrix) {
    // if each cell in a row is not equal to 0, increment row counter
    if (innerArray.every((val) => val != 0)) {
      count++;
    } else {
      return false;
    }
  }

  // if all cells in all rows are filled, display game over message
  if (count === 6) {
    message.innerText = "Game Over";
    return false;
  }
}

function winCheck(row, column) {
  if (
    checkHorizontal() ||
    checkVertical() ||
    checkPositiveDiagonal() ||
    checkNegativeDiagonal()
  ) {
    return true;
  } else {
    return false;
  }
}

function checkHorizontal() {
  for (let row = 0; row < initialMatrix.length; row++) {
    for (let col = 0; col <= initialMatrix[row].length - 4; col++) {
      if (
        initialMatrix[row][col] === currentPlayer &&
        initialMatrix[row][col + 1] === currentPlayer &&
        initialMatrix[row][col + 2] === currentPlayer &&
        initialMatrix[row][col + 3] === currentPlayer
      ) {
        return true;
      }
    }
  }

  return false;
}

function checkVertical() {
  for (let row = 0; row < initialMatrix.length; row++) {
    for (let col = 0; col < initialMatrix[row].length; col++) {
      if (
        row + 3 < initialMatrix.length &&
        initialMatrix[row][col] === currentPlayer
      ) {
        if (
          initialMatrix[row + 1][col] === currentPlayer &&
          initialMatrix[row + 2][col] === currentPlayer &&
          initialMatrix[row + 3][col] === currentPlayer
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

// from bottom right to top left
function checkPositiveDiagonal() {
  for (let row = 0; row < initialMatrix.length; row++) {
    for (let col = 0; col < initialMatrix[row].length; col++) {
      if (
        row + 3 < initialMatrix.length &&
        col + 3 < initialMatrix[row].length &&
        initialMatrix[row][col] === currentPlayer
      ) {
        if (
          initialMatrix[row + 1][col + 1] === currentPlayer &&
          initialMatrix[row + 2][col + 2] === currentPlayer &&
          initialMatrix[row + 3][col + 3] === currentPlayer
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

// from bottom left to top right
function checkNegativeDiagonal() {
  for (let row = 0; row < initialMatrix.length; row++) {
    for (let col = 0; col < initialMatrix[row].length; col++) {
      if (
        row + 3 < initialMatrix.length &&
        col - 3 >= 0 &&
        initialMatrix[row][col] === currentPlayer
      ) {
        if (
          initialMatrix[row + 1][col - 1] === currentPlayer &&
          initialMatrix[row + 2][col - 2] === currentPlayer &&
          initialMatrix[row + 3][col - 3] === currentPlayer
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

function setPiece(startCount, colValue) {
  // select all rows in the grid
  let rows = document.querySelectorAll(".grid-row");

  try {
    // check if current position is filled
    if (initialMatrix[startCount][colValue] !== 0) {
      // if filled, move up one row
      startCount--;
      setPiece(startCount, colValue);
    } else {
      // if empty, add the piece to the current row
      let currentRow = rows[startCount].querySelectorAll(".grid-box");
      currentRow[colValue].classList.add("filled", `player${currentPlayer}`);
      initialMatrix[startCount][colValue] = currentPlayer;

      // if winCheck is true
      if (winCheck(startCount, colValue)) {
        message.innerHTML = `Player<span> ${currentPlayer}</span> wins`;
        isGameActive = false;
        return false;
      }
    }
  } catch (e) {
    alert("Column full, select again");
  }

  gameOverCheck();
}

function fillBox(e) {
  // Only allow moves if the game is still active
  if (!isGameActive) return;
  
  // Declare variable colValue set equal to function parseInt() of parameter e, object target, function getAttribute, passing as argument "data-value"
  let colValue = parseInt(e.target.getAttribute("data-value"));
  // Call function setPiece, passing arguments 5 (because we have 6 rows, 0 - 5) and colValue
  setPiece(5, colValue);

  // if game is not over, switch player
  if (isGameActive) {
    // Switch the currentPlayer, if currently 1 then 2, if currently 2, then 1
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
  }
}

function createBoard() {
  // Iterate through the 2d array initialMatrix
  // Write an outer for in loop to iterate through the rows, loop control variable innerArray, in 2d array initialMatrix
  for (innerArray in initialMatrix) {
    var outerDiv = document.createElement("div");
    outerDiv.classList.add("grid-row"); // adds a row to the board
    outerDiv.setAttribute("data-value", innerArray); // stores the row index

    // Write an inner for in loop to iterate through the columns, loop control variable j, in 2d array initialMatrix, index innerArray
    for (let j in initialMatrix[innerArray]) {
      // Set each element in array initialMatrix to the value of 0
      initialMatrix[innerArray][j] = 0;

      let innerDiv = document.createElement("div");
      innerDiv.classList.add("grid-box");
      innerDiv.setAttribute("data-value", j); // stores the column index
      innerDiv.addEventListener("click", (e) => fillBox(e)); // when a column is clicked fill a piece
      outerDiv.appendChild(innerDiv);
    }
    container.appendChild(outerDiv);
  }
}

function startGame() {
  // Set currentPlayer to 1, player 1 always goes first
  currentPlayer = 1;
  isGameActive = true;
  container.innerHTML = "";
  createBoard();
  playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
}

window.onload = startGame();
