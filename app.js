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
    alert("You cannot choose a mancala.  Please choose a pit on your side");
    return false;
  }

  if (
    game.currentPlayer === 1 &&
    event.target.classList.contains("player_two_box")
  ) {
    alert("Choose a pit on your side.");
    return false;
  } else if (
    game.currentPlayer === 2 &&
    event.target.classList.contains("player_one_box")
  ) {
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

  let currentIndex;
  for (let i = 1; i <= hand; i++) {
    currentIndex = (index + i) % 14;

    if (game.currentPlayer === 1 && currentIndex === 13) {
      hand++;
      continue;
    } else if (game.currentPlayer === 2 && currentIndex === 6) {
      hand++;
      continue;
    }
    game.pipArray[currentIndex]++;
  }

  let oppositeIndex = game.opposites[currentIndex];
  const box = document.querySelector(`[data-index="${currentIndex}"]`);

  //can I place this in a seperate function? maybe the section that's in the if block
  if (
    game.pipArray[currentIndex] === 1 &&
    box.classList.contains("player_one_box") &&
    game.currentPlayer === 1
  ) {
    let stealNumber = game.pipArray[oppositeIndex];
    game.pipArray[oppositeIndex] = 0;
    game.pipArray[6] += stealNumber;
  }

  if (
    game.pipArray[currentIndex] === 1 &&
    box.classList.contains("player_two_box") &&
    game.currentPlayer === 2
  ) {
    let stealNumber = game.pipArray[oppositeIndex];
    game.pipArray[oppositeIndex] = 0;
    game.pipArray[13] += stealNumber;
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

function changePlayer() {
  if (game.currentPlayer === 1) {
    game.currentPlayer = 2;
  } else {
    game.currentPlayer = 1;
  }
  whoseTurn();
}

//function to steal pips? take code from turn...
//function to check if one side of pits is empty--should check this every turn

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
//function to see who is the game.winner

function whoWins() {
  if (game.pipArray[6] === game.pipArray[13]) {
    alert("It's a tie!");
    return;
  } else if (game.pipArray[6] > game.pipArray[13]) {
    game.winner = game.playerOne;
  } else {
    game.winner = game.playerTwo;
  }

  alert(game.winner + " wins!");
}
