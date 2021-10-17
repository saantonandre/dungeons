import { Item } from "./item/item.js";
export class Goo extends Item {
    constructor(owner) {
        super(owner);
        this.name = "Goo";
        this.description = "Slime secretions. Sometimes you can feel them twitching in your inventory."
        this.sourceName = this.owner.name;
        this.setAnimation("idle", [1], [21])
    }
}
export class Bone extends Item {
    constructor(owner) {
        super(owner);
        this.name = "Slime Bone";
        this.rarity = "rare";
        this.description = "While invertabrates, some slimes do have bones. Just not properly -theirs-."
        this.sourceName = this.owner.name;
        this.setAnimation("idle", [1], [22])
    }
}