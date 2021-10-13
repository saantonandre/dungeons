import { Item } from "../item/item.js";
export class SwordPrototype extends Item {
    constructor(owner) {
        super();
        this.owner = owner;

        this.w = 1;
        this.h = 1;
        this.setAnimation("idle", [11], [2]);
        this.setAnimation("idle", [11], [3], 1);

        this.setAnimation("attack", [11], [4]);
        this.setAnimation("attack", [11], [5], 1);

        // Stats
        this.type = "weapon";
        this.name = "Sword prototype";
        this.weaponAtk = 2;

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
        this.attackSpeed = 1;
        this.reloadSpeed = 5;
        this.attackRange = 2;
        this.attackDuration = 160;
        this.attackCounter = 0;
    }
    get atk() {
        return (this.owner.atk + this.weaponAtk);
    }
    get centerX() {
        return (this.owner.x + this.owner.w / 2);
    }
    get centerY() {
        return (this.owner.y + this.owner.h / 2);
    }
    /**
     * - Change to the attack state
     * - Change the rotation according to the mouse pos
     * - Get accelleration based on the rotation
     */
    attack(mousePos) {
        if (this.state !== 'idle') {
            return;
        }
        this.state = 'attack';
        this.attackID = Math.random();
        let mousePlayerRot = this.Physics.getAngle(mousePos.x, mousePos.y, this.centerX, this.centerY)
        this.rot = this.baseRot + mousePlayerRot;
        this.targetX = -Math.cos(mousePlayerRot) * this.attackRange;
        this.targetY = -Math.sin(mousePlayerRot) * this.attackRange;

    }
    computeState(deltaTime, environment) {
        switch (this.state) {
            case 'idle':
                this.animation = 'idle';
                break;
            case 'attack':
                this.computeAttack(deltaTime, environment);
                this.animation = 'attack';
                break;
            case 'return':
                this.computeReturn(deltaTime);
                this.animation = 'idle';
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
    checkLineCollisions(environment) {
        this.updateLineHitbox();
        for (let entity of environment) {
            if (entity.removed) {
                continue;
            }
            if (entity === this.owner) {
                continue;
            }
            if (this.Physics.lineSquareCol(this.lineHitbox, entity)) {
                // Collision happened
                if (entity.type == "enemy") {
                    if (entity.damaged !== this.attackID) {
                        entity.onHit(this)
                    }
                }
            }
        }

    }
    computeAttack(deltaTime, environment) {
        if (this.attackCounter === this.attackDuration) {
            this.state = 'return';
        }
        this.attackCounter += (this.attackDuration - this.attackCounter) / 5 + this.attackSpeed * deltaTime * 2;
        if (this.attackCounter > this.attackDuration) {
            this.attackCounter = this.attackDuration;
        }
        this.offsetX = (this.targetX / this.attackDuration) * this.attackCounter;
        this.offsetY = (this.targetY / this.attackDuration) * this.attackCounter;

        this.checkLineCollisions(environment);
    }
    /** Compute the returning to the owner */
    computeReturn(deltaTime) {
        if (this.attackCounter === 0) {
            this.rot = 0;
            this.state = 'idle';
        }
        this.attackCounter -=
            ((this.attackCounter - this.attackDuration) * -1) / 5 +
            this.attackSpeed * deltaTime * this.reloadSpeed;
        if (this.attackCounter < 0) {
            this.attackCounter = 0;
        }
        this.offsetX = (this.targetX / this.attackDuration) * this.attackCounter;
        this.offsetY = (this.targetY / this.attackDuration) * this.attackCounter;
    }
    compute(deltaTime, environment) {
        this.computeState(deltaTime, environment);
        if (this.state == 'idle') {
            this.left = this.owner.left;
            this.offsetX = this.left - this.w / 2;
        } else {
            this.left = 0;
        }
        // Computes offsets (when attacking)

        this.x = this.owner.x + this.offsetX;
        this.y = this.owner.y + this.offsetY;
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera, this.rot);
        context.fillRect(
            (this.centerX - 0.1 + camera.x) * tilesize * ratio,
            (this.centerY - 0.1 + camera.y) * tilesize * ratio,
            0.2 * tilesize * ratio,
            0.2 * tilesize * ratio,
        )
        context.fillRect(
            (this.owner.director.mouse.x + camera.x) * tilesize * ratio,
            (this.owner.director.mouse.y + camera.y) * tilesize * ratio,
            0.2 * tilesize * ratio,
            0.2 * tilesize * ratio,
        )
    }
}