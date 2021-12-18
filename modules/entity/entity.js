import { checkCollisions } from "../physics/checkCollisions.js";
import * as Physics from "../physics/physics.js";
import { Sprite } from "./sprite.js";
import { vfxManager } from "../vfxManager/vfxManager.js";
import { soundManager } from "../soundManager/soundManager.js";
export class Entity extends Sprite {
    constructor(x, y) {
        super(x, y);

        this.xVel = 0;
        this.yVel = 0;

        // External velocities (velocities acquired from external sources, like a strong hit)
        this.xVelExt = 0;
        this.yVelExt = 0;

        this.display = true;
        this.friction = 0.85;
        this.type = "entity";
        this.state = "idle";

        this.createVfx = vfxManager.create;
        this.sounds = soundManager.sounds;

        this.stats = new Stats(this);

        /** Defines whether this entity has low rendering order priority */
        this.background = false;


        /** Defines whether this entity is attached to the ground*/
        this.grounded = false;

        this.damaged = 0;
        this.shadow = false;
        this.solid = true;
        this.removed = false;
        this.immovable = false;

        // The id of the room where this entity is stored
        this.currentRoom = -1;
        /** 
         * A list containing this entity's drops. 
         * When this entity will get removed by the garbage cleaner  
         * the drop will dispatch, and go to the entities array.
         */
        this.drops = [];



        // Visual offsets relative to the actual position
        this.offsetX = 0;
        this.offsetY = 0;

        this.checkCollisions = checkCollisions;
        this.Physics = Physics;


        this.hasHpBar = false;
        this.hasDisplayName = false;

        /** Object containing the collisions amounts */
        this.col = {
            L: 0, // Left side
            R: 0, // Right side
            T: 0, // Top side
            B: 0, // Bottom side
        };

        /** Object representing the hitbox used for collision computations */
        this.hitbox = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        /** Represents the offsets of the hitbox, which may change based on current animation/state */
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

    /** Updates the hitbox's positions and size, relative to this absolute properties and the hitboxOffset properties */
    updateHitbox() {
        this.hitbox.x = this.x + this.hitboxOffset.x;
        this.hitbox.y = this.y + this.hitboxOffset.y;
        this.hitbox.w = this.w + this.hitboxOffset.w;
        this.hitbox.h = this.h + this.hitboxOffset.h;
    }
    /** Updates the hitbox's positions and size, relative to this absolute properties and the hitboxOffset properties 
     * @param {Entity} collider A reference to the entity collided to this one
     */
    onCollision(collider) {
        // Collision events gets defined by children classes
    }

    /** Adjusts this entity's velocities according to collisions */
    resolveCollisions() {
        // Checks wether the entity is traveling against eventual colliding sides
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
        // Resets the collision properties
        this.col.L = 0;
        this.col.R = 0;
        this.col.T = 0;
        this.col.B = 0;
    }
    /**
     * Similar to the *onCollision* method, gets called whenever this entity collides with a damaging Entity, 
     * which could be a spell, an attack, or an obstacle
     * @param {Entity} source The source of the attack
     */
    onHit(source) {
        this.xVelExt = source.xVel;
        this.yVelExt = source.yVel;
    }
    /**
     * Updates the external velocities according to the friction
     * @param {Number} deltaTime Time multiplier
     */
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
    /** Moves this entity according to its velocities 
     * @param {Number} deltaTime Time multiplier
     */
    updatePosition(deltaTime) {
        this.resolveCollisions();
        this.x += (this.xVel + this.xVelExt) * deltaTime;
        this.y += (this.yVel + this.yVelExt) * deltaTime;
    }


    /**
     * Handles the computational aspects of the entity
     * @param {Number} deltaTime Time multiplier 
     */
    compute(deltaTime) {}


    /**
     * Handles the rendering of this entity and eventual renderable children (e.g. Equipment, Shadow, etc..)
     * 
     * @param {CanvasRenderingContext2D} context The canvas drawing context
     * @param {Number} tilesize  The size of a single tile
     * @param {Number} ratio The scaling of each pixel
     * @param {Camera | any} camera Optional Camera abstraction representing an offset relative to the map (0,0) coordinates
     */
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera);
    }

    /** Used for debugging, displays the entity's hitbox 
     * 
     * @param {CanvasRenderingContext2D} context The canvas drawing context
     * @param {Number} tilesize  The size of a single tile
     * @param {Number} ratio The scaling of each pixel
     * @param {Camera | any} camera Optional Camera abstraction representing an offset relative to the map (0,0) coordinates
     */
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

    /** Casts an elliptical shadow just below this entity 
     * 
     * @param {CanvasRenderingContext2D} context The canvas drawing context
     * @param {Number} tilesize  The size of a single tile
     * @param {Number} ratio The scaling of each pixel
     * @param {Camera | any} camera Optional Camera abstraction representing an offset relative to the map (0,0) coordinates
     */
    renderShadow(context, tilesize, ratio, camera) {
        if (!this.shadow || this.removed) {
            return;
        }
        // Provisional shadow rendering
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

/** Class representing the basic stats of an entity */
class Stats {
    constructor() {
        /* The current level, level augments every other stat */
        this.lv = 1;
        /* Maximum hit points */
        this.maxHp = 10;
        /* Current hit points, hp <= 0 will result in an entity's death  */
        this.hp = this.maxHp;
        /* Threshold experience */
        this.maxExp = 10;
        /* Current experience, reaching the threshold will result in a level up */
        this.exp = 0;
        /* Maximum mana */
        this.maxMana = 15;
        /* Current mana, the mana is a currency used to cast spells/perform special actions */
        this.mana = this.maxMana;

        /* The attack stat, represents how many hit points will get subtracted to other entities when getting attacked by this one */
        this.atk = 1;
        /* Multiplier of the rate at which this entity attacks, the higher it is, the lower the intervals */
        this.atkSpeed = 1;
        /* The experience value that this entity will transfer to the killer entity */
        this.expValue = 1;
    }
}