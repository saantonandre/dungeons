import { Equippable } from "../item/item.js";
export class AccessoryPrototype extends Equippable {
    constructor(source) {
        super(source);
        this.owner = source;
        // To rework later, types and subtypes item -> consumable item -> weapon etc
        this.type = "Accessory";
        this.subtype = "Accessory";
        this.name = "Accessory Prototype";
        this.description = "Something something"

        this.setAnimation("idle", [0], [0]);
        this.setAnimation("idle", [0], [0], 1);
        this.animations['idle'].offsetY = -0.5;


    }
    compute(deltaTime) {}
}