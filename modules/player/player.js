import { Entity } from "../entity/entity.js";

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
        this.maxHp = 10;
        this.hp = this.maxHp;

        this.maxMana = 10;
        this.mana = this.maxMana;
        this.controls = director.controls;
        this.maxExp = 10;
        this.exp = 0;
        this.lv = 1;

        this.atk = 1;

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


        this.equipment = new EquipmentManager(this);
        this.inventory = new InventoryManager(this);
        this.userInterface = new UserInterface(this);

        this.hitboxOffset.x = 0.2;
        this.hitboxOffset.y = 0.4;
        this.hitboxOffset.w = -0.4;
        this.hitboxOffset.h = -0.4;
    }
    compute(deltaTime, environment) {
        this.updateSprite(deltaTime);
        this.resolveInput();
        this.updatePosition(deltaTime);
        this.updateHitbox();
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
        /* 
                if (this.attacking) {
                    return;
                } */
        this.attacking = true;
        if (special) {
            this.equipment.weapon.special(this.director.mouse)
        } else {
            this.equipment.weapon.attack(this.director.mouse)
        }
    }
    onHit(source) {
        if (this.damaged > 0) {
            return;
        }
        this.damaged = 10;
        this.director.camera.shake = 10;
        this.hp -= source.atk;
        if (this.hp < 0) {
            this.hp = 0;
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

        if (this.controls.lClickDown) {
            this.attack();
        }

        if (this.controls.rClickDown) {
            this.attack(true);
        }
    }
}