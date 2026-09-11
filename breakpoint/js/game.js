import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { BrickField } from './bricks.js';
import { handleWallCollision, handlePaddleCollision, handleBrickCollision } from './collision.js';
import { UI } from './ui.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const GAME = {
  screen: 'start', // start, playing, gameover, victory
  score: 0,
  lives: 3,
};

let paddle, ball, bricks, ui;

function init() {
  paddle = new Paddle(canvas.width, canvas.height);
  ball = new Ball(canvas.width, canvas.height);
  bricks = new BrickField(10, 5, canvas.width);
  ui = new UI(ctx, canvas);
  ui.setScore(GAME.score);
  ui.setLives(GAME.lives);

  window.addEventListener('keydown', onKeyDown);
}

function onKeyDown(e) {
  if (GAME.screen === 'start' && e.code === 'Space') {
    GAME.screen = 'playing';
  } else if ((GAME.screen === 'gameover' || GAME.screen === 'victory') && e.code === 'Space') {
    restartGame();
  }
}

function restartGame() {
  GAME.score = 0;
  GAME.lives = 3;
  ui.setScore(GAME.score);
  ui.setLives(GAME.lives);
  bricks = new BrickField(10, 5, canvas.width);
  paddle.reset();
  ball.reset();
  GAME.screen = 'start';
}

function update() {
  if (GAME.screen !== 'playing') return;

  paddle.update();
  ball.update();

  handleWallCollision(ball);
  handlePaddleCollision(ball, paddle);

  const points = handleBrickCollision(ball, bricks);
  if (points > 0) {
    GAME.score += points;
    ui.setScore(GAME.score);
  }

  // Ball fell below canvas
  if (ball.y - ball.radius > canvas.height) {
    GAME.lives -= 1;
    ui.setLives(GAME.lives);
    if (GAME.lives <= 0) {
      GAME.screen = 'gameover';
    } else {
      // reset ball and paddle
      paddle.reset();
      ball.reset();
      GAME.screen = 'start';
    }
  }

  // Win condition
  if (bricks.getAliveCount() === 0) {
    GAME.screen = 'victory';
  }
}

function render() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bricks
  bricks.draw(ctx);

  // Draw paddle and ball
  paddle.draw(ctx);
  ball.draw(ctx);

  // Draw UI screens
  if (GAME.screen === 'start') ui.drawStart();
  else if (GAME.screen === 'gameover') ui.drawGameOver();
  else if (GAME.screen === 'victory') ui.drawVictory();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

// initialize and start the render loop
init();
requestAnimationFrame(loop);
