let next = document.querySelector("#next");
let chooseNumber = document.querySelector("#choose_number");
let readyToPlay = document.querySelector("#ready_to_play");
let playerOneInput = document.querySelector("#player_one_input");
let playerTwoInput = document.querySelector("#player_two_input");
const verses = document.querySelector("#vs");

next.addEventListener("click", () => {
  let numOfPlayers = parseInt(chooseNumber.value);

  if (numOfPlayers === 1) {
    playerTwoInput.remove();
  }
});

readyToPlay.addEventListener("click", (e) => {
  e.preventDefault();
  let playerOne = playerOneInput.value;
  let playerTwo = playerTwoInput.value;

  verses.innerText = `${playerOne} VS. ${playerTwo}`;
});
