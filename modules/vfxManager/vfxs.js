import { Sprite } from "../entity/sprite.js";
import { Text } from "../text/text.js";

/** Prototype Vfx */
class SpriteVfx extends Sprite {
    /**
     * 
     * @param {Number} x horizontal position in the canvas
     * @param {Number} y vertical position in the canvas
     * @param {Number} duration The amount of animation cycles
     */
    constructor(source, duration = 1) {
        super(source.centerX, source.centerY);
        this.source = source;
        this.type = "vfx";
        this.name = "proto";
        this.duration = duration;
        this.initialDuration = duration;
        this.removed = false;
        this.randomPos = false;
        this.randomAmount = 0.5;
    }
    resolveCollisions() {}
    renderShadow() {}
    randomizePos() {
        this.x += Math.random() * this.randomAmount - this.randomAmount / 2;
        this.y += Math.random() * this.randomAmount - this.randomAmount / 2;
    }
    reset(source) {
        /** Returns to the original state */
        this.source = source;
        this.moveAtSource()

        if (this.randomPos) {
            this.randomizePos();
        }
        this.removed = false;
        this.frame = 0;
        this.frameCounter = 0;
        this.duration = this.initialDuration;
        this.additionalResetOperations();
    }
    /** Each vfx may have different reset options */
    additionalResetOperations() {

    }
    moveAtSource() {
        this.x = this.source.centerX - this.w / 2;
        this.y = this.source.centerY - this.h / 2;
    }
    compute(deltaTime) {
        this.updateSprite(deltaTime);
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera, this.rot);

    }
    onAnimationEnd() {
        this.duration--;
        if (this.duration <= 0) {
            /** Removes vfx at the end of the duration */
            this.removed = true;
        }
    }
}
/** DmgVfxs have 4 random animations and 4 random rotations */
export class DmgVfx extends SpriteVfx {
    constructor(source, duration = 1) {
        super(source, duration);
        this.name = 'DmgVfx';
        this.w = 1;
        this.h = 1;
        this.randomPos = true;
        this.randomizePos();
        this.setAnimation('boom', [17, 17, 17, 17], [0, 1, 2, 3]);
        this.setAnimation('cut', [18, 18, 18, 18], [0, 1, 2, 3]);
        this.setAnimation('cut_long', [20, 20, 20, 20], [0, 1, 2, 3]);
        this.animations['cut_long'].w = 2;
        this.additionalResetOperations();
    }
    additionalResetOperations() {
        let animations = Object.entries(this.animations)
        /** Assign a random animation */
        this.animation = animations[Math.random() * animations.length | 0][0];
        let rotations = [0, 90, 180, -90];
        this.rot = rotations[Math.random() * rotations.length | 0];
    }
}
export class ParticlesVfx extends SpriteVfx {
    constructor(source, duration = 1) {
        super(source, duration);
        this.name = 'ParticlesVfx';
        this.x = this.source.x + this.source.w / 2 + Math.random() * 1.5 - 0.75;
        this.y = this.source.y + this.source.h / 2 + Math.random() * 1.5 - 0.75;
        this.w = 1;
        this.h = 1;
        this.particles = [];
    }
    additionalResetOperations() {
        this.particles = [];
        this.x = this.source.x + this.source.w / 2 + Math.random() * 1.5 - 0.75;
        this.y = this.source.y + this.source.h / 2 + Math.random() * 1.5 - 0.75;
    }
}
export class TextVfx extends SpriteVfx {
    constructor(source) {
        super(source);
        this.name = 'TextVfx';
        this.text = new Text(0, 0);
        this.text.content = '';
        /** Red by default */
        this.text.color = '#ad2f45';
        this.text.shadow = true;
        this.text.fontSize = 10;
        this.progress = 0;
    }
    reset(source, content = '') {
        this.removed = false;
        this.progress = 0;
        this.text.content = content;
        this.source = source;
    }
    compute(deltaTime) {
        this.progress += (Math.PI / 60) * deltaTime;
        if (this.progress >= Math.PI) {
            this.removed = true;
            return;
        }
        this.x = this.source.centerX + this.progress / 10;
        this.y = this.source.centerY - Math.sin(this.progress);
        this.text.x = this.x;
        this.text.y = this.y;
    }
    render(context, tilesize, ratio, camera) {
        this.text.render(context, tilesize, ratio, camera);
    }
}