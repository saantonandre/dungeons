import { Entity } from "../entity/entity.js";

import { ExpManager } from "./expManager.js";

import { EquipmentManager } from "./equipmentManager/equipmentManager.js";
import { InventoryManager } from "./inventoryManager/inventoryManager.js";
import { UserInterface } from "./userInterface/userInterface.js";
export class Player extends Entity {
    constructor(x = 7.5, y = 7.5, director) {
        super(x, y);
        this.type = "player";

        /** A reference to the game director. 
         * Needed for:
         * - Changing levels
         */
        this.director = director;

        /** Side which the player is facing */
        this.facing = "r";

        /* STATS */
        this.stats.maxHp = 10;
        this.stats.hp = this.stats.maxHp;
        this.stats.maxMana = 15;
        this.stats.mana = this.stats.maxMana;
        this.stats.atk = 1;
        this.stats.atkSpeed = 1;
        this.stats.maxExp = 5;
        this.stats.exp = 0;


        this.controls = director.controls;
        this.expManager = new ExpManager(this);


        this.baseSpeed = 0.08;
        this.speed = this.baseSpeed;

        this.attacking = false;


        /** Invincibility frames amount */
        this.damaged = 0;

        this.shadow = true;
        this.immovable = false;
        this.animation = "idle";
        this.setAnimation("idle", [0, 0, 0, 0], [6, 7, 8, 9]);
        this.setAnimation("idle", [1, 1, 1, 1], [6, 7, 8, 9], 1);
        this.setAnimation("fall", [0], [10]);
        this.setAnimation("broke", [0], [11]);
        this.state = 'normal';

        this.equipment = new EquipmentManager(this);
        this.inventory = new InventoryManager(this);
        this.userInterface = new UserInterface(this);

        this.hitboxOffset.x = 0.2;
        this.hitboxOffset.y = 0.4;
        this.hitboxOffset.w = -0.4;
        this.hitboxOffset.h = -0.4;

        this.stateCounter = 0;
        this.targetX = 0;
        this.targetY = 0;

    }
    get atk() { return this.stats.atk + this.equipment.atk }
    get atkSpeed() { return this.stats.atkSpeed * this.equipment.atkSpeed }
    /** Activates the falling animation, which triggers on floor change */
    fall() {
        this.updateHitbox();
        this.targetY = this.y;
        this.y = -10;
        this.solid = false;
        this.yVel = 0.7;
        this.state = 'fall';
        this.animation = 'fall';
        this.stateCounter = 0;
        //this.equipment.weapon.display = false;
        this.shadow = false;
        this.equipment.display = false;
    }
    computeFalling(deltaTime) {
        if (this.y + this.yVel * deltaTime > this.targetY) {
            this.y = this.targetY;
            this.state = 'broke'
            this.animation = 'broke';
            this.yVel = 0;
            this.director.camera.shake = 10;
        }
    }
    recoverState() {
        this.stateCounter = 0;
        this.state = 'normal';
        this.animation = 'idle';
        this.equipment.display = true;
        //this.equipment.weapon.display = true;
    }
    computeBroke(deltaTime) {
        this.shadow = true;
        this.solid = true;
        this.animation = 'broke';
        //this.equipment.weapon.display = false;
        this.stateCounter += deltaTime;
        if (this.controls.left || this.controls.right || this.controls.up || this.controls.down || this.controls.lClickDown || this.controls.rClickDown) {
            this.recoverState();
            return;
        }
        if (this.stateCounter >= 60) {
            this.recoverState();
        }
    }
    computeState(deltaTime) {
        switch (this.state) {
            case 'normal':
                this.resolveInput();
                this.updatePosition(deltaTime);
                this.updateHitbox();
                break;
            case 'fall':
                this.computeFalling(deltaTime);
                this.updatePosition(deltaTime);
                break;
            case 'broke':
                this.computeBroke(deltaTime)
                break;
        }
    }
    compute(deltaTime, environment) {
        this.inventory.compute(deltaTime);
        this.updateSprite(deltaTime);

        this.computeState(deltaTime);

        this.checkCollisions(this, environment, false, false)

        this.equipment.compute(deltaTime, environment);
        if (this.damaged > 0) {
            this.damaged -= deltaTime;
        }
    }
    render(context, tilesize, ratio, camera) {
        if (this.damaged > 0 && (this.damaged | 0) % 2) {
            return;
        }
        this.renderSprite(context, tilesize, ratio, camera);
        this.equipment.render(context, tilesize, ratio, camera);
    }
    attack(special = false) {
        this.equipment.handleAttack(special, this.director.mouse);
    }
    onHit(source) {
        if (this.damaged > 0) {
            return;
        }
        this.damaged = 10;
        this.director.camera.shake = 10;
        this.stats.hp -= source.stats.atk;
        if (this.stats.hp < 0) {
            this.stats.hp = 0;
        }
    }
    resolveInput() {
        // Moves
        if (this.controls.left && !this.controls.right && !this.col.L) {
            this.facing = "l";
            this.xVel = -this.speed;
            this.left = 1;
        } else if (this.xVel < 0) {
            this.xVel = 0;
        }
        if (this.controls.right && !this.controls.left && !this.col.R) {
            this.facing = "r";
            this.xVel = this.speed;
            this.left = 0;
        } else if (this.xVel > 0) {
            this.xVel = 0;
        }
        if (this.controls.up && !this.controls.down && !this.col.B) {
            this.facing = "t";
            this.yVel = -this.speed;
        } else if (this.yVel < 0) {
            this.yVel = 0;
        }
        if (this.controls.down && !this.controls.up && !this.col.T) {
            this.facing = "b";
            this.yVel = this.speed;
        } else if (this.yVel > 0) {
            this.yVel = 0;
        }
        if (!this.controls.left && !this.controls.right && !this.controls.up && !this.controls.down) {
            this.xVel = 0;
            this.yVel = 0;
        }
        if (this.controls.left + this.controls.right + this.controls.up + this.controls.down > 1) {
            this.xVel /= 1.42;
            this.yVel /= 1.42;
        }

        if (!this.director.mouse.absolute.hoverUI) {
            if (this.controls.lClickDown) {
                this.attack();
            }

            if (this.controls.rClickDown) {
                this.attack(true);
            }
        }
    }
}