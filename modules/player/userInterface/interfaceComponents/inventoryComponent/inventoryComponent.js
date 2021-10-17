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
        this.manager = this.source.inventory;
        this.mouse = this.source.director.mouse.absolute;
        this.controls = this.source.controls;
        /** Active: 6, 9 */
        this.icon = new Icon(this.manager, this.x, this.y);
        this.inventoryGrid = new InventoryGrid(this.x, this.y + 1, this.manager);
        this.itemTooltip = new ItemTooltip(this.x, this.y + 1);
    }
    compute(deltaTime) {
        this.icon.compute(this.mouse, this.controls, deltaTime);
        if (this.icon.active) {
            this.inventoryGrid.compute(this.mouse)
        }
    }
    render(context, tilesize, baseRatio) {
        this.icon.render(context, tilesize, baseRatio);
        if (this.icon.active) {
            this.inventoryGrid.render(context, tilesize, baseRatio)
            if (this.inventoryGrid.hasActiveSlot) {
                this.itemTooltip.render(context, tilesize, baseRatio, this.inventoryGrid.activeSlot.slotRef.item);
            }
        }
    }
}
class Icon extends Sprite {
    constructor(manager, x, y) {
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
class InventoryGrid {
    constructor(x, y, manager) {
        this.x = x;
        this.y = y;
        this.items = manager.slots;
        this.columns = 3;
        this.hasActiveSlot = false;
        this.activeSlot = {

        };
        this.slots = [];
        this.initializeSlots();
    }
    initializeSlots() {
        for (let i = 0; i < this.items.length; i++) {
            this.slots.push(
                new ItemSlot(
                    this.x + (i % this.columns),
                    this.y + ((i / this.columns) | 0),
                    this.items[i]
                )
            );
        }
    }
    compute(mouse) {
        this.hasActiveSlot = false;
        for (let slot of this.slots) {
            slot.compute(mouse);
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
    constructor(x, y, slot) {
        super(x, y);
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

        if (this.slotRef.locked) {
            this.animation = 'locked';
        }
    }
    handleHover() {

        if (!this.slotRef.isEmpty) {
            this.active = true;
        }
        this.animation = "highlight";
    }
    compute(mouse) {
        if (this.slotRef.locked) {
            return;
        }
        this.amount.content = "" + this.slotRef.amount;
        if (pointSquareCol(mouse, this)) {
            this.handleHover();
            mouse.hoverUI = true;
        } else {
            this.active = false;
            this.animation = "idle";
        }
    }
    render(context, tilesize, baseRatio) {
        context.globalAlpha = 0.8;
        this.renderSprite(context, tilesize, baseRatio);
        context.globalAlpha = 1;
        if (!this.slotRef.isEmpty && !this.slotRef.locked) {
            this.slotRef.item.x = this.x;
            this.slotRef.item.y = this.y;
            this.slotRef.item.renderSprite(context, tilesize, baseRatio);
            context.globalAlpha = 1;
            if (this.slotRef.amount > 1) {
                this.amount.render(context, tilesize, baseRatio);
            }
        }
    }
}
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
        this.descriptionContent.baseline = 'top';
        this.sourceContent = new TextComponent(this.x + this.w - 0.1, this.y + this.h - 0.1);
        this.sourceContent.align = 'right';
        this.sourceContent.color = '#ffc2a1';
        this.sourceContent.fontSize = 6;
        this.sourceContent.baseline = 'bottom';

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

        let xBackup = item.x;
        let yBackup = item.y;
        item.x = (this.x + this.w / 2 - 1) / 2;
        item.y = (this.y + 0.5) / 2;
        item.renderSprite(context, tilesize, ratio * 2);
        item.x = xBackup;
        item.y = yBackup;
    }
    render(context, tilesize, ratio, item) {
        this.renderBox(context, tilesize, ratio)
        this.nameContent.content = item.name;

        this.descriptionContent.content = item.description;
        // Breaks down the description to multiple lines 
        this.descriptionContent.content = getLines(
            context,
            this.descriptionContent.content,
            this.descriptionBox.w * tilesize * ratio
        )

        this.sourceContent.content = "Source: " + item.sourceName.toUpperCase();
        this.nameContent.render(context, tilesize, ratio);
        this.descriptionContent.render(context, tilesize, ratio);
        this.sourceContent.render(context, tilesize, ratio);
        this.renderThumb(context, tilesize, ratio, item)
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
function getLines(ctx, text, maxWidth) {
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