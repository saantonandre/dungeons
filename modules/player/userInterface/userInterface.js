// import { mouse } from "./mouse.js";
// import { pointSquareCol } from './physics.js';
import { spritesheet } from "../../resourceManager.js";

/** Needs some rework */
export class UserInterface {
    constructor(source) {
        this.mouse = source.director.mouse.absolute;
        this.fontSize = 7;
        this.source = source;
        this.mouse = this.source.director.mouse.absolute;
        this.Physics = this.source.Physics;
        this.sheet = spritesheet;
        this.hpComponent = new HpComponent(this.source, 1.5, 0.5);
        this.manaComponent = new ManaComponent(this.source, 5.5, 0.5);
        this.expComponent = new ExpComponent(this.source, 10, 0.5);
        this.floorComponent = new FloorComponent(this.source, 17, 0.5);
        this.equipmentComponent = new EquipmentComponent(this.source, 20.5, 0.3);
        this.inventoryComponent = new InventoryComponent(this.source, 22, 0.3);
        this.settingsComponent = new SettingsComponent(this.source, 23.5, 0.3);
    }
    compute(deltaTime) {
        this.hpComponent.compute(deltaTime)
        this.manaComponent.compute(deltaTime)
        this.expComponent.compute(deltaTime)
        this.floorComponent.compute(deltaTime)

        this.equipmentComponent.compute(deltaTime)
        this.inventoryComponent.compute(deltaTime)
        this.settingsComponent.compute(deltaTime)

    }
    render(context, tilesize, baseRatio) {
        this.hpComponent.render(context, tilesize, baseRatio);
        this.manaComponent.render(context, tilesize, baseRatio);
        this.expComponent.render(context, tilesize, baseRatio);
        this.floorComponent.render(context, tilesize, baseRatio);
        this.floorComponent.render(context, tilesize, baseRatio);

        this.equipmentComponent.render(context, tilesize, baseRatio);
        this.inventoryComponent.render(context, tilesize, baseRatio);
        this.settingsComponent.render(context, tilesize, baseRatio);
    }
}
class InterfaceComponent {
    constructor(source, x, y) {
        this.source = source;
        this.sheet = source.sheet;
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;

        this.progressText = {
            content: '',
            x: this.x,
            y: this.y,
            align: 'center',
            baseline: 'middle',
            color: '#ad2f45',
            font: this.font
        }
    }
    renderSprite(context, tilesize, ratio, item, widthRatio = 1) {
        context.drawImage(
            this.sheet,
            item.spriteX * tilesize,
            item.spriteY * tilesize,
            item.w * tilesize * widthRatio,
            item.h * tilesize,
            item.x * tilesize * ratio,
            item.y * tilesize * ratio,
            item.w * tilesize * ratio * widthRatio,
            item.h * tilesize * ratio,

        )
    }
    renderText(context, tilesize, ratio, text) {
        context.textBaseline = text.baseline;
        context.textAlign = text.align;
        context.fillStyle = text.color;
        context.font = 'bold ' + Math.round(text.fontSize * ratio) + 'px ' + text.font;
        context.fillText(
            text.content,
            text.x * tilesize * ratio,
            text.y * tilesize * ratio
        );
        context.strokeStyle = text.strokeColor;
        context.lineWidth = text.strokeWidth * ratio;
        context.font = 'bold ' + Math.round(text.fontSize * ratio) + 'px ' + text.font;
        context.strokeText(
            text.content,
            text.x * tilesize * ratio,
            text.y * tilesize * ratio
        );
    }
}
class HpComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 3;
        this.h = 1;
        this.contour = new SpriteComponent(6, 11, this.x, this.y, this.w, this.h);
        this.prevBar = new SpriteComponent(9, 13, this.x, this.y, this.w, this.h);
        this.progressBar = new SpriteComponent(9, 11, this.x, this.y, this.w, this.h);
        this.icon = new SpriteComponent(5, 11, this.x - 1, this.y, 1, 1);
        this.color = '#ad2f45';
        this.text = new TextComponent(this.x + this.w / 2, this.y, this.color);
    }
    compute(deltaTime) {
        this.ratio = this.source.hp / this.source.maxHp;
        if (this.prevRatio > this.ratio) {
            this.prevRatio -= deltaTime / 200;
        }
        if (this.prevRatio < this.ratio) {
            this.prevRatio = this.ratio;
        }
        this.text.content = `${this.source.hp} / ${this.source.maxHp}`;

    }
    /** 
     * - Render the contour
     * - Render the damaged bar according to prevRatio
     * - Render the actual bar according to the ratio
     */
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.contour);
        this.renderSprite(context, tilesize, baseRatio, this.prevBar, this.prevRatio);
        this.renderSprite(context, tilesize, baseRatio, this.progressBar, this.ratio);
        this.renderSprite(context, tilesize, baseRatio, this.icon);
        this.renderText(context, tilesize, baseRatio, this.text);
    }
}
class ManaComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 3;
        this.h = 1;

        this.contour = new SpriteComponent(6, 12, this.x, this.y, this.w, this.h);
        this.prevBar = new SpriteComponent(9, 13, this.x, this.y, this.w, this.h);
        this.progressBar = new SpriteComponent(9, 12, this.x, this.y, this.w, this.h);
        this.icon = new SpriteComponent(5, 12, this.x - 1, this.y, 1, 1);
        this.color = '#4fa4b8';

        this.text = new TextComponent(this.x + this.w / 2, this.y, this.color);
    }
    compute(deltaTime) {
        this.ratio = this.source.mana / this.source.maxMana;
        if (this.prevRatio > this.ratio) {
            this.prevRatio -= deltaTime / 200;
        }
        if (this.prevRatio < this.ratio) {
            this.prevRatio = this.ratio;
        }
        this.text.content = `${this.source.mana} / ${this.source.maxMana}`;

    }
    /** 
     * - Render the contour
     * - Render the damaged bar according to prevRatio
     * - Render the actual bar according to the ratio
     */
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.contour);
        this.renderSprite(context, tilesize, baseRatio, this.prevBar, this.prevRatio);
        this.renderSprite(context, tilesize, baseRatio, this.progressBar, this.ratio);
        this.renderSprite(context, tilesize, baseRatio, this.icon);
        this.renderText(context, tilesize, baseRatio, this.text);
    }
}
class ExpComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 5;
        this.h = 1;
        this.color = '#63ab3f';
        this.contour = new SpriteComponent(13, 11, this.x, this.y, this.w, this.h);
        this.progressBar = new SpriteComponent(13, 12, this.x, this.y, this.w, this.h);
        this.icon = new SpriteComponent(12, 11, this.x - 1, this.y, 1, 1);
        this.text = new TextComponent(this.x + this.w / 2, this.y, this.color);

        this.levelIcon = new SpriteComponent(12, 12, this.x + 5, this.y - 0.5, 1, 1);
        this.levelText = new TextComponent(this.levelIcon.x + 0.5, this.levelIcon.y + 1, this.color);
    }
    compute(deltaTime) {
        this.ratio = this.source.exp / this.source.maxExp;
        this.text.content = `${this.source.exp} / ${this.source.maxExp}`;
        this.levelText.content = `${this.source.lv}`;
    }
    /** 
     * - Render the contour
     * - Render the damaged bar according to prevRatio
     * - Render the actual bar according to the ratio
     */
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.contour);
        this.renderSprite(context, tilesize, baseRatio, this.progressBar, this.ratio);
        this.renderSprite(context, tilesize, baseRatio, this.icon);
        this.renderText(context, tilesize, baseRatio, this.text);

        this.renderSprite(context, tilesize, baseRatio, this.levelIcon);
        this.renderText(context, tilesize, baseRatio, this.levelText);
    }
}
class FloorComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 2;
        this.h = 1;
        this.color = '#fef3c0';
        this.icon = new SpriteComponent(12, 14, this.x, this.y - 0.5, this.w, 1);
        this.text = new TextComponent(this.x + this.w / 2, this.y + 0.5, this.color);
    }
    compute(deltaTime) {
        this.text.content = `${this.source.director.floor}`;
    }
    /** 
     * - Render the contour
     * - Render the damaged bar according to prevRatio
     * - Render the actual bar according to the ratio
     */
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.icon);
        this.renderText(context, tilesize, baseRatio, this.text);
    }
}
class EquipmentComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 1;
        this.h = 1;
        this.color = '#fef3c0';
        /** Active: 5, 9 */
        this.icon = new SpriteComponent(5, 8, this.x, this.y, this.w, 1);
    }
    compute(deltaTime) {}
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.icon);
    }
}
class InventoryComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 1;
        this.h = 1;
        this.color = '#fef3c0';
        /** Active: 6, 9 */
        this.icon = new SpriteComponent(6, 8, this.x, this.y, this.w, 1);
    }
    compute(deltaTime) {}
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.icon);
    }
}
class SettingsComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 1;
        this.h = 1;
        this.color = '#fef3c0';
        /** Active: 7, 9 */
        this.icon = new SpriteComponent(7, 8, this.x, this.y, this.w, 1);
    }
    compute(deltaTime) {}
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.icon);
    }
}

/**
 * - **SpriteX**: X position in the spritesheet
 * - **SpriteY**: Y position in the spritesheet
 * - **x**: X position on the canvas
 * - **y**: Y position on the canvas
 * - **w**: width on the canvas
 * - **h**: height  on the canvas
 */
class SpriteComponent {
    constructor(spriteX = 0, spriteY = 0, x = 0, y = 0, w = 0, h = 0) {
        this.spriteX = spriteX;
        this.spriteY = spriteY;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
class TextComponent {
    constructor(x, y, color = '#ad2f45', align = "center", baseline = "middle") {
        this.content = '';
        this.x = x;
        this.y = y;
        this.color = color;
        this.align = align;
        this.baseline = baseline;
        this.fontSize = 7;
        this.font = 'Consolas, monaco, monospace';
        this.strokeColor = '#2c354d';
        this.strokeWidth = 0.3;

    }
}