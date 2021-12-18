import { Entity } from "../../entity/entity.js";

/** Item prototype */
export class Item extends Entity {
    constructor(source = { name: "unknown", x: 0, y: 0 }) {
        super(0, 0);
        this.shadow = true;
        this.source = source;
        this.solid = false;
        this.name = "Item prototype";
        this.sourceName = this.source.name;
        this.type = "item";
        this.rarity = "common";

        // Stats resetting
        this.stats = new ItemStats();

        this.equippable = false;
        this.stackable = true;
        this.collected = false;

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

    onCollision(source) {
        switch (source.type) {
            case 'player':
                if (source.inventory.pickUp(this)) {
                    this.store();
                }
                break;
        }
    }
    /** Removes itself from the source drops array and goes to the entities array */
    dispatch(environment) {
        this.x = this.source.x;
        this.y = this.source.y;

        // Changes this environment
        environment.push(this)
        this.environment = environment;
        this.collected = false;
        this.removed = false;

    }
    /** Removes itself from the entities array */
    store() {
        this.animations['idle'].offsetX = 0;
        this.animations['idle'].offsetY = 0;
        this.collected = true;
        this.removed = true;
        this.sounds['pick-up'].play()
    }
    /** Makes the item appear levitating */
    levitate(deltaTime) {
        this.animations["idle"].offsetY = Math.sin(this.sinIncrease += this.sinVel * deltaTime) / 10;
    }
    compute(deltaTime, environment) {
        this.levitate(deltaTime);
        this.updateVelocities(deltaTime);
        this.updatePosition(deltaTime);
        this.updateHitbox();
    }
}
/** Class representing an item's stats */
class ItemStats {
    constructor() {
        this.atk = 0;
        this.atkSpeed = 0;
        this.maxHp = 0;
        this.maxMana = 0;
    }
}


/** Class representing an Equippable item */
export class Equippable extends Item {
    constructor(source) {
        super(source);
        this.owner = source;
        this.equippable = true;
        /** helmet, armor, weapon, accessory */
        this.type = "";
    }
    equip(owner) {
        this.owner = owner;
    }
    render(context, tilesize, ratio, camera) {
        this.left = this.owner.left;
        this.x = this.owner.x;
        this.y = this.owner.y;
        this.renderSprite(context, tilesize, ratio, camera);
    }
}