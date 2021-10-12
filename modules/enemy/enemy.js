import { Entity } from "../../entity/entity.js";
export class Enemy extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = "enemy";
        this.shadow = true;
        this.maxHp = 10;
        this.atk = 1;
        this.hp = this.maxHp;
        this.dmgFrames = 0;
        this.dead = false;
        this.lv = 1;
        this.expValue = 1;

        this.pray = false;
        //this.hpBar = new HpBar(this);
        //this.displayName = new DisplayName(this);
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