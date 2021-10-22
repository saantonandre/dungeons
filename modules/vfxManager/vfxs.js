import { Sprite } from "../entity/sprite.js";

class Vfx extends Sprite {
    /**
     * 
     * @param {Number} x horizontal position in the canvas
     * @param {Number} y vertical position in the canvas
     * @param {Number} duration The amount of animation cycles
     */
    constructor(x, y, duration = 1) {
        super(x, y);
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
    reset(x, y) {
        this.x = x - this.w / 2;
        this.y = y - this.h / 2;
        if (this.randomPos) {
            this.randomizePos();
        }
        this.removed = false;
        this.frame = 0;
        this.frameCounter = 0;
        this.duration = this.initialDuration;
        //console.log("resetted!")
    }
    compute(deltaTime) {
        this.updateSprite(deltaTime);
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera);

    }
    onAnimationEnd() {
        switch (this.animation) {
            case 'idle':
                this.duration--;
                if (this.duration <= 0) {
                    this.removed = true;
                    //console.log("deleted!")
                }
                break;
        }
    }
}

export class DmgVfx extends Vfx {
    constructor(x, y, duration = 1) {
        super(x, y, duration);
        console.log("created!")
        this.name = 'DmgVfx';
        this.w = 1;
        this.h = 1;
        this.x -= this.w / 2;
        this.y -= this.h / 2;
        this.randomPos = true;
        this.randomizePos();
        this.setAnimation('idle', [17, 17, 17, 17], [0, 1, 2, 3]);
        this.animations['idle'].slowness = 6;
    }
}