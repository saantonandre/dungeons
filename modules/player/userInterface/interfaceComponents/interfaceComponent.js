import { spritesheet } from "../../../resourceManager.js";
export class InterfaceComponent {
    constructor(source, x, y) {
        this.source = source;
        this.sheet = spritesheet;
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;

        this.progressText = {
            content: '',
            x: this.x,
            y: this.y,
            align: 'center',
            baseline: 'middle',
            color: '#ad2f45',
            font: this.font
        }
    }
    renderSprite(context, tilesize, ratio, item, widthRatio = 1) {
        context.drawImage(
            this.sheet,
            item.spriteX * tilesize,
            item.spriteY * tilesize,
            item.w * tilesize * widthRatio,
            item.h * tilesize,
            item.x * tilesize * ratio,
            item.y * tilesize * ratio,
            item.w * tilesize * ratio * widthRatio,
            item.h * tilesize * ratio,

        )
    }
    renderText(context, tilesize, ratio, text) {
        context.textBaseline = text.baseline;
        context.textAlign = text.align;
        context.fillStyle = text.color;
        context.font = 'bold ' + Math.round(text.fontSize * ratio) + 'px ' + text.font;
        context.fillText(
            text.content,
            text.x * tilesize * ratio,
            text.y * tilesize * ratio
        );
        context.strokeStyle = text.strokeColor;
        context.lineWidth = text.strokeWidth * ratio;
        context.font = 'bold ' + Math.round(text.fontSize * ratio) + 'px ' + text.font;
        context.strokeText(
            text.content,
            text.x * tilesize * ratio,
            text.y * tilesize * ratio
        );
    }
}
/**
 * - **SpriteX**: X position in the spritesheet
 * - **SpriteY**: Y position in the spritesheet
 * - **x**: X position on the canvas
 * - **y**: Y position on the canvas
 * - **w**: width on the canvas
 * - **h**: height  on the canvas
 */

export class SpriteComponent {
    constructor(spriteX = 0, spriteY = 0, x = 0, y = 0, w = 0, h = 0) {
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
export class TextComponent {
    constructor(x, y, color = '#ad2f45', align = "center", baseline = "middle") {
        this.content = '';
        this.x = x;
        this.y = y;
        this.color = color;
        this.align = align;
        this.baseline = baseline;
        this.fontSize = 7;
        this.font = 'Consolas, monaco, monospace';
        this.stroke = false;
        this.strokeColor = '#2c354d';
        this.strokeWidth = 0.3;

    }
    canvasFont(ratio) {
        return 'bold ' + Math.round(this.fontSize * ratio) + 'px ' + this.font
    }
    render(context, tilesize, ratio) {
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
                        this.x * tilesize * ratio,
                        (this.y * tilesize + this.fontSize * i) * ratio
                    );
                }
                context.fillText(
                    this.content[i],
                    this.x * tilesize * ratio,
                    (this.y * tilesize + this.fontSize * i) * ratio
                );
            }

        } else {
            if (this.stroke) {

                context.strokeText(
                    this.content,
                    this.x * tilesize * ratio,
                    this.y * tilesize * ratio
                );
            }
            context.fillText(
                this.content,
                this.x * tilesize * ratio,
                this.y * tilesize * ratio
            )
        }
    }
}