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
  //pipArray = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0];
  pipArray = [0, 0, 0, 0, 2, 1, 4, 0, 0, 0, 0, 0, 1, 6];
  //index 6 and 13 are mancalas

  placePips();
  chooseBeginningPlayer();
  whoseTurn();
}

function chooseBeginningPlayer() {
  currentPlayer = Math.floor(Math.random() * 2) + 1;
}

function placePips() {
  pipArray.forEach((numOfPips, index) => {
    //const box = document.querySelector(`#box-${index}`);
    const box = document.querySelector(`[data-index="${index}"]`);
    box.innerHTML = index; //change back to empty string after done testing

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

  //let index = parseInt(event.target.id.replace(/\D/g, ""));
  let index = parseInt(event.target.dataset.index);

  if (pipArray[index] === 0) {
    alert("This pit is empty.  Please choose another.");
    return false;
  }

  return true;
}

function turn(event) {
  //let index = parseInt(event.target.id.replace(/\D/g, ""));
  let index = parseInt(event.target.dataset.index);

  let hand = pipArray[index];
  pipArray[index] = 0;

  let currentIndex;
  for (let i = 1; i <= hand; i++) {
    currentIndex = (index + i) % 14;

    if (currentPlayer === 1 && currentIndex === 13) {
      continue;
    } else if (currentPlayer === 2 && currentIndex === 6) {
      continue;
    }
    pipArray[currentIndex]++;
  }
  //should i put this in an overall game object...what should i include?
  const opposites = {
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
  };

  let oppositeIndex = opposites[currentIndex];
  const box = document.querySelector(`[data-index="${currentIndex}"]`);

  //can I place this in a seperate function? maybe the section that's in the if block
  if (
    pipArray[currentIndex] === 1 &&
    box.classList.contains("player_one_box") &&
    currentPlayer === 1
  ) {
    let stealNumber = pipArray[oppositeIndex];
    pipArray[oppositeIndex] = 0;
    pipArray[6] += stealNumber;
  }

  if (
    pipArray[currentIndex] === 1 &&
    box.classList.contains("player_two_box") &&
    currentPlayer === 2
  ) {
    let stealNumber = pipArray[oppositeIndex];
    pipArray[oppositeIndex] = 0;
    pipArray[13] += stealNumber;
  }

  placePips();

  if (isSideEmpty()) {
    gameOver();
    placePips(); //why are the pips moving on the website after the whoWins alert?
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
  if (currentPlayer === 1) {
    currentPlayer = 2;
  } else {
    currentPlayer = 1;
  }
  whoseTurn();
}

//function to steal pips? take code from turn...
//function to check if one side of pits is empty--should check this every turn

function isSideEmpty() {
  //i need to check index 0-5 and index 7-12 in the pip array
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < 6; i++) {
    sum1 += pipArray[i];
  }

  for (let i = 7; i < 13; i++) {
    sum2 += pipArray[i];
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

  for (let i = 0; i < pipArray.length; i++) {
    if (i < 7) {
      sum1 += pipArray[i];
      pipArray[i] = 0;
    } else {
      sum2 += pipArray[i];
      pipArray[i] = 0;
    }
  }

  pipArray[6] = sum1;
  pipArray[13] = sum2;
}
//function to see who is the winner
let winner;
function whoWins() {
  if (pipArray[6] === pipArray[13]) {
    alert("It's a tie!");
    return;
  } else if (pipArray[6] > pipArray[13]) {
    winner = playerOne;
  } else {
    winner = playerTwo;
  }

  alert(winner + " wins!");
}
