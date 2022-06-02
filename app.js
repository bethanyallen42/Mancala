//-----------------game object-----------------------

let game = {
  numOfPlayers: 0,
  playerOne: "",
  playerTwo: "",
  pipArray: [],
  opposites: {
    0: 12,
    1: 11,
    2: 10,
    3: 9,
    4: 8,
    5: 7,
    7: 5,
    8: 4,
    9: 3,
    10: 2,
    11: 1,
    12: 0,
  },
  currentPlayer: 0,
  winner: "",
};

//---------------Gathering Player info--------------

let next = document.querySelector("#next");
let chooseNumber = document.querySelector("#choose_number");
let readyToPlay = document.querySelector("#ready_to_play");
let playerOneInput = document.querySelector("#player_one_input");
let playerTwoInput = document.querySelector("#player_two_input");

const enterNumber = document.querySelector("#enter_number");
const enterName = document.querySelector("#enter_name");
const displayTurn = document.querySelector("#vs");
const playerOneSide = document.querySelector("#player_one_side");
const playerTwoSide = document.querySelector("#player_two_side");

next.addEventListener("click", () => {
  game.numOfPlayers = parseInt(chooseNumber.value);

  if (game.numOfPlayers === 1) {
    playerTwoInput.remove();
    game.playerTwo = "Computer";
  }

  enterNumber.style.display = "none";
  enterName.style.display = "block";
});

readyToPlay.addEventListener("click", (e) => {
  e.preventDefault();
  game.playerOne = playerOneInput.value;

  if (game.numOfPlayers === 2) {
    game.playerTwo = playerTwoInput.value;
  }

  playerOneSide.innerText = `${game.playerOne}'s side`;
  playerTwoSide.innerText = `${game.playerTwo}'s side`;

  enterName.style.display = "none";
  displayTurn.style.fontSize = "20px";
  displayTurn.style.display = "block";
  currentGame = buildInitialState();
});

//--------------build Initial state--------------

function buildInitialState() {
  game.pipArray = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
  //game.pipArray = [0, 0, 0, 0, 0, 1, 5, 0, 0, 0, 0, 0, 1, 5];
  placePips();
  chooseBeginningPlayer();
  whoseTurn();
}

function chooseBeginningPlayer() {
  game.currentPlayer = Math.floor(Math.random() * 2) + 1;
}

function placePips() {
  game.pipArray.forEach((numOfPips, index) => {
    const box = document.querySelector(`[data-index="${index}"]`);
    box.innerHTML = "";

    for (let i = 0; i < numOfPips; i++) {
      let pip = document.createElement("div");
      pip.className = "pip";
      box.appendChild(pip);
    }
  });
}

function whoseTurn() {
  if (game.currentPlayer === 1) {
    displayTurn.innerText = `${game.playerOne}'s Turn`;
  } else {
    displayTurn.innerText = `${game.playerTwo}'s Turn`;
  }
}

//------------------Take a turn-----------------
const alertWindow = document.querySelector("#alert_wrapper");
const closeAlert = document.querySelector("#close_alert");
const alertMessage = document.querySelector("#message");

const winnerWindow = document.querySelector("#winner_window");
const announceWinner = document.querySelector("#winner");
const newGameReset = document.querySelector("#new_game_reset");
const closeModal = document.querySelector("#close_modal");

winnerWindow.style.display = "none";
alertWindow.style.display = "none";

const board = document.querySelector(".board");

board.addEventListener("click", (e) => {
  if (isValidPit(e)) {
    turn(e);
  }
});

function isValidPit(event) {
  if (event.target.classList.contains("mancala")) {
    alertMessage.innerText =
      "You cannot choose a mancala.  Please choose a pit.";
    alertWindow.style.display = "flex";
    return false;
  }

  if (game.currentPlayer != event.target.dataset.player) {
    alertMessage.innerText = "Choose a pit on your side.";
    alertWindow.style.display = "flex";
    return false;
  }

  let index = parseInt(event.target.dataset.index);

  if (game.pipArray[index] === 0) {
    alertMessage.innerText = "This pit is empty.  Please choose another.";
    alertWindow.style.display = "flex";
    return false;
  }

  return true;
}

function turn(event) {
  let index = parseInt(event.target.dataset.index);
  let hand = game.pipArray[index];

  game.pipArray[index] = 0;
  let endIndex = movePips(hand, index);
  const box = document.querySelector(`[data-index="${endIndex}"]`);

  if (
    game.pipArray[endIndex] === 1 &&
    box.dataset.player == game.currentPlayer &&
    !box.classList.contains("mancala")
  ) {
    stealPips(endIndex);
  }

  placePips();

  if (isSideEmpty()) {
    gameOver(whoWins);

    return;
  }

  if (box.classList.contains("mancala")) {
    displayTurn.innerText = `You get another turn!`;
  } else {
    changePlayer();
  }
}

function movePips(numOfPips, pitIndex) {
  let currentIndex;
  for (let i = 1; i <= numOfPips; i++) {
    currentIndex = (pitIndex + i) % 14;
    if (game.currentPlayer === 1 && currentIndex === 13) {
      numOfPips++;
      continue;
    } else if (game.currentPlayer === 2 && currentIndex === 6) {
      numOfPips++;
      continue;
    }
    game.pipArray[currentIndex]++;
  }

  return currentIndex;
}

function stealPips(index) {
  let oppositeIndex = game.opposites[index];
  let stealNumber = game.pipArray[oppositeIndex];

  if (game.currentPlayer === 1) {
    game.pipArray[oppositeIndex] = 0;
    game.pipArray[6] += stealNumber;
  } else {
    game.pipArray[oppositeIndex] = 0;
    game.pipArray[13] += stealNumber;
  }
}

function changePlayer() {
  if (game.currentPlayer === 1) {
    game.currentPlayer = 2;
  } else {
    game.currentPlayer = 1;
  }
  whoseTurn();
}

function isSideEmpty() {
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < 6; i++) {
    sum1 += game.pipArray[i];
  }

  for (let i = 7; i < 13; i++) {
    sum2 += game.pipArray[i];
  }

  if (sum1 === 0 || sum2 === 0) {
    return true;
  } else {
    return false;
  }
}

function gameOver(callback) {
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < game.pipArray.length; i++) {
    if (i < 7) {
      sum1 += game.pipArray[i];
      game.pipArray[i] = 0;
    } else {
      sum2 += game.pipArray[i];
      game.pipArray[i] = 0;
    }
  }

  game.pipArray[6] = sum1;
  game.pipArray[13] = sum2;

  placePips();
  setTimeout(callback, 1000);
}

function whoWins() {
  switch (true) {
    case game.pipArray[6] > game.pipArray[13]:
      game.winner = game.playerOne;
      break;
    case game.pipArray[6] < game.pipArray[13]:
      game.winner = game.playerTwo;
      break;
    default:
      announceWinner.innerText = "It's a tie!";
      winnerWindow.style.display = "flex";
      return;
  }

  announceWinner.innerText = `${game.winner} wins!`;
  winnerWindow.style.display = "flex";
}

//--------------------Button event listeners-----------------
closeAlert.addEventListener("click", () => {
  alertWindow.style.display = "none";
});

closeModal.addEventListener("click", () => {
  winnerWindow.style.display = "none";
});

newGameReset.addEventListener("click", () => {
  buildInitialState();
  winnerWindow.style.display = "none";
});
