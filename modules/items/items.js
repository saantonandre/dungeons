import { Item } from "./item/item.js";
export class Goo extends Item {
    constructor(source) {
        super(source);
        this.name = "Goo";
        this.description = "Slime secretions. Sometimes you can feel them twitching in your inventory."
        this.setAnimation("idle", [1], [21])
    }
}
export class Bone extends Item {
    constructor(source) {
        super(source);
        this.name = "Slime Bone";
        this.rarity = "rare";
        this.description = "While invertabrates, some slimes do have bones. Just not properly -theirs-."
        this.setAnimation("idle", [1], [22])
    }
}