import { TextComponent, InterfaceComponent } from "../interfaceComponent.js";
import { Sprite } from "../../../../entity/sprite.js";
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

        this.icon = new Icon(this.x, this.y, this.source.inventory);
        this.inventoryGrid = new InventoryGrid(this.x, this.y + 1, this.source.inventory, this.triggerSlot);

        this.leftColumn = new LeftColumn(this.x - 1, this.y + 1, this.source.equipment, this.triggerSlot);

        this.itemTooltip = new ItemTooltip(this.x - 1, this.y + 1);
    }
    triggerSlot = (slot) => {
        if (slot.slotRef.item.equippable) {
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
    compute(deltaTime) {
        this.icon.compute(this.mouse, this.controls, deltaTime);
        if (this.icon.active) {
            this.inventoryGrid.compute(this.mouse, this.controls);
            this.leftColumn.compute(this.mouse, this.controls);
        }
    }
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

/** The bag shaped icon, handles clicks/hovering and activates the UI */
class Icon extends Sprite {
    constructor(x, y, manager) {
        super(x, y);
        this.manager = manager;
        this.animation = 'idle';
        this.setAnimation("idle", [23], [26]);
        this.setAnimation("bump", [23, 23, 23, 23], [28, 29, 30, 31]);
        this.animations['bump'].slowness = 5;
        this.setAnimation("highlight", [23], [27]);
        this.active = false;
    }
    handleHover(controls) {
        if (controls.lClickDown) {
            if (this.animation !== 'idle') {
                this.loadAnimation('idle');
                this.active = !this.active
            }
        } else {
            this.loadAnimation('highlight');
        }
    }
    onAnimationEnd() {
        switch (this.animation) {
            case 'highlight':
                this.loadAnimation('idle');
                break;
            case 'bump':
                this.loadAnimation('idle');
                break;
        }
    }
    compute(mouse, controls, deltaTime) {
        this.updateSprite(deltaTime);
        if (this.manager.newItemCollected) {
            this.manager.newItemCollected = false;
            this.loadAnimation("bump");
        }
        if (pointSquareCol(mouse, this)) {
            mouse.hoverUI = true;
            this.handleHover(controls)
        }


    }
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio);
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

        if (pointSquareCol(mouse, this)) {
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
/** Renders the processed details of the passed item */
class ItemTooltip {
    constructor(x, y) {
        this.w = 8;
        this.h = 6;
        this.x = x - this.w;
        this.y = y;
        this.descriptionBox = {
            w: this.w * 0.9,
            h: this.h * 0.9 - 2,
            x: this.x + (this.w - this.w * 0.9) / 2,
            y: this.y + 2.5 + (this.h - this.h * 0.9) / 2,
        }
        this.nameContent = new TextComponent(this.x + this.w / 2, this.y + 0.2);
        this.nameContent.align = 'center';
        this.nameContent.color = '#f5ffe8';
        this.nameContent.baseline = 'top';
        this.nameContent.fontSize = 10;
        this.descriptionContent = new TextComponent(this.descriptionBox.x, this.descriptionBox.y);
        this.descriptionContent.align = 'left';
        this.descriptionContent.color = '#dfe0e8';
        this.descriptionContent.fontSize = 6.5;
        this.descriptionContent.baseline = 'top';
        this.sourceContent = new TextComponent(this.x + this.w - 0.1, this.y + this.h - 0.1);
        this.sourceContent.align = 'right';
        this.sourceContent.color = '#ffc2a1';
        this.sourceContent.fontSize = 6;
        this.sourceContent.baseline = 'bottom';

    }
    render(context, tilesize, ratio, slotRef) {
        if (slotRef.isEmpty) {
            return;
        }
        let item = slotRef.item;
        this.renderBox(context, tilesize, ratio)
        this.nameContent.content = item.name;
        this.rarityColorChange(item);
        this.descriptionContent.content = item.description;
        // Breaks down the description to multiple lines 
        this.descriptionContent.content = getLines(
            context,
            this.descriptionContent.content,
            this.descriptionContent.canvasFont(ratio),
            this.descriptionBox.w * tilesize * ratio
        )

        this.sourceContent.content = "Source: " + item.sourceName.toUpperCase();
        this.nameContent.render(context, tilesize, ratio);
        this.descriptionContent.render(context, tilesize, ratio);
        this.sourceContent.render(context, tilesize, ratio);
        this.renderThumb(context, tilesize, ratio, item)
    }
    /** Changes the nameContent color based on item rarity */
    rarityColorChange(item) {
        switch (item.rarity) {
            case "rare":
                this.nameContent.color = "#ffc2a1";
                break;
            case "common":
                this.nameContent.color = "#f5ffe8";

                break;
        }
    }
    renderBox(context, tilesize, ratio) {
        context.globalAlpha = 0.6;
        context.fillStyle = "#14182e";
        context.fillRect(
            (this.x) * tilesize * ratio,
            (this.y) * tilesize * ratio,
            (this.w) * tilesize * ratio,
            (this.h) * tilesize * ratio,
        )
        context.fillStyle = "#14182e";
        context.fillRect(
            (this.x) * tilesize * ratio,
            (this.y) * tilesize * ratio,
            (this.w) * tilesize * ratio,
            tilesize * ratio,
        )
        context.globalAlpha = 1;
    }
    renderThumb(context, tilesize, ratio, item) {

        let x = this.x + this.w / 2 - 1;
        let y = this.y + 0.7;
        item.renderItem(x, y, context, tilesize, ratio, 2, 2);
    }
}


function pointSquareCol(point, sq) {
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
/** Returns an array of lines based on the maximum available width */
function getLines(ctx, text, font, maxWidth) {
    ctx.font = font;
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}