import { Item } from "../item/item.js";
export class SwordPrototype extends Item {
    constructor(owner) {
        super();
        this.owner = owner;

        this.w = 1;
        this.h = 1;

        this.setAnimation("idle", [11], [2]);
        this.setAnimation("idle", [11], [3], 1);

        this.setAnimation("attack", [11], [4]);
        this.setAnimation("attack", [11], [5], 1);
        // collider is one line
        this.collider = {
            a: [0, 0],
            b: [0, 0]
        }
        this.offsetX = 0;
        this.offsetY = 0;
    }
    attack(mousePos) {

    }
    compute(deltaTime, environment) {
        this.left = this.owner.left;
        this.x = this.owner.x + this.left - this.w / 2;
        this.y = this.owner.y - (this.h - this.owner.h);
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera);
    }
}