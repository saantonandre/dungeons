export class DisplayName {
    constructor(source) {

        this.source = source;
        this.x = 0;
        this.y = 0;
        this.w = 1;
        this.h = 1;
        this.prevRatio = 1;
        this.text = `lv ${this.source.stats.lv}`;
        this.color = '#f5ffe8';

        this.size = 5;
        this.align = 'center';
        this.baseline = 'middle';
        this.font = "Consolas, 'Courier New', monospace";
        this.source.hasDisplayName = true;

        this.text2 = `${this.source.name}`;
        this.color2 = "#ffae70"
        this.size2 = 6;
        this.y2 = this.source.y - this.h / 4.5;
        this.display = false;

    }
    canvasFont(ratio, size) {
        return `bold ${Math.round(size * ratio)}px ${this.font}`;
    }
    getInfo() {
        this.text = `lv ${this.source.stats.lv}`;
        this.text2 = `${this.source.name}`
    }
    compute(mouse) {
        if (this.source.Physics.pointRectCol(mouse, this.source, true)) {
            this.display = true;
            this.getInfo();
            this.x = this.source.x + this.source.w / 2;
            this.y = this.source.y - this.h / 2;
            this.y2 = this.source.y - this.h / 4.5;
        } else {
            this.display = false;
        }
    }
    render(context, tilesize, ratio, camera) {
        if (!this.display) {
            return;
        }
        context.globalAlpha = 0.6;
        context.textAlign = this.align;
        context.textBaseline = this.baseline;
        context.font = this.canvasFont(ratio, this.size);
        context.fillStyle = this.color;
        context.fillText(
            this.text,
            (this.x + camera.x) * tilesize * ratio,
            (this.y + camera.y) * tilesize * ratio
        );
        context.globalAlpha = 0.8;
        context.font = this.canvasFont(ratio, this.size2);
        context.fillStyle = this.color2;
        context.fillText(
            this.text2,
            (this.x + camera.x) * tilesize * ratio,
            (this.y2 + camera.y) * tilesize * ratio
        );

        context.globalAlpha = 1;
    }
}