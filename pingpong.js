const bgmusic=document.getElementById("bg-music");
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");


// Game settings
const paddleWidth = 16;
const paddleHeight = 100;
const ballRadius = 12;
const playerX = 30; // Left paddle x
const aiX = canvas.width - paddleWidth - 30; // Right paddle x

let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 3;

let playerScore = 0;
let aiScore = 0;

// Mouse control for left paddle
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;
  // Clamp paddle within canvas
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = "#fff";
  ctx.setLineDash([8, 16]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawScore() {
  ctx.font = "32px Arial";
  ctx.fillText(playerScore, canvas.width / 4, 50);
  ctx.fillText(aiScore, (canvas.width * 3) / 4, 50);
}

// Basic AI movement
function updateAI() {
  // Move AI paddle toward the ball with smoothing
  const paddleCenter = aiY + paddleHeight / 2;
  if (paddleCenter < ballY - 20) {
    aiY += 4;
  } else if (paddleCenter > ballY + 20) {
    aiY -= 4;
  }
  // Clamp AI paddle within canvas
  aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  // Randomize direction
  ballSpeedX = (Math.random() > 0.5 ? 4 : -4);
  ballSpeedY = (Math.random() > 0.5 ? 3 : -3);
}

function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Collide with top/bottom walls
  if (ballY - ballRadius < 0) {
    ballY = ballRadius;
    ballSpeedY = -ballSpeedY;
  } else if (ballY + ballRadius > canvas.height) {
    ballY = canvas.height - ballRadius;
    ballSpeedY = -ballSpeedY;
  }

  // Collide with player paddle
  if (
    ballX - ballRadius < playerX + paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballX = playerX + paddleWidth + ballRadius; // Prevent sticking
    ballSpeedX = -ballSpeedX;
    // Add some speed based on where it hit the paddle
    let hitPos = (ballY - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
    ballSpeedY += hitPos * 2;
  }

  // Collide with AI paddle
  if (
    ballX + ballRadius > aiX &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballX = aiX - ballRadius; // Prevent sticking
    ballSpeedX = -ballSpeedX;
    let hitPos = (ballY - (aiY + paddleHeight / 2)) / (paddleHeight / 2);
    ballSpeedY += hitPos * 2;
  }

  // Score for AI
  if (ballX - ballRadius < 0) {
    aiScore++;
    resetBall();
  }

  // Score for player
  if (ballX + ballRadius > canvas.width) {
    playerScore++;
    resetBall();
  }
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawNet();
  drawScore();

  // Draw paddles
  drawRect(playerX, playerY, paddleWidth, paddleHeight, "#fff");
  drawRect(aiX, aiY, paddleWidth, paddleHeight, "#fff");

  // Draw ball
  drawCircle(ballX, ballY, ballRadius, "#0ff");
}

function gameLoop() {
  updateBall();
  updateAI();
  draw();
  requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();