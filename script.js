const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const bird = document.getElementById("bird");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

let isJumping = false;
let isDucking = false;
let currentScore = 0;
let highScore = 0;
let gameOver = false;
let scoreInterval;
let collisionInterval;
let obstacleTimer;
let birdFlapInterval;

function startGame() {
  currentScore = 0;
  gameOver = false;
  dino.style.bottom = "0px";
  dino.classList.remove("ducking", "jumping");
  dino.classList.add("running");

  restartBtn.style.display = "none";
  scoreDisplay.innerText = `Score: ${currentScore} | High Score: ${highScore}`;
  isJumping = false;
  isDucking = false;

  showRandomObstacle();

  scoreInterval = setInterval(() => {
    if (!gameOver) {
      currentScore++;
      if (currentScore > highScore) highScore = currentScore;
      scoreDisplay.innerText = `Score: ${currentScore} | High Score: ${highScore}`;
    }
  }, 100);

  collisionInterval = setInterval(checkCollision, 10);
}

function showRandomObstacle() {
  clearTimeout(obstacleTimer);
  cactus.style.animation = "none";
  bird.style.animation = "none";
  cactus.style.right = "-20px";
  bird.style.right = "-46px";
  clearInterval(birdFlapInterval);

  const nextSwitchDelay = 2000 + Math.random() * 2000;

  if (Math.random() < 0.5) {
    cactus.style.animation = "moveCactus 2s linear forwards";
    bird.style.display = "none";
  } else {
    bird.style.display = "block";
    bird.style.animation = "moveBird 3s linear forwards";
    let flapState = false;
    birdFlapInterval = setInterval(() => {
      bird.style.backgroundPosition = flapState ? "0 0" : "-46px 0";
      flapState = !flapState;
    }, 200);
  }

  obstacleTimer = setTimeout(() => {
    if (!gameOver) showRandomObstacle();
  }, nextSwitchDelay);
}

function endGame() {
  gameOver = true;
  clearInterval(scoreInterval);
  clearInterval(collisionInterval);
  clearTimeout(obstacleTimer);
  clearInterval(birdFlapInterval);

  cactus.style.animation = "none";
  bird.style.animation = "none";
  bird.style.display = "none";

  restartBtn.style.display = "block";
  alert(`Game Over!\nFinal Score: ${currentScore}\nHigh Score: ${highScore}`);
}

function jump() {
  if (isJumping || isDucking || gameOver) return;
  isJumping = true;
  dino.classList.remove("running", "ducking");
  dino.classList.add("jumping");
  let position = 0;
  dino.style.bottom = position + "px";

  const upInterval = setInterval(() => {
    if (position >= 100) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
          dino.classList.remove("jumping");
          dino.classList.add("running");
          dino.style.bottom = "0px";
        } else {
          position -= 5;
          dino.style.bottom = position + "px";
        }
      }, 20);
    } else {
      position += 5;
      dino.style.bottom = position + "px";
    }
  }, 20);
}

function duck() {
  if (isJumping || gameOver || isDucking) return;
  isDucking = true;
  dino.classList.remove("running", "jumping");
  dino.classList.add("ducking");
  dino.style.bottom = "0px";
}

function unduck() {
  if (gameOver || !isDucking) return;
  isDucking = false;
  dino.classList.remove("ducking");
  dino.classList.add("running");
  dino.style.bottom = "0px";
}

function checkCollision() {
  const dinoRect = dino.getBoundingClientRect();
  const cactusRect = cactus.getBoundingClientRect();
  const birdRect = bird.getBoundingClientRect();

  const cactusVisible = cactus.style.animation !== "none";

  if (
    cactusVisible &&
    dinoRect.right > cactusRect.left + 5 &&
    dinoRect.left < cactusRect.right - 5 &&
    dinoRect.bottom > cactusRect.top + 5
  ) {
    endGame();
  }

  const birdVisible = bird.style.display !== "none";

  if (birdVisible) {
    const horizontalCollision =
      dinoRect.right > birdRect.left + 5 && dinoRect.left < birdRect.right - 5;
    const verticalCollision =
      dinoRect.top < birdRect.bottom - 5 && dinoRect.bottom > birdRect.top + 5;

    if (horizontalCollision && verticalCollision && !isDucking) {
      endGame();
    }
  }
}

// Controls with preventDefault to avoid scrolling
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "Space") {
    e.preventDefault();
  }

  if (key === "w" || e.code === "ArrowUp" || e.code === "Space") jump();
  if (key === "s" || e.code === "ArrowDown") duck();
});

document.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key === "s" || e.code === "ArrowDown") unduck();
});

restartBtn.addEventListener("click", startGame);

startGame();

