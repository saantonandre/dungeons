/** Handles Item pick ups, sorting and swapping slots in the inventory */
export class InventoryManager {
    constructor(source) {
        this.owner = source
        this.slots = [];
        this.columns = 3;
        this.slotsAmount = 18;
        this.slotsUnlocked = 9;
        this.display = false;
        this.newItemCollected = false;
        this.pupulate();
    }
    /** Pupulates the inventory with slots */
    pupulate() {
        this.slots = [];
        for (let i = 0; i < this.slotsAmount; i++) {
            this.slots.push(new ItemSlot(i >= this.slotsUnlocked));
        }
    }
    /** TODO: Sorts/orders the inventory content */
    sortSlots() {
        // this.slots.sort((a, b) => { return a.id - b.id })
    }
    /** Returns true if the item has been stacked, false if there are no matches and the inventory is full */
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
    /** Returns a free slot or false if there are none */
    searchFreeSlot() {
        for (let slot of this.slots) {
            if (slot.locked) {
                continue;
            }
            if (slot.isEmpty) {
                return slot;
            }
        }
        return false;
    }
    /**
     * - Check for matching stackables
     * - Check if there is space
     */
    pickUp(item) {
        if (item.stackable && this.stackItem(item)) {
            return true;
        }
        let freeSlot = this.searchFreeSlot();
        if (freeSlot) {
            freeSlot.assign(item);
            this.newItemCollected = true;
            return true;
        }
        return false;
    }
    compute() {

    }
    render() {

    }
}
/** Slot data type used by the inventory manager/component */
class ItemSlot {
    constructor(locked = false) {
        this.amount = 0;
        this.locked = locked;
        this.item = {
            name: "empty",
            x: 0,
            y: 0
        };

    }
    assign(item) {
        this.amount += 1;
        this.item = item;
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
}