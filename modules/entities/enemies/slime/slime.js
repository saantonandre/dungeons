import { Enemy } from "../../enemy/enemy.js";
export class Slime extends Enemy {
    constructor(x, y) {
        super(x, y);
        this.attackRange = 3;
        this.windupFrames = 60;
        this.left = (Math.random() * 2) | 0;
        this.baseSpeed = 0.03;
        this.speed = this.baseSpeed;
        this.name = "slime";

        //Stats
        this.atk = 5;
        this.expValue = 2;
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

        this.hitboxOffset.y = 0.3;
        this.hitboxOffset.h = -0.4;

    }
    compute(deltaTime, environment) {
        this.searchPrey(environment);
        this.computeState(deltaTime);
        this.updatePosition(deltaTime);
        this.updateHitbox();
        this.checkCollisions(this, environment);
        this.updateSprite(deltaTime);
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera)
    }
    computeState(deltaTime) {
        if (this.xVel > 0) {
            this.left = 0;
        } else if (this.xVel < 0) {
            this.left = 1;
        }
        let rotation, xTarget, yTarget;
        switch (this.state) {
            case "idle":
                this.animation = "idle";
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
                this.animation = "moving";
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
                this.animation = "moving";
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
                this.animation = "windup";
                this.xVel = 0;
                this.yVel = 0;
                this.windupFrames -= deltaTime;
                if (this.windupFrames <= 0) {
                    this.state = "attack";
                    this.windupFrames = 30;
                    this.attackFrames = 30;
                    this.targetRot = this.Physics.getRotation(this, this.prey);
                }
                break;
            case "damaged":
                this.animation = "damaged";
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
                this.animation = "attack";
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
        }
    }
    onCollision(collidedEntity) {
        if (collidedEntity === this.prey && this.state === "attack") {

            collidedEntity.onHit(this);
            collidedEntity.xVelExt = this.xVel;
            collidedEntity.yVelExt = this.yVel;
            this.fleeing = 120;
            this.state = "flee";
        }
    }
}