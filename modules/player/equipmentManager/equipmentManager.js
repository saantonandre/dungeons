// These import are for testing purposes only
import { SwordPrototype } from "../../items/prototypes/swordPrototype.js"
import { HelmetPrototype } from "../../items/prototypes/helmetPrototype.js"
import { ArmorPrototype } from "../../items/prototypes/armorPrototype.js"

export class EquipmentManager {
    constructor(owner) {
        this.owner = owner;

        this.weaponSlot = new EquipmentSlot("weapon", this.owner);
        this.weaponSlot.assign(new SwordPrototype());

        this.helmetSlot = new EquipmentSlot("helmet", this.owner);
        this.helmetSlot.assign(new HelmetPrototype());

        this.armorSlot = new EquipmentSlot("armor", this.owner);
        this.armorSlot.assign(new ArmorPrototype());

        this.accessorySlot = new EquipmentSlot("accessory", this.owner);

        this.display = true;
    }
    /** Combined attack power of the equipment */
    get atk() {
        let stat = 'atk';

        let weaponSlot = this.weaponSlot.isEmpty ? 0 : this.weaponSlot.item.stats[stat];
        let helmetSlot = this.helmetSlot.isEmpty ? 0 : this.helmetSlot.item.stats[stat];
        let armorSlot = this.armorSlot.isEmpty ? 0 : this.armorSlot.item.stats[stat];
        let accessorySlot = this.accessorySlot.isEmpty ? 0 : this.weaponSlot.item.stats[stat];

        return weaponSlot + helmetSlot + armorSlot + accessorySlot;
    }
    /** Combined attack power of the equipment */
    get atkSpeed() {
        let stat = 'atkSpeed';

        let weaponSlot = this.weaponSlot.isEmpty ? 0 : this.weaponSlot.item.stats[stat];
        let helmetSlot = this.helmetSlot.isEmpty ? 0 : this.helmetSlot.item.stats[stat];
        let armorSlot = this.armorSlot.isEmpty ? 0 : this.armorSlot.item.stats[stat];
        let accessorySlot = this.accessorySlot.isEmpty ? 0 : this.accessorySlot.item.stats[stat];

        return weaponSlot + helmetSlot + armorSlot + accessorySlot;
    }
    /** Combined maxHp of the equipment */
    get maxHp() {
        let stat = 'maxHp';

        let weaponSlot = this.weaponSlot.isEmpty ? 0 : this.weaponSlot.item.stats[stat];
        let helmetSlot = this.helmetSlot.isEmpty ? 0 : this.helmetSlot.item.stats[stat];
        let armorSlot = this.armorSlot.isEmpty ? 0 : this.armorSlot.item.stats[stat];
        let accessorySlot = this.accessorySlot.isEmpty ? 0 : this.accessorySlot.item.stats[stat];

        return weaponSlot + helmetSlot + armorSlot + accessorySlot;
    }
    /** Combined maxMana of the equipment */
    get maxMana() {
        let stat = 'maxMana';

        let weaponSlot = this.weaponSlot.isEmpty ? 0 : this.weaponSlot.item.stats[stat];
        let helmetSlot = this.helmetSlot.isEmpty ? 0 : this.helmetSlot.item.stats[stat];
        let armorSlot = this.armorSlot.isEmpty ? 0 : this.armorSlot.item.stats[stat];
        let accessorySlot = this.accessorySlot.isEmpty ? 0 : this.accessorySlot.item.stats[stat];

        return weaponSlot + helmetSlot + armorSlot + accessorySlot;
    }
    handleAttack(special, mouse) {
        if (this.weaponSlot.isEmpty) {
            return false;
        }
        if (special) {
            this.weaponSlot.item.special(mouse)
        } else {
            this.weaponSlot.item.attack(mouse)
        }
        this.owner.attacking = true;
    }
    compute(deltaTime, environment) {
        this.helmetSlot.compute(deltaTime);
        this.armorSlot.compute(deltaTime);
        this.accessorySlot.compute(deltaTime);
        this.weaponSlot.compute(deltaTime, environment);
    }
    render(context, tilesize, ratio, camera) {
        if (!this.display) { return }
        this.armorSlot.render(context, tilesize, ratio, camera);
        this.helmetSlot.render(context, tilesize, ratio, camera);
        this.accessorySlot.render(context, tilesize, ratio, camera);
        this.weaponSlot.render(context, tilesize, ratio, camera);
    }
}

class EquipmentSlot {
    constructor(type, owner) {
        this.owner = owner;
        this.type = type;
        this.locked = false;
        this.amount = 0;
        this.item = {
            name: "empty",
            x: 0,
            y: 0,
            render: () => {},
            compute: () => {}
        };

    }
    /** Assigns the passed item onto the equipment slot, also equipping it to this.owner */
    assign(item) {
        item.equip(this.owner);
        this.item = item;
        this.amount = 1;
    }
    /** Swaps this slot's item to another slot's item. */
    swap(recipientSlot) {
        if (this.locked || recipientSlot.locked) {
            throw new Error("Cant place to a locked slot")
        }
        let tempItem = recipientSlot.item,
            tempAmount = recipientSlot.amount;

        recipientSlot.item = this.item;
        recipientSlot.amount = this.amount;

        this.item = tempItem;
        this.amount = tempAmount;
        if (!this.isEmpty) {
            this.assign(this.item);
        }
        return true;
    }
    /** 
     * @returns {Boolean} True if this slot is empty, false otherwise
     */
    get isEmpty() {
        // Check if there is an item in this slot
        return this.item.name == 'empty';
    }
    compute(deltaTime, environment) {
        /** If there is no item don't compute it (duh) */
        if (this.isEmpty) {
            return;
        }
        this.item.compute(deltaTime, environment);
    }
    render(context, tilesize, ratio, camera) {
        /** If there is no item don't render it (duh) */
        if (this.isEmpty) {
            return;
        }
        this.item.render(context, tilesize, ratio, camera);
    }
}