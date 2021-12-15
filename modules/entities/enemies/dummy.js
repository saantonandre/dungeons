import { Enemy } from "../enemy/enemy.js";
export class Dummy extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.name = "dummy";
        //Stats
        this.stats.atk = 3;
        this.stats.hp = 10000;
        this.stats.expValue = 2;



        this.state = "idle";
        this.animation = "idle";

        this.immovable = false;

        this.solid = true;
        this.setAnimation("idle", [16], [0])
        this.setAnimation("damaged", [16], [1])
    }
    compute(deltaTime, environment) {
        this.updatePosition(deltaTime);
        this.updateHitbox();
        this.updateSprite(deltaTime);
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera)
    }
}