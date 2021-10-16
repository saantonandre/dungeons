import { Entity } from "../../entity/entity.js";

/** Item prototype */
export class Item extends Entity {
    constructor(owner) {
        super(0, 0);
        this.shadow = true;
        this.owner = owner;
        this.solid = false;
        this.type = "item";
        this.flying = false;
        this.description = "Item description. This is an item description. Should have searched for a Lorem Ipsum but felt creative enough to do this myself."
        // Placeholder animation
        this.setAnimation("idle", [7], [10])


        this.offsetX = 0;
        this.offsetY = 0;
        this.sinIncrease = 0;
        this.sinVel = 0.1;
        this.xVelExt = (Math.random() - 0.5) / 40;
        this.yVelExt = (Math.random() - 0.5) / 40;
        this.friction = 0.98;

    }
    /** Removes itself from the owner drops array and goes to the entities array */
    dispatch(environment) {
        this.x = this.owner.x;
        this.y = this.owner.y;

        // Changes this environment
        environment.push(this)
        this.environment = environment;

        this.owner = {};
    }
    /** Removes itself from the entities array */
    store() {
        this.scheduledDeletion = true;
        this.animations['idle'].offsetX = 0;
        this.animations['idle'].offsetY = 0;
    }
    /** Makes the item appear levitating */
    levitate(deltaTime) {
        this.animations["idle"].offsetY = Math.sin(this.sinIncrease += this.sinVel * deltaTime) / 10;
    }
    compute(deltaTime) {
        this.levitate(deltaTime);
        this.updatePosition(deltaTime);
        this.updateHitbox();
    }
}