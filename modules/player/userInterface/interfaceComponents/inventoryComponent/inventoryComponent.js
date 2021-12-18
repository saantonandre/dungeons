import { TextComponent, InterfaceComponent, IconComponent } from "../interfaceComponent.js";
import { ItemTooltip } from "./itemTooltip.js";
import { Sprite } from "../../../../entity/sprite.js";
import { soundManager } from "../../../../soundManager/soundManager.js";
export class InventoryComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 1;
        this.h = 1;
        this.color = '#fef3c0';
        this.mouse = this.source.director.mouse.absolute;
        this.controls = this.source.controls;
        this.sounds = soundManager.sounds;
        this.icon = new IconComponent(this.x, this.y);
        this.icon.setAnimation("idle", [23], [26]);
        this.icon.setAnimation("highlight", [23], [27]);
        this.icon.setAnimation("bump", [23, 23, 23, 23], [28, 29, 30, 31]);

        this.inventoryGrid = new InventoryGrid(this.x, this.y + 1, this.source.inventory, this.triggerSlot);

        this.leftColumn = new LeftColumn(this.x - 1, this.y + 1, this.source.equipment, this.triggerSlot);

        this.itemTooltip = new ItemTooltip(this.x - 1, this.y + 1);
    }
    /** Define what happens when a slot is right-clicked, this function gets passed to the **leftColumn>slots** and **inventoryGrid>slots** */
    triggerSlot = (slot) => {
        if (slot.slotRef.item.equippable) {
            this.sounds['click-2'].play();
            if (slot.slotType === "inventorySlot") {
                // Equip (move to equipment)
                this.source.equipment[`${slot.slotRef.item.type}Slot`].swap(slot.slotRef);
            } else {
                // Unequip (move to inventory)
                let freeSlot = this.source.inventory.searchFreeSlot();
                if (freeSlot) {
                    slot.slotRef.swap(freeSlot);
                }
            }
        }
    }
    /** computes the sub-components */
    compute(mouse, controls, deltaTime) {
        this.icon.compute(mouse, controls, deltaTime);
        if (this.icon.active) {
            this.inventoryGrid.compute(mouse, controls);
            this.leftColumn.compute(mouse, controls);
        }
    }
    /** renders the sub-components */
    render(context, tilesize, baseRatio) {
        this.icon.render(context, tilesize, baseRatio);
        if (this.icon.active) {
            this.inventoryGrid.render(context, tilesize, baseRatio)
            this.leftColumn.render(context, tilesize, baseRatio)
            if (this.inventoryGrid.hasActiveSlot) {
                this.itemTooltip.render(context, tilesize, baseRatio, this.inventoryGrid.activeSlot.slotRef);
            } else if (this.leftColumn.hasActiveSlot) {
                this.itemTooltip.render(context, tilesize, baseRatio, this.leftColumn.activeSlot.slotRef);
            }
        }
    }
}


/** The inventory grid displays inventory slots */
class InventoryGrid {
    constructor(x, y, manager, triggerSlot) {
        this.x = x;
        this.y = y;
        this.manager = manager;
        this.items = manager.slots;
        /** Amount of grid columns */
        this.w = 3;
        this.h = (manager.slots.length / this.w) | 0;
        this.hasActiveSlot = false;
        /** Slot hovered by the mouse */
        this.activeSlot = {

        };
        this.slots = [];
        /** Casted by the inventory component defines what happens on slot right click */
        this.triggerSlot = triggerSlot;
        this.initializeSlots();
    }
    initializeSlots() {
        for (let i = 0; i < this.items.length; i++) {
            this.slots.push(
                new ItemSlot(
                    this.x + (i % this.w),
                    this.y + ((i / this.w) | 0),
                    this.items[i],
                    this.triggerSlot
                )
            );
        }
    }
    compute(mouse, controls) {
        this.hasActiveSlot = false;
        for (let slot of this.slots) {
            slot.compute(mouse, controls);
            if (slot.active) {
                this.hasActiveSlot = true;
                this.activeSlot = slot;
            }
        }
    }
    render(context, tilesize, baseRatio) {
        for (let slot of this.slots) {
            slot.render(context, tilesize, baseRatio)
        }
    }
}
/** Contains the equipment slots and the sort/delete options */
class LeftColumn {
    constructor(x, y, manager, triggerSlot) {
        this.x = x;
        this.y = y;
        this.manager = manager;
        /** Amount of grid columns */
        this.hasActiveSlot = false;
        /** Slot hovered by the mouse */
        this.activeSlot = {

        };
        this.slots = [];
        /** Casted by the inventory component defines what happens on slot right click */
        this.triggerSlot = triggerSlot

        this.helmetSlot = new EquipmentSlot(this.x, this.y, manager.helmetSlot, 'helmet', this.triggerSlot);
        this.armorSlot = new EquipmentSlot(this.x, this.y + 1, manager.armorSlot, 'armor', this.triggerSlot);
        this.weaponSlot = new EquipmentSlot(this.x, this.y + 2, manager.weaponSlot, 'weapon', this.triggerSlot);
        this.accessorySlot = new EquipmentSlot(this.x, this.y + 3, manager.accessorySlot, 'accessory', this.triggerSlot);

        this.slots.push(this.helmetSlot, this.armorSlot, this.weaponSlot, this.accessorySlot);
    }
    compute(mouse, controls) {
        this.hasActiveSlot = false;
        for (let slot of this.slots) {
            slot.compute(mouse, controls);
            if (slot.active) {
                this.hasActiveSlot = true;
                this.activeSlot = slot;
            }
        }
    }
    render(context, tilesize, baseRatio) {
        for (let slot of this.slots) {
            slot.render(context, tilesize, baseRatio)
        }
    }
}
class ItemSlot extends Sprite {
    constructor(x, y, slot, triggerSlot) {
        super(x, y);
        this.slotType = 'inventorySlot';
        this.slotRef = slot;
        this.setAnimation('idle', [26], [21]);
        this.setAnimation('highlight', [26], [22]);
        this.setAnimation('locked', [26], [23]);

        this.amount = new TextComponent(this.x + this.w - 0.1, this.y + 0.1);
        this.amount.align = 'right';
        this.amount.color = '#f5ffe8';
        this.amount.baseline = 'top';
        this.amount.fontSize = 6;
        this.amount.stroke = true;
        this.amount.strokeColor = "#14182e";
        this.amount.strokeWidth = 1;

        this.rightClickListener = false;

        /** Casted by the inventory component defines what happens on slot right click */
        this.triggerSlot = triggerSlot

        this.dragging = false;

        if (this.slotRef.locked) {
            this.animation = 'locked';
        }
    }
    handleDrag(mouse) {
        mouse.slot = this;
        mouse.dragging = true;
        this.dragging = true;
    }
    handleDrop(mouse) {
        // To avoid swapping inventory items into equipment
        if (!this.slotRef.isEmpty && mouse.slot.slotType === 'equipmentSlot' && this.slotRef.item.type !== mouse.slot.slotRef.item.type) {
            return false;
        }
        this.slotRef.swap(mouse.slot.slotRef);
        mouse.slot.dragging = false;
        mouse.dragging = false;
        this.dragging = false;

    }
    handleRightClick() {
        this.triggerSlot(this);
    }
    handleHover(mouse, controls) {
        this.animation = "highlight";
        if (mouse.dragging && !controls.lClickDown) {
            // trigger drop
            this.handleDrop(mouse);
        }
        if (this.slotRef.isEmpty) {
            return;
        }
        this.active = true;
        if (!mouse.dragging) {
            if (controls.lClickDown) {
                // trigger drag
                this.handleDrag(mouse);
            } else if (!this.rightClickListener && controls.rClickDown) {
                this.handleRightClick();
            }
        }
    }
    compute(mouse, controls) {
        if (this.slotRef.locked) {
            return;
        }
        this.amount.content = "" + this.slotRef.amount;

        if (!this.slotRef.isEmpty) {
            this.slotRef.item.x = this.x;
            this.slotRef.item.y = this.y;
        }

        if (pointRectCol(mouse, this)) {
            this.handleHover(mouse, controls);
            mouse.hoverUI = true;
        } else {
            this.active = false;
            this.animation = "idle";
        }
        this.rightClickListener = controls.rClickDown;
    }
    render(context, tilesize, baseRatio) {
        context.globalAlpha = 0.8;
        this.renderSprite(context, tilesize, baseRatio);
        context.globalAlpha = 1;
        if (!this.slotRef.isEmpty && !this.slotRef.locked) {
            if (this.dragging) { context.globalAlpha = 0.4; }
            this.slotRef.item.renderItem(this.x, this.y, context, tilesize, baseRatio);
            context.globalAlpha = 1;
            if (this.slotRef.amount > 1) {
                this.amount.render(context, tilesize, baseRatio);
            }
        }
    }
}
class EquipmentSlot extends ItemSlot {
    constructor(x, y, slot, type, triggerSlot) {
        super(x, y, slot, triggerSlot);
        this.slotType = 'equipmentSlot';
        this.type = type;
        switch (type) {
            case 'helmet':
                this.setAnimation('idle', [24], [21]);
                this.setAnimation('highlight', [25], [21]);
                break;
            case 'armor':
                this.setAnimation('idle', [24], [22]);
                this.setAnimation('highlight', [25], [22]);
                break;
            case 'weapon':
                this.setAnimation('idle', [24], [23]);
                this.setAnimation('highlight', [25], [23]);
                break;
            case 'accessory':
                this.setAnimation('idle', [24], [24]);
                this.setAnimation('highlight', [25], [24]);
                break;
        }
    }
    handleDrop(mouse) {
        if (mouse.slot.slotRef.item.type !== this.type) {
            return false;
        }
        this.slotRef.swap(mouse.slot.slotRef);
        mouse.slot.dragging = false;
        mouse.dragging = false;
        this.dragging = false;
        return true;
    }

}

function pointRectCol(point, sq) {
    var square = sq;
    if (sq.hitbox !== undefined) {
        square = sq.hitbox;
    }
    if (point.x >= square.x) {
        if (point.x <= square.x + square.w) {
            if (point.y >= square.y) {
                if (point.y <= square.y + square.h) {
                    return true;
                }
            }

        }
    }
    return false;
}