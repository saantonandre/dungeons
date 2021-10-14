import { Item } from "./item/item.js";
export class Goo extends Item {
    constructor(owner) {
        super(owner);
        this.name = "goo";
        this.sourceName = this.owner.name;
        this.setAnimation("idle", [1], [21])
    }
}