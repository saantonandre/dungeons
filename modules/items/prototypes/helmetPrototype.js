import { Equippable } from "../item/item.js";
export class HelmetPrototype extends Equippable {
    constructor(source) {
        super(source);
        this.owner = source;
        // To rework later, types and subtypes item -> consumable item -> weapon etc
        this.type = "helmet";
        this.subtype = "helmet";
        this.name = "Helmet Prototype";
        this.description = "An old reconditioned helmet found in your grandpa's house."

        this.setAnimation("idle", [3], [6]);
        this.setAnimation("idle", [4], [6], 1);
        this.animations['idle'].offsetY = -0.3;

        // Stats that will attach to the owner
        this.stats.atkSpeed = 5;
        this.stats.maxMana = 5;
        this.stats.maxHp = 5;

    }
    compute(deltaTime) {
        this.x = this.owner.x;
        this.y = this.owner.y;
        this.left = this.owner.left
        if (this.owner.frame > 1) {
            this.animations['idle'].offsetY = -0.3;
        } else {
            this.animations['idle'].offsetY = -0.4;
        }
    }
}