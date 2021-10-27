import { checkCollisions } from "../physics/checkCollisions.js"
import * as Physics from "../physics/physics.js"
import { Sprite } from "./sprite.js"
import { vfxManager } from "../vfxManager/vfxManager.js"
export class Entity extends Sprite {
    constructor(x, y) {
        super(x, y);

        this.xVel = 0;
        this.yVel = 0;

        this.display = true;
        // The scope in which this entity is enclosed to
        // this.environment = []; deprecated

        this.xVelExt = 0;
        this.yVelExt = 0;
        this.friction = 0.85;
        this.type = "entity";
        this.state = "idle";
        this.createVfx = vfxManager.create;

        this.stats = new Stats(this);

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
        this.immovable = false;

        /** A list containing this entity's drops. 
         * When this entity will get removed by the garbage cleaner  
         * the drop will dispatch, and go to the entities array.
         */
        this.drops = [];



        // Offsets from the shadow;
        this.offsetX = 0;
        this.offsetY = 0;

        this.checkCollisions = checkCollisions;
        this.Physics = Physics;


        this.hasHpBar = false;
        this.hasDisplayName = false;
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
    /** Returns the stats.atk value */
    get atk() { return this.stats.atk }

    /** Returns the stats.hp value */
    get hp() { return this.stats.hp }

    /** Returns the stats.maxHp value */
    set hp(value) { this.stats.hp = value }

    get centerX() { return this.x + this.w / 2 }
    get centerY() { return this.y + this.h / 2 }

    updateHitbox() {
        this.hitbox.x = this.x + this.hitboxOffset.x;
        this.hitbox.y = this.y + this.hitboxOffset.y;
        this.hitbox.w = this.w + this.hitboxOffset.w;
        this.hitbox.h = this.h + this.hitboxOffset.h;
    }
    onCollision(source) {
        /** Exceptional collision events */
    }

    /** Moves this entity according to the lateral collisions */
    resolveCollisions() {
        if (this.col.L && this.xVel + this.xVelExt < 0) {
            this.xVel = 0;
            this.xVelExt = 0;
        }
        if (this.col.R && this.xVel + this.xVelExt > 0) {
            this.xVel = 0;
            this.xVelExt = 0;
        }
        if (this.col.T && this.yVel + this.yVelExt < 0) {
            this.yVel = 0;
            this.yVelExt = 0;
        }
        if (this.col.B && this.yVel + this.yVelExt > 0) {
            this.yVel = 0;
            this.yVelExt = 0;
        }



        //this.x += this.col.L - this.col.R;
        //this.y += this.col.T - this.col.B;
        this.col.L = 0;
        this.col.R = 0;
        this.col.T = 0;
        this.col.B = 0;
    }
    onHit(source) {
        this.xVelExt = source.xVel;
        this.yVelExt = source.yVel;
    }
    updateVelocities(deltaTime) {
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
    }
    /** Moves this entity according to its velocities */
    updatePosition(deltaTime) {
        this.resolveCollisions();
        this.x += (this.xVel + this.xVelExt) * deltaTime;
        this.y += (this.yVel + this.yVelExt) * deltaTime;
    }
    compute(deltaTime) {}
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera);
    }

    /** Used for debugging, displays the entity's hitbox */
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

/** Default stats of an entity */
class Stats {
    constructor() {
        this.lv = 1;
        this.maxHp = 10;
        this.hp = this.maxHp;
        this.maxExp = 0;
        this.exp = 0;
        this.maxMana = 15;
        this.mana = this.maxMana;
        this.atk = 1;
        this.atkSpeed = 1;
        this.expValue = 1;
    }
}