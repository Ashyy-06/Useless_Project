// Bricks module: generate bricks grid, render, and removal
export class Brick {
  constructor(x, y, width, height, points = 10) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.alive = true;
    this.points = points;
  }

  draw(ctx) {
    if (!this.alive) return;
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

export class BrickField {
  constructor(cols = 10, rows = 5, canvasWidth = 800) {
    this.cols = cols;
    this.rows = rows;
    this.canvasWidth = canvasWidth;
    this.bricks = [];
    this.padding = 8;
    this.offsetTop = 60;
    this.offsetLeft = 40;
    this._generate();
  }

  _generate() {
    this.bricks = [];
    const totalPaddingX = this.padding * (this.cols - 1);
    const availableWidth = this.canvasWidth - this.offsetLeft * 2 - totalPaddingX;
    const brickWidth = Math.floor(availableWidth / this.cols);
    const brickHeight = 20;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.offsetLeft + c * (brickWidth + this.padding);
        const y = this.offsetTop + r * (brickHeight + this.padding);
        this.bricks.push(new Brick(x, y, brickWidth, brickHeight, 10));
      }
    }
  }

  draw(ctx) {
    this.bricks.forEach((b) => b.draw(ctx));
  }

  getAliveCount() {
    return this.bricks.filter((b) => b.alive).length;
  }
}
