// js/bricks.js
// Generates a grid of bricks with colorful rows.

export class Bricks {
  constructor(canvasWidth, canvasHeight) {
    this.rows = 8; // increased from 5
    this.cols = 12; // increased from 10
    this.padding = 4; // space between bricks
    this.offsetTop = 60;
    this.offsetLeft = 30;
    this.brickWidth = Math.floor((canvasWidth - this.offsetLeft * 2 - (this.cols - 1) * this.padding) / this.cols);
    this.brickHeight = 20;
    this.colors = [
      '#ff5555', // red
      '#ff7f00', // orange
      '#ffff55', // yellow
      '#7fff00', // green
      '#55ffff', // cyan
      '#5555ff', // blue
      '#7f00ff', // purple
      '#ff55ff', // pink
    ];
    this.grid = [];
    this.totalBricks = this.rows * this.cols;
    this.destroyedBricks = 0;
    this.createGrid();
  }

  createGrid() {
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      const color = this.colors[r % this.colors.length];
      for (let c = 0; c < this.cols; c++) {
        const brick = {
          x: this.offsetLeft + c * (this.brickWidth + this.padding),
          y: this.offsetTop + r * (this.brickHeight + this.padding),
          width: this.brickWidth,
          height: this.brickHeight,
          broken: false,
          color: color,
        };
        row.push(brick);
      }
      this.grid.push(row);
    }
  }

  reset() {
    this.grid = [];
    this.destroyedBricks = 0;
    this.createGrid();
  }

  draw(ctx) {
    ctx.save();
    for (const row of this.grid) {
      for (const brick of row) {
        if (!brick.broken) {
          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          // subtle border/shadow for depth
          ctx.strokeStyle = '#00000020';
          ctx.lineWidth = 1;
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
      }
    }
    ctx.restore();
  }

  // Returns the first brick that collides with the given rect, or null.
  checkCollision(rect) {
    for (const row of this.grid) {
      for (const brick of row) {
        if (brick.broken) continue;
        if (
          rect.x < brick.x + brick.width &&
          rect.x + rect.width > brick.x &&
          rect.y < brick.y + brick.height &&
          rect.y + rect.height > brick.y
        ) {
          return brick;
        }
      }
    }
    return null;
  }

  // Marks a brick as broken.
  breakBrick(brick) {
    if (!brick || brick.broken) return false;
    brick.broken = true;
    this.destroyedBricks += 1;
    return true;
  }

  getDestroyedCount() {
    return this.destroyedBricks;
  }

  // Check if all bricks are broken.
  isCleared() {
    return this.destroyedBricks >= this.totalBricks;
  }
}
