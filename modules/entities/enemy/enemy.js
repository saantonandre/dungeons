import { Entity } from "../../entity/entity.js";
import { EnemyHpBar } from "./enemyHpBar.js";
import { DisplayName } from "./displayName.js";
export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = "enemy";
        this.shadow = true;
        this.dmgFrames = 0;
        this.dead = false;


        this.expValue = 1;

        this.hpBar = new EnemyHpBar(this);
        this.displayName = new DisplayName(this);
        this.prey = false;
        this.immovable = true;

        //this.hpBar = new HpBar(this);
        //this.displayName = new DisplayName(this);
    }
    searchPrey(environment) {
        if (this.prey) {
            return;
        }
        for (let entity of environment) {
            if (entity.type === "player") {
                this.prey = entity;
                return;
            }
        }
    }
    onHit(source, executioner) {
        if (this.state === "dead") { return }
        this.state = "damaged";
        this.damaged = source.attackID;
        this.dmgFrames = 5;
        this.stats.hp -= source.atk;
        // atk vfx
        //vfxsManager.create("DmgVfx", this);
        if (this.stats.hp <= 0) {
            this.stats.hp = 0;
            this.onDeath(executioner)
            //let recipient = source.owner || source;
            //recipient.expManager.update(this);
        }
    }
    onDeath(executioner) {
        executioner.expManager.update(this);
        this.state = "dead";
        this.solid = false;
        this.xVel = 0;
        this.yVel = 0;
        this.xVel = 0;
        this.yVel = 0;
    }
}