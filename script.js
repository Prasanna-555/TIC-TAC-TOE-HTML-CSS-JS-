const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const themeToggle = document.getElementById("themeToggle");
const winLine = document.getElementById("win-line");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

const xScoreEl = document.getElementById("xScore");
const oScoreEl = document.getElementById("oScore");
const drawsEl = document.getElementById("draws");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let scores = { X: 0, O: 0, Draws: 0 };

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");
  if (board[index] !== "" || !gameActive || currentPlayer !== "X") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  clickSound.play();
  checkResult();

  if (gameActive) {
    currentPlayer = "O";
    statusText.textContent = "Computer's Turn";
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  const emptyIndices = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  
  if (move !== undefined) {
    board[move] = "O";
    cells[move].textContent = "O";
    clickSound.play();
    checkResult();
  }

  if (gameActive) {
    currentPlayer = "X";
    statusText.textContent = "Player X's Turn";
  }
}

function checkResult() {
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      showWin(a, b, c);
      scores[currentPlayer]++;
      updateScoreboard();
      statusText.textContent = `Player ${currentPlayer} Wins!`;
      winSound.play();
      confetti(); // 🎉
      gameActive = false;
      return;
    }
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    scores.Draws++;
    updateScoreboard();
    gameActive = false;
    return;
  }
}

function showWin(a, b, c) {
  [a, b, c].forEach(i => {
    cells[i].classList.add("winner");
  });

  // Line animation
  const positions = [
    [0, 0], [1, 0], [2, 0],
    [0, 1], [1, 1], [2, 1],
    [0, 2], [1, 2], [2, 2]
  ];

  const from = positions[a];
  const to = positions[c];

  const dx = to[0] - from[0];
  const dy = to[1] - from[1];

  winLine.style.width = "310px";
  winLine.style.left = `${from[0] * 110 + 5}px`;
  winLine.style.top = `${from[1] * 110 + 45}px`;
  winLine.style.transform = `rotate(${Math.atan2(dy, dx) * 180 / Math.PI}deg)`;
}

function updateScoreboard() {
  xScoreEl.textContent = scores.X;
  oScoreEl.textContent = scores.O;
  drawsEl.textContent = scores.Draws;
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's Turn";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winner");
  });
  winLine.style.width = "0";
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartBtn.addEventListener("click", restartGame);
