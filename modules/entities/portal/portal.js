import { Entity } from "../../entity/entity.js";
export class Portal extends Entity {
    // A portal which takes you to another room
    constructor(x, y, dir, id) {
        super(x, y);
        this.dir = dir;
        this.id = id;
        this.name = (Math.random() * 100) | 0;
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
        /** Has the player collided with the portal? */
        this.collidedWithPlayer = false;

        this.setAnimation("closed", [15], [19])
        this.setAnimation("opening", [15, 15, 15, 15, 15, 15, 15, 15, 15], [19, 20, 21, 22, 23, 24, 25, 26, 27])
        this.setAnimation("open", [15], [27])
        this.setAnimation("closing", [15, 15, 15, 15, 15, 15, 15, 15, 15], [27, 26, 25, 24, 23, 22, 21, 20, 19])

        for (let animation in this.animations) {
            this.animations[animation].w = this.spriteW;
            this.animations[animation].h = this.spriteH;
        }
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
            if (entity.removed || entity.dead) {
                continue;
            }
            if (entity.type == "enemy") {
                enemiesAlive = true;
                break;
            }
        }
        if (this.animation == "closed" && !enemiesAlive) {
            this.animation = "opening";
            this.sounds['sliding-reversed'].play();
        }
        if (this.animation == "open" && enemiesAlive) {
            this.animation = "closing";
            this.sounds['sliding'].play();

        }
        if (this.animation == "open" || this.animation == "opening") {
            this.solid = false;
        } else {
            this.solid = true;
        }
    }
    /** Portal computing, returns true if changeLevel is called */
    computePortal(meta, gameDirector) {
        this.computeAction(gameDirector.entities);
        if (this.collidedWithPlayer) {
            this.collidedWithPlayer = false;
            // Move player to the linked level
            gameDirector.changeLevel(this.dir, meta);
            return true;
        }
        return false;
    }
    onCollision(source) {
        switch (source.type) {
            case 'player':
                if (!this.solid /** is open */ ) {
                    this.collidedWithPlayer = true;
                    return 'levelChange';
                }
                break;
        }
    }
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
        this.renderSprite(context, tilesize, ratio, camera, (this.rot * Math.PI) / 180)
    }
}
export class FloorPortal extends Portal {
    constructor(x, y, dir, id) {
        super(x, y, dir, id);
        this.stairs = new Stairs(this);
    }
    /** Portal computing, returns true if changeLevel is called */
    computePortal(meta, gameDirector) {
        //
        this.computeAction(gameDirector.entities);
        if (this.collidedWithPlayer) {
            this.collidedWithPlayer = false;
            // Move player to the linked level
            gameDirector.changeFloor(meta);
            return true;
        }
        return false;
    }
    render(context, tilesize, ratio, camera) {
        this.stairs.render(context, tilesize, ratio, camera)
        this.renderSprite(context, tilesize, ratio, camera, (this.rot * Math.PI) / 180)
    }
}
/** Visual component of the FloorPortal */
class Stairs extends Entity {
    constructor(source) {
        super(source.x, source.y);
        this.background = true;
        this.source = source;
        this.setAnimation("idle", [18], [19]);
        this.w = this.source.w == 1 ? 2 : 3;
        this.h = this.source.w == 1 ? 3 : 2;
        this.animations["idle"].w = 3;
        this.animations["idle"].h = 2;
        //Adjusting the sprite pos
        switch (this.source.rot) {
            case 90:
                this.x -= 1;
                break;
            case -90:

                break;
            case 180:
                this.x += 0.5;
                this.y -= 1.5;
                break;
            default:

        }
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera, (this.source.rot * Math.PI) / 180);
    }
}