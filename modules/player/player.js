import { controls } from "../controls/controls.js";
import { Entity } from "../entity/entity.js";
class Player extends Entity {
    constructor(x = 7.5, y = 7.5) {
        super(x, y);
        this.type = "player";

        this.facing = "r";
        this.baseSpeed = 0.1;
        this.speed = this.baseSpeed;
        this.shadow = true;
        this.immovable = true;
        this.animation = "idle";
        this.setAnimation("idle", [0, 0, 0, 0], [6, 7, 8, 9]);
        this.setAnimation("idle", [1, 1, 1, 1], [6, 7, 8, 9], 1);

        this.hitboxOffset.x = 0.35;
        this.hitboxOffset.y = 0.3;
        this.hitboxOffset.w = -0.6;
        this.hitboxOffset.h = -0.3;
    }
    compute(deltaTime) {
        this.updateSprite(deltaTime);
        this.resolveInput();
        this.updatePosition(deltaTime);
        this.updateHitbox();
        this.checkCollisions(this, this.environment)
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera);
    }
    resolveInput() {
        // Moves
        if (controls.left && !controls.right) {
            this.facing = "l";
            this.xVel = -this.speed;
            this.left = 1;
        } else if (this.xVel < 0) {
            this.xVel = 0;
        }
        if (controls.right && !controls.left) {
            this.facing = "r";
            this.xVel = this.speed;
            this.left = 0;
        } else if (this.xVel > 0) {
            this.xVel = 0;
        }
        if (controls.up && !controls.down) {
            this.facing = "t";
            this.yVel = -this.speed;
        } else if (this.yVel < 0) {
            this.yVel = 0;
        }
        if (controls.down && !controls.up) {
            this.facing = "b";
            this.yVel = this.speed;
        } else if (this.yVel > 0) {
            this.yVel = 0;
        }
        if (!controls.left && !controls.right && !controls.up && !controls.down) {
            this.xVel = 0;
            this.yVel = 0;
        }
        if (controls.left + controls.right + controls.up + controls.down > 1) {
            this.xVel /= 1.42;
            this.yVel /= 1.42;
        }
    }
}
export const player = new Player();