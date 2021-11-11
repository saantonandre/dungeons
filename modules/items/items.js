import { Item, Equippable } from "./item/item.js";
import { SwordPrototype } from "./prototypes/swordPrototype.js";
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
export class LeatherShoes extends Equippable {
    constructor(source) {
        super(source);
        this.name = "Leather Shoes";
        this.rarity = "rare";
        this.type = "accessory";
        this.description = "Light and comfortable shoes."
        this.setAnimation("idle", [15], [1])
    }
    compute() {
        this.owner.xVel *= 3;
        this.owner.yVel *= 3;
    }
    render() {

    }
}
export class MemeSword extends SwordPrototype {
    constructor(source) {
        super(source);
        this.name = "Memelord's sword";
        this.sourceName = "some memelord?"
        this.description = "Le mao 💀"
        this.stats.atkSpeed = 5000;
        this.stats.atk = 100;
        this.setAnimation("idle", [10], [2]);
        this.setAnimation("idle", [10], [3], 1);

        this.setAnimation("attack", [10], [4]);
        this.setAnimation("attack", [10], [5], 1);
    }
}