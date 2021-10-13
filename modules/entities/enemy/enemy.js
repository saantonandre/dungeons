import { Entity } from "../../entity/entity.js";
import { HpBar } from "./hpBar.js";
export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = "enemy";
        this.shadow = true;
        this.maxHp = 10;
        this.hp = this.maxHp;
        this.atk = 1;
        this.dmgFrames = 0;
        this.dead = false;
        this.lv = 1;
        this.expValue = 1;

        this.hpBar = new HpBar(this);
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
    onHit(source) {
        this.state = "damaged";
        this.damaged = source.attackID;
        this.dmgFrames = 5;
        this.hp -= source.atk;
        // atk text
        vfxsManager.create("DmgText", this, source.atk | 0);
        vfxsManager.create("DmgVfx", this);
        if (this.hp <= 0) {
            this.onDeath(source)
            let recipient = source.owner || source;
            recipient.expManager.update(this);
        }
    }
    onDeath() {
        this.dead = true;
        this.removed = true;
    }
}