//---------------Gathering Player info--------------
let next = document.querySelector("#next");
let chooseNumber = document.querySelector("#choose_number");
let readyToPlay = document.querySelector("#ready_to_play");
let playerOneInput = document.querySelector("#player_one_input");
let playerTwoInput = document.querySelector("#player_two_input");
let playerOne;
let playerTwo;

let numOfPlayers;

const enterNumber = document.querySelector("#enter_number");
const enterName = document.querySelector("#enter_name");
const verses = document.querySelector("#vs");

enterName.style.display = "none";
verses.style.display = "none";

next.addEventListener("click", () => {
  numOfPlayers = parseInt(chooseNumber.value);

  if (numOfPlayers === 1) {
    playerTwoInput.remove();
    playerTwo = "Computer";
  }

  enterNumber.style.display = "none";
  enterName.style.display = "block";
});

readyToPlay.addEventListener("click", (e) => {
  e.preventDefault();
  playerOne = playerOneInput.value;

  if (numOfPlayers === 1) {
    verses.innerText = `${playerOne} vs. ${playerTwo}`;
  } else {
    playerTwo = playerTwoInput.value;
    verses.innerText = `${playerOne} vs. ${playerTwo}`;
  }

  enterName.style.display = "none";
  verses.style.display = "block";
  buildInitialState();
});

//--------------build Initial state--------------

let pipArray;
let currentPlayer;

function buildInitialState() {
  pipArray = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
  //index 6 and 13 are mancalas
  placePips();
  chooseBeginningPlayer();
  whoseTurn();
}

function chooseBeginningPlayer() {
  currentPlayer = Math.floor(Math.random() * 2) + 1;
  console.log(currentPlayer);
}

function placePips() {
  pipArray.forEach((numOfPips, index) => {
    const box = document.querySelector(`#box-${index}`);
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
  if (currentPlayer === 1) {
    displayTurn.innerText = `${playerOne}'s Turn`;
  } else {
    displayTurn.innerText = `${playerTwo}'s Turn`;
  }
}

//------------------Take a turn-----------------
const board = document.querySelector(".board");

board.addEventListener("click", (e) => {
  console.log(e.target.className);
  if (isYourPit(e)) {
    turn(e);
    placePips();
  }
});

function isYourPit(event) {
  if (event.target.classList.contains("mancala")) {
    alert("You can not choose a mancala.  Please choose a pit on your side");
    return false;
  }

  if (
    currentPlayer === 1 &&
    event.target.classList.contains("player_two_box")
  ) {
    alert("Choose a pit on your side.");
    return false;
  } else if (
    currentPlayer === 2 &&
    event.target.classList.contains("player_one_box")
  ) {
    alert("Choose a pit on your side.");
    return false;
  }

  return true;
}

function turn(event) {
  let target = event.target;
  let index = parseInt(target.id.replace(/\D/g, ""));

  let hand = pipArray[index];
  pipArray[index] = 0;
  console.log(index);
  for (let i = 1; i <= hand; i++) {
    let currentIndex = (index + i) % 14;
    pipArray[currentIndex]++;
  }

  changePlayer();

  console.log(pipArray);
}

function changePlayer() {
  if (currentPlayer === 1) {
    currentPlayer = 2;
  } else {
    currentPlayer = 1;
  }
  whoseTurn();
}

function extraTurn() {
  if (target.classList.contains("mancala")) {
    displayTurn.innerText = `${currentPlayer} gets another turn!`;
  } else {
    changePlayer();
  }
}
