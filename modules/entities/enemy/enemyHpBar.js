export class EnemyHpBar {
    constructor(source) {
        this.spriteX = [
            [13, 14, 15]
        ];
        this.spriteY = [
            [0, 0, 0]
        ];
        this.source = source;
        this.sheet = this.source.sheet;
        this.source.hasHpBar = true;
        this.w = 1;
        this.h = 1;
        this.wRatio = 1;
        this.prevRatio = 1;
    }
    compute(deltaTime) {
        this.x = this.source.x + this.source.w / 2 - this.w / 2;
        this.y = this.source.y - this.h / 2;
        this.wRatio = this.source.stats.hp / this.source.stats.maxHp;
        if (this.wRatio < 0) { this.wRatio = 0; }
        if (this.wRatio > 1) { this.wRatio = 1; }
        if (this.prevRatio > this.wRatio) {
            this.prevRatio -= deltaTime / 50;
        }
        if (this.prevRatio < this.wRatio) {
            this.prevRatio = this.wRatio;
        }
    }
    render(context, tilesize, ratio, camera) {
        // Renders the damaged bar
        context.drawImage(
            this.sheet,
            this.spriteX[0][2] * tilesize,
            this.spriteY[0][2] * tilesize,
            this.w * tilesize * this.prevRatio,
            this.h * tilesize,
            (this.source.x + camera.x) * tilesize * ratio,
            (this.source.y - this.h / 2 + camera.y) * tilesize * ratio,
            this.w * tilesize * ratio * this.prevRatio,
            this.h * tilesize * ratio
        );

        // Renders the bar
        context.drawImage(
            this.sheet,
            this.spriteX[0][1] * tilesize,
            this.spriteY[0][1] * tilesize,
            this.w * tilesize * this.wRatio,
            this.h * tilesize,
            (this.x + camera.x) * tilesize * ratio,
            (this.y + camera.y) * tilesize * ratio,
            this.w * tilesize * ratio * this.wRatio,
            this.h * tilesize * ratio
        );

        // Renders the contour
        context.drawImage(
            this.sheet,
            this.spriteX[0][0] * tilesize,
            this.spriteY[0][0] * tilesize,
            this.w * tilesize,
            this.h * tilesize,
            (this.x + camera.x) * tilesize * ratio,
            (this.y + camera.y) * tilesize * ratio,
            this.w * tilesize * ratio,
            this.h * tilesize * ratio
        );
    }
}