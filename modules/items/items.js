import { Item } from "./item/item.js";
export class Goo extends Item {
    constructor(owner) {
        super(owner);
        this.name = "goo";
        this.description = "Slime secretions. Sometimes you can feel them twitching in your inventory."
        this.sourceName = this.owner.name;
        this.setAnimation("idle", [1], [21])
    }
}