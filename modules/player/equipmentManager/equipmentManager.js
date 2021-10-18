// FOR TESTING
import { SwordPrototype } from "../../items/swordPrototype/swordPrototype.js"

export class EquipmentManager {
    constructor(source) {
        this.owner = source;

        this.weaponSlot = new EquipmentSlot("weapon");
        this.weaponSlot.assign(new SwordPrototype(this.owner));

        this.helmetSlot = new EquipmentSlot("helmet");

        this.armorSlot = new EquipmentSlot("armor");

        this.accessorySlot = new EquipmentSlot("accessory");
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
        this.weaponSlot.compute(deltaTime, environment);
        this.helmetSlot.compute(deltaTime);
        this.armorSlot.compute(deltaTime);
        this.accessorySlot.compute(deltaTime);
    }
    render(context, tilesize, ratio, camera) {
        this.weaponSlot.render(context, tilesize, ratio, camera);
        this.helmetSlot.render(context, tilesize, ratio, camera);
        this.armorSlot.render(context, tilesize, ratio, camera);
        this.accessorySlot.render(context, tilesize, ratio, camera);
    }
}

class EquipmentSlot {
    constructor(type) {
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