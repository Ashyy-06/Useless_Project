// UI module: score, lives, and progress HUD
export class UI {
  constructor() {
    this.score = 0;
    this.lives = 3;

    this.scoreEl = document.getElementById('scoreValue');
    this.livesEl = document.getElementById('livesValue');
    this.progressFillEl = document.getElementById('progressFill');
    this.progressTextEl = document.getElementById('progressText');

    this.updateHud(this.score, this.lives);
    this.updateProgress(0, 96);
  }

  getLivesText(lives) {
    const heartCount = Math.max(0, lives);
    const hearts = Array.from({ length: heartCount }, () => '❤️').join(' ');
    return hearts ? `LIVES ${hearts}` : 'LIVES';
  }

  updateHud(score, lives) {
    this.score = score;
    this.lives = lives;

    if (this.scoreEl) this.scoreEl.textContent = `SCORE ${this.score}`;
    if (this.livesEl) this.livesEl.textContent = this.getLivesText(this.lives);
  }

  updateProgress(destroyed, total) {
    const safeTotal = Math.max(total, 1);
    const percentage = Math.round((destroyed / safeTotal) * 100);

    if (this.progressFillEl) this.progressFillEl.style.width = `${percentage}%`;
    if (this.progressTextEl) this.progressTextEl.textContent = `${percentage}%`;
  }
}
