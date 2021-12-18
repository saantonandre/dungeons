import { Enemy } from "./../../enemy/enemy.js";
export class Bat extends Enemy {
    constructor(x, y) {
        super(x, y);

        this.attackRange = 3;
        this.windupFrames = 60;
        this.left = (Math.random() * 2) | 0;
        this.baseSpeed = 0.05;
        this.speed = this.baseSpeed;
        this.name = "bat";

        //Stats
        this.stats.atk = 3;
        this.stats.expValue = 3;


        this.aggroRange = 5;
        this.dashSpeed = 4;
        this.fleeing = 0;

        this.grounded = false;

        this.rotX = 0;
        this.rotY = 0;
        this.movRotation = 0;
        this.targetRot = 0;
        /* 
          0 = idle
        */

        this.immovable = false;
        this.state = "idle";
        this.animation = "idle";
        this.setAnimation("idle", [2, 2, 2, 2], [15, 16, 17, 18])
    }
    computeState(deltaTime) {
        let rotation, xTarget, yTarget;
        switch (this.state) {
            case "idle":
                this.xVel = this.rotX * this.speed;
                this.yVel = this.rotY * this.speed;
                if (this.Physics.distance(this, this.prey) < this.aggroRange) {
                    this.state = "chase";
                }
                break;
            case "chase":
                rotation = this.Physics.getRotation(this, this.prey);
                xTarget = Math.cos(rotation);
                yTarget = Math.sin(rotation);

                this.xVel = (xTarget + this.rotX) * this.speed;
                this.yVel = (yTarget + this.rotY) * this.speed;
                break;
            case "flee":
                rotation = this.Physics.getRotation(this, this.prey);
                xTarget = -Math.cos(rotation);
                yTarget = -Math.sin(rotation);

                this.xVel = xTarget * this.speed;
                this.yVel = yTarget * this.speed;
                this.fleeing -= deltaTime;
                if (
                    this.Physics.distance(this, this.prey) > this.attackRange * 2 ||
                    this.fleeing <= 0
                ) {
                    this.fleeing = 0;
                    this.state = "idle";
                }
                break;
            case "damaged":
                this.xVel = 0;
                this.yVel = 0;
                if (this.dmgFrames > 0) {
                    this.dmgFrames -= deltaTime;
                } else {
                    this.state = "idle";
                }
                break;
            case "dead":
                this.removed = true;
                break;
        }
    }
    compute(deltaTime, environment) {
        if (this.state !== "damaged") {
            this.movRotation += deltaTime / 10;
            this.rotX = Math.cos(this.movRotation);
            this.rotY = Math.sin(this.movRotation);
        }
        this.searchPrey(environment);
        this.computeState(deltaTime);
        this.updateVelocities(deltaTime);
        this.checkCollisions(this, environment, deltaTime)
        this.updatePosition(deltaTime);
        this.updateHitbox();
        this.updateSprite(deltaTime);
    }
    onCollision(collidedEntity) {
        if (collidedEntity === this.prey && this.state === "chase") {
            collidedEntity.xVelExt = this.xVel;
            collidedEntity.yVelExt = this.yVel;
            collidedEntity.onHit(this);
            this.fleeing = 120;
            this.state = "flee";
        }
    }
    render(context, tilesize, ratio, camera) {
        this.renderSprite(context, tilesize, ratio, camera)
    }
}