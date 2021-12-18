import { Equippable } from "../item/item.js";
export class SwordPrototype extends Equippable {
    constructor(source) {
        super(source);
        this.owner = source;
        // To rework later, types and subtypes item -> consumable item -> weapon etc
        this.type = "weapon";
        this.subtype = "weapon";
        this.name = "Sword Prototype";
        this.description = "A wooden sword. It's pretty light and aerodynamic."

        this.setAnimation("idle", [11], [2]);
        this.setAnimation("idle", [11], [3], 1);

        this.setAnimation("attack", [11], [4]);
        this.setAnimation("attack", [11], [5], 1);

        // Stats that will attach to the owner
        this.stats.atk = 2;
        this.stats.atkSpeed = 10;


        /** The sword hitbox (line) */
        this.lineHitbox = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        }

        /** Current offset of the sword */
        this.offsetX = 0;
        /** Current offset of the sword */
        this.offsetY = 0;
        /** Target offset of the sword */
        this.targetX = 0;
        /** Target offset of the sword */
        this.targetY = 0;

        /** Gives a unique ID to each attack, preventing double hits */
        this.attackID = Math.random();

        this.baseRot = -Math.PI / 4;
        this.rot = 0;
        this.state = "idle";

        /** The speed of the sword during the attack */
        this.reloadSpeed = 5;
        this.attackRange = 1.4;
        this.attackDuration = 160;
        this.attackCounter = 0;

        /** define if this is detached from the owner */
        this.detached = false;

        this.friction = 0.98;
    }
    get atk() {
        return this.owner.atk;
    }
    get centerX() {
        return (this.owner.x + this.owner.w / 2);
    }
    get centerY() {
        return (this.owner.y + this.owner.h / 2);
    }
    special(mousePos) {
        if (this.state !== 'idle') {
            return;
        }
        /** Plays the special sound Fx */
        this.sounds['sword-attack'].play();

        this.state = 'special';
        this.left = 0;
        this.attackID = Math.random();
        let mousePlayerRot = this.Physics.getAngle(mousePos.x, mousePos.y, this.centerX, this.centerY)
        this.owner.xVelExt = -Math.cos(mousePlayerRot) / 2;
        this.owner.yVelExt = -Math.sin(mousePlayerRot) / 2;
        this.rot = this.baseRot + mousePlayerRot;
        this.targetX = -Math.cos(mousePlayerRot) * this.attackRange;
        this.targetY = -Math.sin(mousePlayerRot) * this.attackRange;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    computeSpecial(deltaTime, environment) {
        this.animation = 'attack';
        this.owner.frame = 0;
        this.owner.frameCounter = 0;
        this.attackCounter += ((this.attackDuration - this.attackCounter) / 5 + this.owner.atkSpeed) * deltaTime;
        if (this.attackCounter > this.attackDuration) {
            this.attackCounter = this.attackDuration;
            this.state = 'return';
        }
        this.offsetX = (this.targetX / this.attackDuration) * this.attackCounter;
        this.offsetY = (this.targetY / this.attackDuration) * this.attackCounter;


        this.updateLineHitbox();
        this.checkLineCollisions(environment);
    }
    attack(mousePos) {
        if (this.state !== 'idle') {
            return;
        }
        /** Plays the attack sound Fx */
        this.sounds['sword-attack'].play(1, 2);

        this.state = 'attack';
        this.animation = 'attack';
        this.left = 0;
        this.attackID = Math.random();
        let mousePlayerRot = this.Physics.getAngle(mousePos.x, mousePos.y, this.centerX, this.centerY)
        this.rot = this.baseRot + mousePlayerRot;
        this.targetX = -Math.cos(mousePlayerRot) * this.attackRange;
        this.targetY = -Math.sin(mousePlayerRot) * this.attackRange;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    computeAttack(deltaTime, environment) {
        this.animation = 'attack';
        this.attackCounter += ((this.attackDuration - this.attackCounter) / 5 + this.owner.atkSpeed) * deltaTime;
        if (this.attackCounter > this.attackDuration) {
            this.attackCounter = this.attackDuration;
            this.state = 'return';
        }
        this.offsetX = (this.targetX / this.attackDuration) * this.attackCounter;
        this.offsetY = (this.targetY / this.attackDuration) * this.attackCounter;

        this.updateLineHitbox();
        this.checkLineCollisions(environment);
    }
    computeState(deltaTime, environment) {
        switch (this.state) {
            case 'idle':
                this.animation = 'idle';
                this.left = this.owner.left;
                this.offsetX = this.left - this.w / 2;
                break;
            case 'attack':
                this.computeAttack(deltaTime, environment);
                break;
            case 'return':
                this.computeReturn(deltaTime);
                break;
            case 'special':
                this.computeSpecial(deltaTime, environment);
                break;
        }
    }
    /** Updates the line collider */
    updateLineHitbox() {
        this.lineHitbox.x1 = this.centerX;
        this.lineHitbox.y1 = this.centerY;
        this.lineHitbox.x2 = this.centerX + this.offsetX - this.w / 2 * Math.cos(this.rot - this.baseRot);
        this.lineHitbox.y2 = this.centerY + this.offsetY - this.h / 2 * Math.sin(this.rot - this.baseRot);
    }
    checkLineCollisions(environment, square = false) {
        for (let entity of environment) {
            if (entity.removed) {
                continue;
            }
            if (entity === this.owner) {
                continue;
            }
            if (this.Physics.lineRectCol(this.lineHitbox, entity)) {
                // Collision happened
                /**
                 * NOTE: Should probably standardize this behaviour into the weapon parent class
                 */
                if (entity.type === "enemy" && entity.state !== 'dead') {
                    if (entity.damaged !== this.attackID) {
                        entity.onHit(this, this.owner)
                        /** Creates an hit visual Fx */
                        this.createVfx("DmgVfx", entity);
                        /** Plays the sword hit sound Fx */
                        this.sounds['sword-hit'].play();

                        let dmgText = this.createVfx("TextVfx", entity);
                        dmgText.text.content = `${this.atk}`;
                        dmgText.text.color = '#ad2f45';

                        entity.xVelExt = (this.targetX - this.offsetX) / 10;
                        entity.yVelExt = (this.targetY - this.offsetY) / 10;
                    }
                }
            }
        }

    }
    /** Compute the returning to the owner */
    computeReturn(deltaTime) {
        this.animation = 'idle';
        this.attackCounter -=
            (this.attackDuration - this.attackCounter) / 5 +
            this.reloadSpeed * this.owner.atkSpeed * deltaTime;

        if (this.attackCounter < 0) {
            //Returned to player
            this.attackCounter = 0;
            this.rot = 0;
            this.state = 'idle';
        }
        this.offsetX = (this.targetX / this.attackDuration) * this.attackCounter;
        this.offsetY = (this.targetY / this.attackDuration) * this.attackCounter;
    }
    compute(deltaTime, environment) {
        this.computeState(deltaTime, environment);
        // Computes offsets (when attacking)
        if (!this.detached) {
            this.x = this.owner.x + this.offsetX;
            this.y = this.owner.y + this.offsetY;
        }
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera, this.rot);
    }
}