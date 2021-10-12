import { Entity } from "../../entity/entity.js";
export class Portal extends Entity {
    // A portal which takes you to another room
    constructor(x, y, dir, id) {
        super(x, y);
        this.dir = dir;
        this.id = id;
        this.solid = false;
        this.type = "portal";
        this.background = true;
        this.spriteW = 3;
        this.spriteH = 1;
        this.hitbox = false;

        this.animation = "open";
        this.setAnimation("closed", [15], [19])
        this.setAnimation("opening", [15, 15, 15, 15, 15, 15, 15, 15, 15], [19, 20, 21, 22, 23, 24, 25, 26, 27])
        this.setAnimation("open", [15], [27])
        this.setAnimation("closing", [15, 15, 15, 15, 15, 15, 15, 15, 15], [27, 26, 25, 24, 23, 22, 21, 20, 19])


        this.rot = 0;
        if (this.dir[0]) {
            if (this.dir[0] == 1) {
                // portal to the right
                this.rot = 90;
            } else {
                // portal to the left
                this.rot = -90;
            }
        } else {
            if (this.dir[1] == 1) {
                // portal to the bottom
                this.rot = 180;
            } else {
                // portal to the top
                this.rot = 0;
            }
        }
    }
    computeAction() {
        let enemiesAlive = false;
        for (let entity of map.entities) {
            if (entity.removed) {
                continue;
            }
            if (entity.type == "enemy") {
                enemiesAlive = true;
                break;
            }
        }

        if (this.action == 0 && !enemiesAlive) {
            this.action = 1;
        }
        if (this.action == 2 && enemiesAlive) {
            this.action = 3;
        }
    }
    compute() {
        /* 

        if (!this.solid && collided(this, player)) {
            // Move player to the linked level
            gameDirector.changeLevel(this.dir, meta);
        }
 */
        //this.computeAction();
    }
    onAnimationEnd() {
        switch (this.animation) {
            case "opening":
                this.action = "open";
                this.solid = false;
                break;
            case "closing":
                this.action = "closed";
                this.solid = true;
                break;
        }
    }
    render(context, tilesize, ratio, camera) {
        this.updateSprite();
        if (this.removed) {
            // If the entity is removed, don't bother rendering
            return;
        }
        context.save();
        context.translate(
            (this.x + this.w / 2 + camera.x) * tilesize * ratio,
            (this.y + this.h / 2 + camera.y) * tilesize * ratio
        );
        context.rotate((this.rot * Math.PI) / 180);
        context.drawImage(
            this.sheet, // source of the sprite
            this.animations[this.animation].keyframesX[this.left][this.frame] * tilesize, // x pos of the sprite
            this.animations[this.animation].keyframesY[this.left][this.frame] * tilesize, // y pos of the sprite
            this.spriteW * tilesize, // width of the sprite
            this.spriteH * tilesize, // height of the sprite
            (-this.spriteW / 2) * tilesize * ratio, // x of the entity
            (-this.spriteH / 2) * tilesize * ratio, // y of the entity
            this.spriteW * tilesize * ratio, // width of the entity
            this.spriteH * tilesize * ratio // height of the entity
        );
        context.restore();
    }
}