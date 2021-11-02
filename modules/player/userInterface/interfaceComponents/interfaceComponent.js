import { spritesheet } from "../../../resourceManager.js";
import { Text as TextComponent } from '../../../text/text.js'
export { TextComponent };
import { Sprite } from "../../../entity/sprite.js";
import { soundManager } from "../../../soundManager/soundManager.js";
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

/** A simple button which transitions to active when clicked */
export class IconComponent extends Sprite {
    constructor(x, y) {
        super(x, y);
        this.animation = 'idle';
        this.active = false;
        this.sound = soundManager.sounds['click-3'];
        // this.icon.setAnimation("idle", [30], [21]);
        // this.icon.setAnimation("highlight", [30], [22]);
    }
    // If mouse is hover this element
    handleHover(controls) {
        if (controls.lClickDown) {
            // If left btn down
            if (this.animation !== 'idle') {
                // If this isn't in the 'idle' state (eg. is highlighted)
                // - Change this animation to 'idle' and this state to 'active'
                this.loadAnimation('idle');
                this.active = !this.active;
                this.sound.play();
            }
        } else {
            // If mouse is hovering but not clicked, highlight
            this.loadAnimation('highlight');
        }
    }
    compute(mouse, controls, deltaTime) {
        if (pointSquareCol(mouse, this)) {
            mouse.hoverUI = true;
            this.handleHover(controls)
        } else {
            if (this.animation === 'highlight') {
                this.animation = 'idle';
            }
        }
        this.updateSprite(deltaTime);
    }
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio);
    }
}

function pointSquareCol(point, sq) {
    var square = sq;
    if (sq.hitbox !== undefined) {
        square = sq.hitbox;
    }
    if (point.x >= square.x) {
        if (point.x <= square.x + square.w) {
            if (point.y >= square.y) {
                if (point.y <= square.y + square.h) {
                    return true;
                }
            }

        }
    }
    return false;
}