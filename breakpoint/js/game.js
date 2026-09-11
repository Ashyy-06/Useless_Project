// js/game.js
// Main game loop and initialization for BreakPoint.

import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { Bricks } from './bricks.js';
import { UI } from './ui.js';

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const ui = new UI();
const paddle = new Paddle(canvasWidth, canvasHeight);
const ball = new Ball(canvasWidth, canvasHeight);
const bricks = new Bricks(canvasWidth, canvasHeight);

let input = { left: false, right: false };
let lastTime = 0;
let running = false;
let score = 0;
let lives = 3;

// Input handling
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') input.left = true;
  if (e.key === 'ArrowRight') input.right = true;
  if (e.code === 'Space' && running && !ball.isLaunched) {
    e.preventDefault();
    ball.launch();
  }
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') input.left = false;
  if (e.key === 'ArrowRight') input.right = false;
});

// Start button / overlay handling
const startOverlay = document.getElementById('startOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', startGame);

function showOverlay(title, message) {
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  startOverlay.style.display = 'flex';
}

function resetGameState() {
  score = 0;
  lives = 3;
  bricks.reset();
  ball.reset(paddle);
  ui.updateHud(score, lives);
  ui.updateProgress(bricks.getDestroyedCount(), bricks.totalBricks);
}

function startGame() {
  if (running) return; // already started
  resetGameState();
  startOverlay.style.display = 'none';
  running = true;
  requestAnimationFrame(gameLoop);
}

function loseLife() {
  lives -= 1;
  ui.updateHud(score, lives);

  if (lives <= 0) {
    running = false;
    ball.reset(paddle);
    showOverlay('GAME OVER', 'Press Start Game to try again.');
    return;
  }

  ball.reset(paddle);
}

function gameLoop(timestamp) {
  const delta = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;

  if (!running) return;

  // Update entities
  paddle.update(delta, input);
  ball.update(delta, paddle);

  // Wall collisions
  if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvasWidth) {
    ball.vx *= -1;
    ball.x = Math.max(ball.radius, Math.min(canvasWidth - ball.radius, ball.x));
  }
  if (ball.y - ball.radius <= 0) {
    ball.vy *= -1;
    ball.y = ball.radius;
  }

  // Bottom (lose condition)
  if (ball.y - ball.radius > canvasHeight) {
    loseLife();
    if (running) {
      requestAnimationFrame(gameLoop);
    }
    return;
  }

  // Paddle collision
  const paddleRect = paddle.getRect();
  if (
    ball.x + ball.radius > paddleRect.x &&
    ball.x - ball.radius < paddleRect.x + paddleRect.width &&
    ball.y + ball.radius > paddleRect.y &&
    ball.y - ball.radius < paddleRect.y + paddleRect.height
  ) {
    const hitPos = (ball.x - paddleRect.x) / paddleRect.width - 0.5;
    const angle = hitPos * Math.PI / 3;
    const speed = Math.hypot(ball.vx, ball.vy);
    ball.vx = speed * Math.sin(angle);
    ball.vy = -Math.abs(speed * Math.cos(angle));
    ball.y = paddleRect.y - ball.radius - 1;
  }

  // Brick collision
  const ballRect = ball.getRect();
  const hitBrick = bricks.checkCollision(ballRect);
  if (hitBrick) {
    const brickDestroyed = bricks.breakBrick(hitBrick);
    if (brickDestroyed) {
      score += 10;
      ui.updateHud(score, lives);
      ui.updateProgress(bricks.getDestroyedCount(), bricks.totalBricks);
    }
    ball.vy *= -1;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw entities
  bricks.draw(ctx);
  paddle.draw(ctx);
  ball.draw(ctx);

  // Win condition
  if (bricks.isCleared()) {
    running = false;
    showOverlay('YOU WIN!', 'Congratulations! Press Start Game to play again.');
    return;
  }

  // Continue loop
  requestAnimationFrame(gameLoop);
}

// Expose for debugging (optional)
window.breakpoint = { paddle, ball, bricks, startGame, ui, getScore: () => score, getLives: () => lives };
