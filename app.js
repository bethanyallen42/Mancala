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
const verses = document.querySelector("#vs");

next.addEventListener("click", () => {
  game.numOfPlayers = parseInt(chooseNumber.value);

  if (game.numOfPlayers === 1) {
    game.playerTwoInput.remove();
    game.playerTwo = "Computer";
  }

  enterNumber.style.display = "none";
  enterName.style.display = "block";
});

readyToPlay.addEventListener("click", (e) => {
  e.preventDefault();
  game.playerOne = playerOneInput.value;

  if (game.numOfPlayers === 1) {
    verses.innerText = `${game.playerOne} vs. ${game.playerTwo}`;
  } else {
    game.playerTwo = playerTwoInput.value;
    verses.innerText = `${game.playerOne} vs. ${game.playerTwo}`;
  }

  enterName.style.display = "none";
  verses.style.display = "block";
  currentGame = buildInitialState();
});

//--------------build Initial state--------------

function buildInitialState() {
  game.pipArray = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];

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

const displayTurn = document.querySelector("#whose_turn");
function whoseTurn() {
  if (game.currentPlayer === 1) {
    displayTurn.innerText = `${game.playerOne}'s Turn`;
  } else {
    displayTurn.innerText = `${game.playerTwo}'s Turn`;
  }
}

//------------------Take a turn-----------------
const board = document.querySelector(".board");

board.addEventListener("click", (e) => {
  if (isValidPit(e)) {
    turn(e);
  }
});

function isValidPit(event) {
  if (event.target.classList.contains("mancala")) {
    alert("You cannot choose a mancala.  Please choose a pit.");
    return false;
  }

  if (game.currentPlayer != event.target.dataset.player) {
    alert("Choose a pit on your side.");
    return false;
  }

  let index = parseInt(event.target.dataset.index);

  if (game.pipArray[index] === 0) {
    alert("This pit is empty.  Please choose another.");
    return false;
  }

  return true;
}

function turn(event) {
  let index = parseInt(event.target.dataset.index);
  let hand = game.pipArray[index];

  game.pipArray[index] = 0;

  let currentIndex = movePips(hand, index);
  const box = document.querySelector(`[data-index="${currentIndex}"]`);

  if (
    game.pipArray[currentIndex] === 1 &&
    box.dataset.player == game.currentPlayer
  ) {
    stealPips(currentIndex);
  }

  placePips();

  if (isSideEmpty()) {
    gameOver();
    placePips();
    whoWins();
    return;
  }

  if (box.classList.contains("mancala")) {
    displayTurn.innerText = `You get another turn!`;
  } else {
    changePlayer();
  }
}

function movePips(numOfPips, pitIndex) {
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

function gameOver() {
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
      alert("It's a tie!");
      return;
  }

  alert(game.winner + " wins!");
}
