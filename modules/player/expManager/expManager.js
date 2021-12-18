export class ExpManager {
    constructor(entity) {
        this.owner = entity;
    }
    levelUp() {
        // player.expManager.update({expValue:100})
        this.owner.createVfx("ParticlesVfx", this.owner)
        let stats = this.owner.stats;

        stats.exp -= stats.maxExp;
        stats.maxExp = (stats.maxExp * 1.1 + 5) | 0;
        stats.lv++;

        // Stats increase
        let maxHp = stats.maxHp;
        let maxMana = stats.maxMana;

        stats.maxHp = (stats.maxHp * 1.1 + 1) | 0;
        stats.maxMana = (stats.maxMana + 5) | 0;

        stats.hp += stats.maxHp - maxHp;
        stats.mana += stats.maxMana - maxMana;
        stats.atk = (stats.atk * 1.1 + 1) | 0;

        //vfxsManager.sparkleEntity(this.owner, 60, 1);
        //vfxsManager.create("StatusText", this.owner, "level UP");
    }
    /** Might want to update this system with exp particles rather than off the donor itself */
    update(donor) {
        this.owner.stats.exp += donor.stats.expValue;
        while (this.owner.stats.exp >= this.owner.stats.maxExp) {
            this.levelUp();
        }
    }
}