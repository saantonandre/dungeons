import { Sprite } from "../entity/sprite.js";

class Vfx extends Sprite {
    /**
     * 
     * @param {*} x horizontal position in the canvas
     * @param {*} y vertical position in the canvas
     * @param {Number} duration The amount of animation cycles
     */
    constructor(x, y, duration = 1) {
        this.duration = duration;
    }
    onAnimationEnd() {
        switch (this.animation) {
            case 'idle':
                this.duration--;
                if (this.duration <= 0) {
                    this.scheduleDeletion = true;
                }
                break;
        }
    }
}