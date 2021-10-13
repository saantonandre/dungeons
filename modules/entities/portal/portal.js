import { Entity } from "../../entity/entity.js";
export class Portal extends Entity {
    // A portal which takes you to another room
    constructor(x, y, dir, id) {
        super(x, y);
        this.dir = dir;
        this.id = id;
        this.solid = true;
        this.type = "portal";
        this.background = true;
        this.spriteW = 3;
        this.spriteH = 1;
        this.hitbox = {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h
        };
        this.left = 0;

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
    computeAction(entities) {
        let enemiesAlive = false;
        for (let entity of entities) {
            if (entity.removed) {
                continue;
            }
            if (entity.type == "enemy") {
                enemiesAlive = true;
                break;
            }
        }
        /* 
                if (this.animation == "closed" && !enemiesAlive) {
                    this.animation = "opening";
                }
                if (this.animation == "open" && enemiesAlive) {
                    this.animation = "closing";
                }
                 */
        if (this.animation == "open" || this.animation == "opening") {
            this.solid = false;
        } else {
            this.solid = true;
        }
    }
    /** portal computing */
    computePortal(meta, gameDirector) {
        //
        this.computeAction(gameDirector.level.entities);
        if (!this.solid && this.Physics.collided(this, gameDirector.player)) {
            // Move player to the linked level
            gameDirector.changeLevel(this.dir, meta);
        }
    }
    /** Entity computing */

    compute(deltaTime) {
        this.updateHitbox();
        this.updateSprite(deltaTime);
    }

    onAnimationEnd() {
        switch (this.animation) {
            case "opening":
                this.animation = "open";
                break;
            case "closing":
                this.animation = "closed";
                break;
        }
    }
    render(context, tilesize, ratio, camera) {
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