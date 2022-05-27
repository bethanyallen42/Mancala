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
let currentPlayer;
next.addEventListener("click", () => {
  numOfPlayers = parseInt(chooseNumber.value);

  if (numOfPlayers === 1) {
    playerTwoInput.remove();
  }

  enterNumber.style.display = "none";
  enterName.style.display = "block";
});

readyToPlay.addEventListener("click", (e) => {
  e.preventDefault();
  playerOne = playerOneInput.value;
  playerTwo = playerTwoInput.value;

  if (numOfPlayers === 1) {
    verses.innerText = `${playerOne} vs. Computer`;
  } else {
    verses.innerText = `${playerOne} vs. ${playerTwo}`;
  }

  enterName.style.display = "none";
  verses.style.display = "block";
  chooseStartingPlayer();
});
//--------------

const board = {
  playerOneBoxes: [0, 4, 4, 4, 4, 4, 4],
  playerTwoBoxes: [4, 4, 4, 4, 4, 4, 0],
};
const boxesOne = document.querySelectorAll(".box1");
const boxesTwo = document.querySelectorAll(".box2");
//let currentPlayer;
function buildInitialState() {
  boxesOne.forEach((box, index) => {
    let pipArray = board.playerOneBoxes;
    let numOfPips = pipArray[index];

    for (let i = 0; i < numOfPips; i++) {
      let pip = document.createElement("div");
      pip.className = "pip";
      box.appendChild(pip);
    }
  });

  boxesTwo.forEach((box, index) => {
    box.innerText = index;
  });
}

buildInitialState();
