import { Enemy } from "../../enemy/enemy.js";
import { Goo, Bone } from "../../../items/items.js"
export class Slime extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.attackRange = 3;
        this.windupFrames = 60;
        this.left = (Math.random() * 2) | 0;
        this.baseSpeed = 0.03;
        this.speed = this.baseSpeed;
        this.name = "slime";

        // Drops
        if (Math.random() * 100 < 60) {
            this.drops.push(new Goo(this));
        };
        if (Math.random() * 100 < 20) {
            this.drops.push(new Bone(this));
        };


        //Stats
        this.stats.atk = 3;
        this.stats.expValue = 2;



        this.aggroRange = 10;
        this.targetRot = 0;
        this.dashSpeed = 4;
        this.fleeing = 0;
        this.state = "idle";
        this.animation = "idle";

        this.immovable = false;

        this.solid = true;


        let leftSprite = 1;
        //this.setAnimation("idle", [0], [15])
        //this.setAnimation("idle", [1], [15], leftSprite)
        this.setAnimation("idle", [0, 0, 0], [15, 16, 17])
        this.setAnimation("idle", [1, 1, 1], [15, 16, 17], leftSprite)
        this.animations["idle"].slowness = 9;

        this.setAnimation("moving", [0, 0, 0], [15, 16, 17])
        this.setAnimation("moving", [1, 1, 1], [15, 16, 17], leftSprite)

        this.setAnimation("damaged", [0], [18])
        this.setAnimation("damaged", [1], [18], leftSprite)

        this.setAnimation("windup", [0, 0], [16, 19])
        this.setAnimation("windup", [1, 1], [16, 19], leftSprite)

        this.setAnimation("attack", [0], [20])
        this.setAnimation("attack", [1], [20], leftSprite)

        this.setAnimation("death", [0, 0, 0, 0], [21, 23, 25, 27])
        this.animations["death"].slowness = 8;
        this.animations["death"].h = 2;
        this.animations["death"].offsetY = -0.5;


        this.hitboxOffset.y = 0.3;
        this.hitboxOffset.h = -0.4;

    }
    compute(deltaTime, environment) {
        this.searchPrey(environment);
        this.computeState(deltaTime);
        this.updateVelocities(deltaTime);
        this.checkCollisions(this, environment, deltaTime)
        this.updatePosition(deltaTime);
        this.updateHitbox();
        this.updateSprite(deltaTime);
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera)
    }
    computeState(deltaTime) {
        let rotation, xTarget, yTarget;
        switch (this.state) {
            case "idle":
                this.loadAnimation("idle");
                this.xVel = 0;
                this.yVel = 0;

                if (this.prey && this.Physics.distance(this, this.prey) < this.aggroRange) {
                    this.state = "chase";
                }
                break;
            case "flee":
                rotation = this.Physics.getRotation(this, this.prey);
                xTarget = -Math.cos(rotation);
                yTarget = -Math.sin(rotation);

                this.xVel = xTarget * this.speed;
                this.yVel = yTarget * this.speed;
                this.loadAnimation("moving");
                this.fleeing -= deltaTime;
                if (
                    this.Physics.distance(this, this.prey) > this.attackRange * 2 ||
                    this.fleeing <= 0
                ) {
                    this.fleeing = 0;
                    this.state = "idle";
                }
                break;
            case "chase":
                this.loadAnimation("moving");
                rotation = this.Physics.getRotation(this, this.prey);
                xTarget = Math.cos(rotation);
                yTarget = Math.sin(rotation);

                this.xVel = xTarget * this.speed;
                this.yVel = yTarget * this.speed;
                if (this.Physics.distance(this, this.prey) < this.attackRange) {
                    this.state = "windup";
                }
                break;
            case "windup":
                this.loadAnimation("windup");
                this.xVel = 0;
                this.yVel = 0;
                this.windupFrames -= deltaTime;
                if (this.windupFrames <= 0) {
                    this.sounds.playRandom(['bounce1', 'bounce2', 'bounce3', 'bounce4'])
                    this.state = "attack";
                    this.windupFrames = 30;
                    this.attackFrames = 30;
                    this.targetRot = this.Physics.getRotation(this, this.prey);
                }
                break;
            case "damaged":
                this.loadAnimation("damaged");
                this.xVel = 0;
                this.yVel = 0;
                this.windupFrames = 30;
                if (this.dmgFrames > 0) {
                    this.dmgFrames -= deltaTime;
                } else {
                    this.state = "idle";
                }
                break;
            case "attack":
                this.loadAnimation("attack");
                rotation = this.targetRot;
                xTarget = Math.cos(rotation);
                yTarget = Math.sin(rotation);

                this.xVel = xTarget * this.speed * this.dashSpeed;
                this.yVel = yTarget * this.speed * this.dashSpeed;
                if (this.attackFrames > 0) {
                    this.attackFrames -= deltaTime;
                } else {
                    this.state = "idle";
                    this.speed = this.baseSpeed;
                }
                break;
            case "dead":
                this.loadAnimation("death");
                break;
        }
        if (this.xVel > 0) {
            this.left = 0;
        } else if (this.xVel < 0) {
            this.left = 1;
        }
    }
    onAnimationEnd() {
        // What happens after the current animation ends
        switch (this.animation) {
            case "death":
                this.display = false;
                this.removed = true;
                break;
        }
    }
    onCollision(collidedEntity, environment) {
        if (collidedEntity === this.prey && this.state === "attack") {

            collidedEntity.onHit(this);
            collidedEntity.xVelExt += this.xVel;
            collidedEntity.yVelExt += this.yVel;
            this.fleeing = 120;
            this.state = "flee";

            /** Create the damage vfx */
            let dmgText = this.createVfx("TextVfx", collidedEntity)
            dmgText.text.content = `${this.atk}`;
            dmgText.text.color = '#f5ffe8'; /** White */
        }
    }
}