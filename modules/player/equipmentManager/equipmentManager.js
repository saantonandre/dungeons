// FOR TESTING
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
        return this.weaponSlot.item.stats.atk || 0 +
            this.helmetSlot.item.stats.atk || 0 +
            this.armorSlot.item.stats.atk || 0 +
            this.accessorySlot.item.stats.atk || 0;
    }
    /** Combined attack power of the equipment */
    get atkSpeed() {
        return this.weaponSlot.item.stats.atkSpeed || 1 *
            this.helmetSlot.item.stats.atkSpeed || 1 *
            this.armorSlot.item.stats.atkSpeed || 1 *
            this.accessorySlot.item.stats.atkSpeed || 1;
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
    assign(item) {
        item.equip(this.owner);
        this.item = item;
        this.amount = 1;
    }
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
        return true;
    }
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