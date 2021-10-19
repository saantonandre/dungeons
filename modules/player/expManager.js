export class ExpManager {
    constructor(entity) {
        this.owner = entity;
    }
    levelUp() {
        /*
        player.expManager.update({expValue:100})
        */
        this.owner.exp -= this.owner.maxExp;
        this.owner.maxExp = (this.owner.maxExp * 1.1 + 5) | 0;
        this.owner.lv++;

        // Stats increase
        let maxHp = this.owner.maxHp;
        let maxMana = this.owner.maxMana;

        this.owner.maxHp = (this.owner.maxHp * 1.1 + 1) | 0;
        this.owner.maxMana = (this.owner.maxMana + 5) | 0;

        this.owner.hp += this.owner.maxHp - maxHp;
        this.owner.mana += this.owner.maxMana - maxMana;
        this.owner.stats.atk *= 1.1 + 1;

        //vfxsManager.sparkleEntity(this.owner, 60, 1);
        //vfxsManager.create("StatusText", this.owner, "level UP");
    }
    /** Might want to update this system with exp particles rather than off the donor itself */
    update(donor) {
        this.owner.exp += donor.expValue;
        while (this.owner.exp >= this.owner.maxExp) {
            this.levelUp();
        }
    }
}