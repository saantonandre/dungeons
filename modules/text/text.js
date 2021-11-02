export class Text {
    constructor(x, y, color = '#ad2f45', align = "center", baseline = "middle") {
        this.content = '';
        this.x = x;
        this.y = y;
        this.color = color;
        this.align = align;
        this.baseline = baseline;
        this.fontSize = 7;
        this.font = 'Consolas, monaco, monospace';
        this.shadow = false;
        this.shadowColor = '#14182e';
        this.strokeWidth = 0.3;

    }
    get shadowOffsetX() {
        return this.fontSize / 200;
    }
    get shadowOffsetY() {
        return this.fontSize / 200;
    }
    canvasFont(ratio) {
        return 'bold ' + Math.round(this.fontSize * ratio) + 'px ' + this.font
    }
    render(context, tilesize, ratio, camera = { x: 0, y: 0 }) {
        if (this.stroke) {
            context.lineWidth = this.strokeWidth * ratio;
            context.strokeStyle = this.strokeColor;
        }
        context.textBaseline = this.baseline;
        context.textAlign = this.align;
        context.fillStyle = this.color;
        context.font = this.canvasFont(ratio);
        if (typeof this.content !== "string") {
            // Content is split into an array of lines
            for (let i = 0; i < this.content.length; i++) {
                if (this.stroke) {
                    context.strokeText(
                        this.content[i],
                        (this.x + camera.x) * tilesize * ratio,
                        ((this.y + camera.y) * tilesize + this.fontSize * i) * ratio
                    );
                }
                if (this.shadow) {
                    context.fillStyle = this.shadowColor;
                    context.fillText(
                        this.content[i],
                        (this.x + camera.x + this.shadowOffsetX) * tilesize * ratio,
                        ((this.y + camera.y + this.shadowOffsetY) * tilesize + this.fontSize * i) * ratio
                    );
                }
                context.fillStyle = this.color;
                context.fillText(
                    this.content[i],
                    (this.x + camera.x) * tilesize * ratio,
                    ((this.y + camera.y) * tilesize + this.fontSize * i) * ratio
                );
            }

        } else {
            /** Stroke rendering */
            if (this.stroke) {
                context.strokeText(
                    this.content,
                    (this.x + camera.x) * tilesize * ratio,
                    (this.y + camera.y) * tilesize * ratio
                );
            }
            /** Shadow rendering */
            if (this.shadow) {
                context.fillStyle = this.shadowColor;
                context.fillText(
                    this.content,
                    (this.x + camera.x + this.shadowOffsetX) * tilesize * ratio,
                    (this.y + camera.y + this.shadowOffsetY) * tilesize * ratio
                );
            }
            /** Fill rendering */
            context.fillStyle = this.color;
            context.fillText(
                this.content,
                (this.x + camera.x) * tilesize * ratio,
                (this.y + camera.y) * tilesize * ratio
            )
        }
    }
}