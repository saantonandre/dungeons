import { spritesheet } from "../resourceManager.js";
import { checkCollisions } from "../physics/checkCollisions.js"
export class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.xVel = 0;
        this.yVel = 0;

        // The scope in which this entity is enclosed to
        this.environment = [];

        this.xVelExt = 0;
        this.yVelExt = 0;
        this.friction = 0.8;
        this.type = "entity";
        this.state = "idle";

        this.damaged = false;
        this.shadow = false;
        this.solid = true;
        this.removed = false;
        this.left = 0;

        this.stats = new Stats(this);

        this.sheet = spritesheet;
        this.animation = "idle";
        this.animations = [];
        this.setAnimation("idle", [0], [0]);
        this.frame = 0;
        this.frameCounter = 0;
        this.checkCollisions = checkCollisions;
        // this.slowness = 6; //replaced for 'this.animations[animation].slowness'
        this.col = {
            L: 0,
            R: 0,
            T: 0,
            B: 0,
        };
        this.hitbox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.hitboxOffset = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
        this.updateHitbox();
    }
    updateHitbox() {
        this.hitbox.x = this.x + this.hitboxOffset.x;
        this.hitbox.y = this.y + this.hitboxOffset.y;
        this.hitbox.w = this.w + this.hitboxOffset.w;
        this.hitbox.h = this.h + this.hitboxOffset.h;
    }
    onCollision(source) {

    }
    onHit(source) {
        this.xVelExt = source.xVel;
        this.yVelExt = source.yVel;
    }
    /** Sets the new x and y positions */
    updatePosition(deltaTime) {
        //Check for external velocities
        if (this.xVelExt !== 0) {
            this.xVelExt *= Math.pow(this.friction, deltaTime);
            if (Math.abs(this.xVelExt) < 0.001) {
                this.xVelExt = 0;
            }
        }
        if (this.yVelExt !== 0) {
            this.yVelExt *= Math.pow(this.friction, deltaTime);
            if (Math.abs(this.yVelExt) < 0.001) {
                this.yVelExt = 0;
            }
        }
        this.x += (this.xVel + this.xVelExt) * deltaTime;
        this.y += (this.yVel + this.yVelExt) * deltaTime;
    }
    setAnimation(label, keyframesX, keyframesY, left = 0) {
        if (!this.animations[label]) {
            this.animations[label] = {
                keyframesX: [
                    [],
                    []
                ],
                keyframesY: [
                    [],
                    []
                ],
                slowness: 6
            }
        }
        if (left) {
            this.animations[label].keyframesX[1] = keyframesX;
            this.animations[label].keyframesY[1] = keyframesY;
        } else {
            this.animations[label].keyframesX[0] = keyframesX;
            this.animations[label].keyframesY[0] = keyframesY;

            this.animations[label].keyframesX[1] = keyframesX;
            this.animations[label].keyframesY[1] = keyframesY;
        }

    }
    compute(deltaTime) {}
    onAnimationEnd() {
        // What happens after the current animation ends
    }
    updateSprite(deltaTime) {
        this.frameCounter += deltaTime;
        if (this.frameCounter >= this.animations[this.animation].slowness) {
            this.frame++;
            this.frameCounter = 0;
        }
        if (this.frame >= this.animations[this.animation].keyframesX[this.left].length) {
            this.frame = 0;
            this.onAnimationEnd();
        }
    }
    renderSprite(context, tilesize, ratio, camera) {

        if (this.removed) {
            // If the entity is removed, don't bother rendering
            return;
        }
        if (this.shadow) {
            this.renderShadow(context, tilesize, ratio, camera);
            // If the entity is removed, don't bother rendering
        }
        context.drawImage(
            this.sheet, // source of the sprite
            this.animations[this.animation].keyframesX[this.left][this.frame] * tilesize, // x pos of the sprite
            this.animations[this.animation].keyframesY[this.left][this.frame] * tilesize, // y pos of the sprite
            this.w * tilesize, // width of the sprite
            this.h * tilesize, // height of the sprite
            (this.x + camera.x) * tilesize * ratio, // x of the entity
            (this.y + camera.y) * tilesize * ratio, // y of the entity
            this.w * tilesize * ratio, // width of the entity
            this.h * tilesize * ratio // height of the entity
        );
    }

    renderShadow(context, tilesize, ratio, camera) {
        // Canon Shadow rendering (PROVISIONAL)
        context.fillStyle = "#14182e";
        context.globalAlpha = 0.6;
        context.beginPath();
        context.ellipse(
            (this.x + camera.x + this.w / 2) * tilesize * ratio,
            (this.y + this.h + camera.y) * tilesize * ratio,
            this.w / 2 * tilesize * ratio,
            this.w / 4 * tilesize * ratio,
            0,
            0,
            2 * Math.PI);
        context.fill();
        context.globalAlpha = 1;
    }
}
class Stats {
    constructor(source) {
        this.name = source.type;
        this.lv = 1;
        this.maxHp = 20;
        this.hp = this.maxHp;
        this.maxExp = 0;
        this.exp = 0;
        this.maxMana = 15;
        this.mana = this.maxMana;
        this.atk = 1;
    }
}