import { spritesheet } from "../resourceManager.js";
export class Sprite {
    constructor(x, y, w = 1, h = 1) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.sheet = spritesheet;
        this.animation = "idle";
        this.animations = {};
        this.frame = 0;
        this.left = 0;
        this.frameCounter = 0;
        this.setAnimation("idle", [0], [0]);


    }
    onAnimationEnd() {
        // What happens after the current animation ends
    }
    updateSprite(deltaTime) {
        this.frameCounter += deltaTime;
        if (this.frameCounter >= this.animations[this.animation].slowness) {
            this.frame++;
            this.frameCounter = 0;
        }
        if (this.frame >= this.animations[this.animation].keyframesX[this.left].length) {
            this.frame = 0;
            this.frameCounter = 0;
            this.onAnimationEnd();
        }
    }
    setAnimation(label, keyframesX, keyframesY, left = 0) {
        if (!this.animations[label]) {
            this.animations[label] = new Animation(this);
        }
        if (left) {
            this.animations[label].keyframesX[1] = keyframesX;
            this.animations[label].keyframesY[1] = keyframesY;
        } else {
            this.animations[label].keyframesX[0] = keyframesX;
            this.animations[label].keyframesY[0] = keyframesY;

            this.animations[label].keyframesX[1] = keyframesX;
            this.animations[label].keyframesY[1] = keyframesY;
        }

    }
    renderSprite(context, tilesize, ratio, camera, rot = false) {

        if (!this.display) {
            // If the entity is removed, don't bother rendering
            return;
        }

        // Offset given by the difference of the animation relative to the actual width/height of the entity
        if (rot) {
            context.save();
            context.translate(
                (this.x + this.animations[this.animation].offsetX + this.w / 2 + camera.x) * tilesize * ratio,
                (this.y + this.animations[this.animation].offsetY + this.h / 2 + camera.y) * tilesize * ratio
            )
            //
            context.rotate(rot);
            context.drawImage(
                this.sheet, // source of the sprite
                this.animations[this.animation].keyframesX[this.left][this.frame] * tilesize, // x pos of the sprite
                this.animations[this.animation].keyframesY[this.left][this.frame] * tilesize, // y pos of the sprite
                this.animations[this.animation].w * tilesize, // width of the sprite
                this.animations[this.animation].h * tilesize, // height of the sprite
                (-this.animations[this.animation].w / 2) * tilesize * ratio, // x of the entity
                (-this.animations[this.animation].h / 2) * tilesize * ratio, // y of the entity
                this.animations[this.animation].w * tilesize * ratio, // width of the entity
                this.animations[this.animation].h * tilesize * ratio // height of the entity
            );
            context.restore();
        } else {
            context.drawImage(
                this.sheet, // source of the sprite
                this.animations[this.animation].keyframesX[this.left][this.frame] * tilesize, // x pos of the sprite
                this.animations[this.animation].keyframesY[this.left][this.frame] * tilesize, // y pos of the sprite
                this.animations[this.animation].w * tilesize, // width of the sprite
                this.animations[this.animation].h * tilesize, // height of the sprite
                (this.x + this.animations[this.animation].offsetX + camera.x) * tilesize * ratio, // x of the entity
                (this.y + this.animations[this.animation].offsetY + camera.y) * tilesize * ratio, // y of the entity
                this.animations[this.animation].w * tilesize * ratio, // width of the entity
                this.animations[this.animation].h * tilesize * ratio // height of the entity
            );
        }
    }

}
class Animation {
    constructor(entity) {
        this.keyframesX = [
                [],
                []
            ],
            this.keyframesY = [
                [],
                []
            ],
            this.slowness = 6,
            this.w = entity.w,
            this.h = entity.h,
            this.offsetX = (entity.w - this.w) / 2,
            this.offsetY = (entity.h - this.h) / 2
    }
}