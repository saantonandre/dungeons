import { Equippable } from "../item/item.js";
export class ArmorPrototype extends Equippable {
    constructor(source) {
        super(source);
        this.owner = source;
        // To rework later, types and subtypes item -> consumable item -> weapon etc
        this.type = "armor";
        this.subtype = "armor";
        this.name = "Armor Prototype";
        this.description = "A sick looking armor which intimidates enemies making it look like you have abs."

        this.setAnimation("idle", [3], [7]);
        this.setAnimation("idle", [4], [7], 1);
        //this.animations['idle'].offsetY = -0.5;


    }
    compute(deltaTime) {
        this.x = this.owner.x;
        this.y = this.owner.y;
        this.left = this.owner.left;
    }
}