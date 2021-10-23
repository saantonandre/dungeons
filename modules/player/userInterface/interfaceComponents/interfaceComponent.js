import { spritesheet } from "../../../resourceManager.js";
import { Text } from '../../../text/text.js'
export { Text as TextComponent };
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
}
/**
 * - **SpriteX**: X position in the spritesheet
 * - **SpriteY**: Y position in the spritesheet
 * - **x**: X position on the canvas
 * - **y**: Y position on the canvas
 * - **w**: width on the canvas
 * - **h**: height  on the canvas
 */

export class ImageComponent {
    constructor(spriteX = 0, spriteY = 0, x = 0, y = 0, w = 1, h = 1) {
        this.sheet = spritesheet;
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    render(context, tilesize, ratio, widthRatio = 1) {
        context.drawImage(
            this.sheet,
            this.spriteX * tilesize,
            this.spriteY * tilesize,
            this.w * tilesize * widthRatio,
            this.h * tilesize,
            this.x * tilesize * ratio,
            this.y * tilesize * ratio,
            this.w * tilesize * ratio * widthRatio,
            this.h * tilesize * ratio,

        )
    }
}