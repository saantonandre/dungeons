import { spritesheet } from "../resourceManager.js";
import { checkCollisions } from "../physics/checkCollisions.js"
import * as Physics from "../physics/physics.js"
export class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.xVel = 0;
        this.yVel = 0;

        // The scope in which this entity is enclosed to
        // this.environment = []; deprecated

        this.xVelExt = 0;
        this.yVelExt = 0;
        this.friction = 0.8;
        this.type = "entity";
        this.state = "idle";

        /** Last in rendering order? */
        this.background = false;
        /** Is it part of the ground? can flying objects collide with this?*/
        this.grounded = false;
        /** Is it this a flying entity? can it avoid grounded obstacles?*/
        this.flying = false;

        this.damaged = false;
        this.shadow = false;
        this.solid = true;
        this.removed = false;
        this.left = 0;

        this.stats = new Stats(this);

        this.sheet = spritesheet;
        this.animation = "idle";
        this.animations = [];
        this.frame = 0;
        this.frameCounter = 0;
        this.setAnimation("idle", [0], [0]);

        this.checkCollisions = checkCollisions;
        this.Physics = Physics;

        this.hasHpBar = false;
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
    resolveCollisions() {
        if (this.immovable) {
            return;
        }
        this.x += this.col.L - this.col.R;
        this.y += this.col.T - this.col.B;
        this.col.L = 0;
        this.col.R = 0;
        this.col.T = 0;
        this.col.B = 0;
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
                slowness: 6,
                w: this.w,
                h: this.h
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
            this.frameCounter = 0;
            this.onAnimationEnd();
        }
    }
    renderHitbox(context, tilesize, ratio, camera) {
        context.strokeStyle = "red";
        context.beginPath();
        context.strokeRect(
            (this.hitbox.x + camera.x) * tilesize * ratio,
            (this.hitbox.y + camera.y) * tilesize * ratio,
            this.hitbox.w * tilesize * ratio,
            this.hitbox.h * tilesize * ratio
        )
        context.closePath();
        context.stroke();
    }
    renderSprite(context, tilesize, ratio, camera, rot = false) {

        if (this.removed) {
            // If the entity is removed, don't bother rendering
            return;
        }

        // Offset given by the difference of the animation relative to the actual width/height of the entity
        let animationOffsetX = (this.w - this.animations[this.animation].w) / 2;
        let animationOffsetY = (this.h - this.animations[this.animation].h) / 2
        if (rot) {
            context.save();
            context.translate(
                (this.x + animationOffsetX + this.w / 2 + camera.x) * tilesize * ratio,
                (this.y + animationOffsetY + this.h / 2 + camera.y) * tilesize * ratio
            )
            //
            context.rotate(rot);
            context.drawImage(
                this.sheet, // source of the sprite
                this.animations[this.animation].keyframesX[this.left][this.frame] * tilesize, // x pos of the sprite
                this.animations[this.animation].keyframesY[this.left][this.frame] * tilesize, // y pos of the sprite
                this.animations[this.animation].w * tilesize, // width of the sprite
                this.animations[this.animation].h * tilesize, // height of the sprite
                (-this.w / 2) * tilesize * ratio, // x of the entity
                (-this.h / 2) * tilesize * ratio, // y of the entity
                this.animations[this.animation].w * tilesize * ratio, // width of the entity
                this.animations[this.animation].h * tilesize * ratio // height of the entity
            );
            context.restore();
        } else {
            context.drawImage(
                this.sheet, // source of the sprite
                this.animations[this.animation].keyframesX[this.left][this.frame] * tilesize, // x pos of the sprite
                this.animations[this.animation].keyframesY[this.left][this.frame] * tilesize, // y pos of the sprite
                this.animations[this.animation].w * tilesize, // width of the sprite
                this.animations[this.animation].h * tilesize, // height of the sprite
                (this.x + animationOffsetX + camera.x) * tilesize * ratio, // x of the entity
                (this.y + animationOffsetY + camera.y) * tilesize * ratio, // y of the entity
                this.animations[this.animation].w * tilesize * ratio, // width of the entity
                this.animations[this.animation].h * tilesize * ratio // height of the entity
            );
        }
    }

    renderShadow(context, tilesize, ratio, camera) {
        if (!this.shadow || this.removed) {
            return;
        }
        // Canon Shadow rendering (PROVISIONAL)
        context.fillStyle = "#14182e";
        context.globalAlpha = 0.6;
        context.strokeStyle = "#ffffff";
        context.beginPath();
        context.ellipse(
            (this.x + camera.x + this.w / 2) * tilesize * ratio,
            (this.y + this.h + camera.y) * tilesize * ratio,
            this.w / 2 * tilesize * ratio,
            this.w / 4 * tilesize * ratio,
            0,
            0,
            2 * Math.PI);
        context.closePath();
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