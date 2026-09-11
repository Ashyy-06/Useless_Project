import { Paddle } from './paddle.js';

export class Ball {
  constructor(canvasWidth, canvasHeight) {
    this.radius = 8;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.speed = 300;
    this.isLaunched = false;
    this.reset();
  }

  reset(paddle = null) {
    this.isLaunched = false;
    this.vx = 0;
    this.vy = 0;

    if (paddle) {
      this.x = paddle.x + paddle.width / 2;
      this.y = paddle.y - this.radius - 2;
    } else {
      this.x = this.canvasWidth / 2;
      this.y = this.canvasHeight / 2;
    }
  }

  launch() {
    if (this.isLaunched) return;

    this.isLaunched = true;
    const launchAngle = -Math.PI / 3 + (Math.random() * Math.PI / 3);
    this.vx = this.speed * Math.cos(launchAngle);
    this.vy = this.speed * Math.sin(launchAngle);
  }

  update(delta, paddle = null) {
    if (!this.isLaunched) {
      if (paddle) {
        this.x = paddle.x + paddle.width / 2;
        this.y = paddle.y - this.radius - 2;
      }
      return;
    }

    this.x += this.vx * delta;
    this.y += this.vy * delta;
  }

  draw(ctx) {
    ctx.fillStyle = '#ff5555';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  getRect() {
    return { x: this.x - this.radius, y: this.y - this.radius, width: this.radius * 2, height: this.radius * 2 };
  }
}
