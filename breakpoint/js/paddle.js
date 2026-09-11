export class Paddle {
  constructor(canvasWidth, canvasHeight) {
    this.width = 100;
    this.height = 20;
    this.x = (canvasWidth - this.width) / 2;
    this.y = canvasHeight - this.height - 10;
    this.speed = 400; // pixels per second
    this.canvasWidth = canvasWidth;
  }

  update(delta, input) {
    if (input.left) this.x -= this.speed * delta;
    if (input.right) this.x += this.speed * delta;
    // clamp
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > this.canvasWidth) this.x = this.canvasWidth - this.width;
  }

  draw(ctx) {
    ctx.fillStyle = '#00ff99';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  getRect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
