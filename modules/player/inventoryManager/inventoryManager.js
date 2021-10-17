export class InventoryManager {
    constructor(source) {
        this.owner = source
        this.slots = [];
        this.columns = 3;
        this.slotsAmount = 18;
        this.slotsUnlocked = 9;
        this.display = false;
        this.newItemCollected = false;
        this.initialize();
    }
    initialize() {
        this.slots = [];
        for (let i = 0; i < this.slotsAmount; i++) {
            this.slots.push(new ItemSlot(i >= this.slotsUnlocked));
        }
    }
    hasSpace() {

    }
    stackItem(item) {
        for (let slot of this.slots) {
            if (slot.locked || slot.isEmpty) {
                continue;
            }
            if (slot.item.name == item.name && slot.amount < 100) {
                slot.assign(item);
                this.newItemCollected = true;
                return true;
            }
        }
        return false;
    }
    /**
     * - Check for matching stackables
     * - Check if there is space
     * 
     */
    pickUp(item) {
        if (item.stackable && this.stackItem(item)) {
            return true;
        }
        for (let slot of this.slots) {
            if (slot.locked) {
                continue;
            }
            if (slot.isEmpty) {
                slot.assign(item);
                this.newItemCollected = true;
                return true;
            }
        }
        return false;
    }
    compute() {
        // Check collisions with items
        for (let entity of this.owner.director.level.entities) {
            if (entity.type === 'item' && !entity.scheduledDeletion && this.owner.Physics.collided(this.owner, entity)) {
                if (this.pickUp(entity)) {
                    entity.store();
                }
            }
        }
    }
    render() {

    }
}
class ItemSlot {
    constructor(locked = false) {
        this.spriteX = 26;
        this.spriteY = 21 + locked;
        this.w = 1;
        this.h = 1;
        this.hasItem = false;
        this.amount = 0;
        this.locked = locked;
        this.item = {
            name: "empty"
        };

    }
    assign(item) {
        this.amount += 1;
        this.item = item;
        this.hasItem = true
    }
    get isEmpty() {
        // Check if there is an item in this slot
        return this.item.name == 'empty';
    }
}