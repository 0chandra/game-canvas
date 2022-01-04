const canvas = document.getElementById("gameCanvas");
console.log(canvas);

const ctx = canvas.getContext("2d");

const height = canvas.height;
const width = canvas.width;

let ballX = 50;
let ballY = 200;
const dx = 5;
const dy = 4;

drawBall();

window.addEventListener("keydown", onKeyDownFunction);

function onKeyDownFunction(e) {
  //   console.log(e);
  if (e.key == "Right" || e.key == "ArrowRight") {
    ballX += dx;
    drawBall();
  }
  if (e.key == "Left" || e.key == "ArrowLeft") {
    ballX -= dx;
    drawBall();
  }
  if (e.key == "Up" || e.key == "ArrowUp") {
    jump();
  }
}

function drawBall() {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.arc(ballX, ballY, 20, 0, Math.PI * 2, true);
  ctx.fillStyle = "red";
  ctx.fill();
}

function jump() {
  let jumpHeight = 120;
  let jumpDown = false;
  const originalY = ballY;

  const jumpInterval = setInterval(() => {
    if (!jumpHeight) {
      if (jumpDown) {
        clearInterval(jumpInterval);
      }
      jumpDown = !jumpDown;
      jumpHeight = 120;
      console.log(jumpDown);
    } else if (jumpDown) {
      ballY += dy;
      jumpHeight -= dy;
      drawBall();
      console.log("gdsgsd");
    } else if (!jumpDown) {
      ballY -= dy;
      jumpHeight -= dy;
      drawBall();
      //   console.log(jumpHeight);
    }
  }, 10);
}
