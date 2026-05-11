const pads = document.querySelectorAll(".pad");

const startBtn =
document.getElementById("startBtn");

const restartBtn =
document.getElementById("restartBtn");

const difficultySelect =
document.getElementById("difficulty");

const roundText =
document.getElementById("round");

const recordText =
document.getElementById("record");

const comboText =
document.getElementById("combo");

const message =
document.getElementById("message");

const gameOver =
document.getElementById("gameOver");

const finalText =
document.getElementById("finalText");

const lights =
document.querySelectorAll(".light");

const colors = [
  "green",
  "red",
  "yellow",
  "blue"
];

const difficulties = {

  easy: {
    speed: 900,
    flash: 450
  },

  medium: {
    speed: 700,
    flash: 350
  },

  hard: {
    speed: 500,
    flash: 250
  },

  impossible: {
    speed: 300,
    flash: 170
  }

};

let currentDifficulty = "medium";

let sequence = [];

let playerSequence = [];

let round = 0;

let combo = 0;

let canPlay = false;

let gameStarted = false;

let record =
localStorage.getItem("neonGeniusRecord") || 0;

recordText.textContent = record;

const sounds = {

  green:
  document.getElementById("greenSound"),

  red:
  document.getElementById("redSound"),

  yellow:
  document.getElementById("yellowSound"),

  blue:
  document.getElementById("blueSound")

};

difficultySelect.addEventListener(
  "change",
  () => {

    currentDifficulty =
    difficultySelect.value;

  }
);

startBtn.addEventListener("click", () => {

  if(gameStarted) return;

  startGame();

});

restartBtn.addEventListener(
  "click",
  restartGame
);

pads.forEach(pad => {

  pad.addEventListener("click", () => {

    if(!canPlay) return;

    const color =
    pad.dataset.color;

    playerSequence.push(color);

    flash(color);

    playSound(color);

    checkMove();

  });

});

function startGame(){

  gameStarted = true;

  round = 0;

  combo = 0;

  sequence = [];

  playerSequence = [];

  updateUI();

  gameOver.classList.add("hidden");

  startBtn.disabled = true;

  difficultySelect.disabled = true;

  message.textContent =
  "Prepare-se...";

  setTimeout(() => {

    nextRound();

  }, 1200);

}

function restartGame(){

  gameStarted = false;

  startBtn.disabled = false;

  difficultySelect.disabled = false;

  startGame();

}

function nextRound(){

  canPlay = false;

  playerSequence = [];

  round++;

  combo++;

  updateUI();

  randomLight();

  const randomColor =
  colors[
    Math.floor(
      Math.random() * colors.length
    )
  ];

  sequence.push(randomColor);

  message.textContent =
  "Observe a sequência";

  setTimeout(() => {

    showSequence();

  }, 700);

}

function showSequence(){

  let delay = 0;

  const speed =
  difficulties[currentDifficulty].speed;

  sequence.forEach(color => {

    setTimeout(() => {

      flash(color);

      playSound(color);

    }, delay);

    delay += speed;

  });

  setTimeout(() => {

    canPlay = true;

    message.textContent =
    "Sua vez";

  }, delay);

}

function flash(color){

  const pad =
  document.querySelector(`.${color}`);

  pad.classList.add("active");

  setTimeout(() => {

    pad.classList.remove("active");

  },
  difficulties[currentDifficulty].flash);

}

function playSound(color){

  const sound = sounds[color];

  sound.currentTime = 0;

  sound.play();

}

function checkMove(){

  const currentIndex =
  playerSequence.length - 1;

  if(
    playerSequence[currentIndex]
    !== sequence[currentIndex]
  ){

    loseGame();

    return;

  }

  if(
    playerSequence.length
    === sequence.length
  ){

    canPlay = false;

    message.textContent =
    "Sequência correta";

    setTimeout(() => {

      nextRound();

    }, 1200);

  }

}

function loseGame(){

  canPlay = false;

  gameStarted = false;

  startBtn.disabled = false;

  difficultySelect.disabled = false;

  combo = 0;

  updateUI();

  message.textContent =
  "Você perdeu";

  document.body.classList.add("shake");

  setTimeout(() => {

    document.body.classList.remove("shake");

  }, 500);

  if(round > record){

    record = round;

    localStorage.setItem(
      "neonGeniusRecord",
      record
    );

    recordText.textContent = record;

  }

  finalText.textContent =
  `Você chegou até a rodada ${round}`;

  gameOver.classList.remove("hidden");

}

function updateUI(){

  roundText.textContent = round;

  comboText.textContent =
  `x${combo}`;

}

function randomLight(){

  lights.forEach(light => {

    light.classList.remove("active");

  });

  const random =
  Math.floor(
    Math.random() * lights.length
  );

  lights[random]
  .classList.add("active");

}

document.addEventListener(
  "keydown",
  event => {

    if(!canPlay) return;

    const keyMap = {

      q:"green",
      w:"red",
      a:"yellow",
      s:"blue"

    };

    const color =
    keyMap[event.key.toLowerCase()];

    if(color){

      const pad =
      document.querySelector(
        `[data-color="${color}"]`
      );

      pad.click();

    }

  }
);