import words from "./data.js";
import alphabet from "./alphabet.js";

const body = document.querySelector("body");
const title = document.querySelector(".title");
const header = document.querySelector("header");
const gameArea = document.querySelector(".game-section");
const letterArea = document.querySelector(".letters");
const secretWordUI = document.querySelector(".secret-word");
const hangmanImg = document.querySelector(".hangman-image");
const endScreenContainerHTML = document.createElement("div");
const messageHTML = document.createElement("h1");
const answerHTML = document.createElement("p");
const newGameBtnHTML = document.createElement("button");
const resultSectionHTML = document.createElement("div");

endScreenContainerHTML.classList.add("end-screen");
newGameBtnHTML.classList.add("btn-newgame");
answerHTML.classList.add("answer");
messageHTML.style.fontSize = "60px";
messageHTML.style.color = "#f8f7ff";
newGameBtnHTML.innerText = "Start a New Game!";
resultSectionHTML.classList.add("result-area");

body.append(endScreenContainerHTML);
body.append(resultSectionHTML);
endScreenContainerHTML.append(messageHTML);
endScreenContainerHTML.append(answerHTML);
endScreenContainerHTML.append(newGameBtnHTML);

newGameBtnHTML.addEventListener("click", (e) => {
  newGame();
});

let letterHolders = document.querySelectorAll(".letter-holder");
let mistake = 0;
let secretWord = "";
const images = [];
let resultContainer = [];

//FUNCTIONS
function generateRandomNumber(array) {
  return Math.floor(Math.random() * array.length);
}

function imagesIntoArray() {
  for (let i = 0; i < 10; i++) {
    const imageUrl = `./assets/${i}.png`;
    images.push(imageUrl);
  }
}

function updateImg() {
  hangmanImg.setAttribute("src", images[mistake]);
}

function newGame() {
  updateResult();
  storeResultsInLocalStorage();
  gameArea.style.display = "flex";
  header.style.display = "flex";
  endScreenContainerHTML.style.display = "none";
  secretWord = words[generateRandomNumber(words)];
  secretWordUI.textContent = "";
  secretWordUI.classList.add("answer");

  for (let i = 0; i < secretWord.length - 1; i++) {
    secretWordUI.textContent += "_ ";
  }

  secretWordUI.textContent += "_";

  mistake = 0;
  updateImg();
  letterArea.innerHTML = "";

  alphabet.forEach((element) => {
    const letterHolder = document.createElement("div");
    const letter = document.createElement("span");
    letter.textContent = element;
    letterHolder.classList.add("letter-holder");
    letter.classList.add("letter");

    letterHolder.addEventListener("click", (e) => {
      if (secretWord.includes(letter.textContent)) {
        letterHolder.style.backgroundColor = "#586a8a";
        letterHolder.classList.add("clicked");
        for (let i = 0; i < secretWord.length; i++) {
          if (String(secretWord[i]) === String(letter.textContent)) {
            let secretWordArray = secretWordUI.textContent.split("");
            secretWordArray[i * 2] = letter.textContent;
            if (!i === secretWordArray.length - 1) {
              secretWordArray[i + 2] = " ";
            }
            secretWordUI.textContent = secretWordArray.join("");
            if (!secretWordArray.includes("_")) {
              addResult("WIN");
              winnerScreen();
            }
          }
        }
      } else {
        letterHolder.style.backgroundColor = "#db4444";
        if (!letterHolder.classList.contains("clicked")) {
          if (mistake < 9) {
            mistake++;
          } else {
            addResult("LOSE");
            loserScreen();
          }
          updateImg();
        }
        letterHolder.classList.add("clicked");
      }
    });

    letterHolder.append(letter);
    letterArea.append(letterHolder);

    letterHolders = document.querySelectorAll(".letter-holder");
    letterHolders.forEach((element) => {
      element.style.backgroundColor = "var(--primary-color)";
      element.classList.remove("clicked");
    });
  });
}

function winnerScreen() {
  updateResult();
  storeResultsInLocalStorage();
  gameArea.style.display = "none";
  header.style.display = "none";
  endScreenContainerHTML.style.display = "flex";
  messageHTML.innerText = "Congratulations, you won!🎉";
  answerHTML.textContent = `The guessed word was ${secretWord}`;
}

function loserScreen() {
  updateResult();
  storeResultsInLocalStorage();
  gameArea.style.display = "none";
  header.style.display = "none";
  endScreenContainerHTML.style.display = "flex";
  messageHTML.innerText = "You lost!😭 Try again!";
  answerHTML.textContent = `The guessed word was ${secretWord}`;
}

function addResult(text) {
  const result = {};
  result.text = text;
  result.time = new Date(Date.now()).toLocaleDateString();
  resultContainer.push(result);
}

function updateResult() {
  resultSectionHTML.innerHTML = "";
  const resultTitleHTML = document.createElement("h2");
  resultTitleHTML.textContent = "RESULTS:";
  resultSectionHTML.append(resultTitleHTML);

  resultContainer.forEach((item) => {
    const resultDivHTML = document.createElement("div");
    const resultTextHTML = document.createElement("span");
    const resultTimeHTML = document.createElement("span");

    resultTextHTML.textContent = item.text;
    resultTimeHTML.textContent = item.time;

    resultTextHTML.classList.add("result-text");
    resultTimeHTML.classList.add("result-text");

    resultSectionHTML.append(resultDivHTML);
    resultDivHTML.append(resultTextHTML);
    resultDivHTML.append(resultTimeHTML);
  });
}

function storeResultsInLocalStorage() {
  localStorage.setItem("results", JSON.stringify(resultContainer));
}

function getResultsFromLocalStorage() {
  if (localStorage.getItem("results") === null) {
    resultContainer = [];
  } else {
    resultContainer = JSON.parse(localStorage.getItem("results"));
    updateResult();
  }
}

imagesIntoArray();
getResultsFromLocalStorage();
newGame();
