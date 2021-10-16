import { SpriteComponent, InterfaceComponent } from "../interfaceComponent.js";

export class InventoryComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 1;
        this.h = 1;
        this.color = '#fef3c0';
        this.manager = this.source.inventory;
        /** Active: 6, 9 */
        this.icon = new SpriteComponent(6, 8, this.x, this.y, this.w, 1);
        this.inventoryX = this.x;
        this.inventoryY = this.y + 1;
    }
    compute(deltaTime) {
        if (this.source.Physics.pointSquareCol(this.source.director.mouse.absolute, this)) {

            if (this.source.controls.lClickDown) {
                if (this.icon.spriteY !== 8) {
                    this.icon.spriteY = 8;
                    this.manager.display = !this.manager.display;
                    console.log(this.manager.display)
                }
            } else {
                this.icon.spriteY = 9;
            }
        } else {
            this.icon.spriteY = 8;
        }
    }
    render(context, tilesize, baseRatio) {
        let fakeCamera = {
            x: 0,
            y: 0
        }
        this.renderSprite(context, tilesize, baseRatio, this.icon);
        if (this.manager.display) {
            for (let i = 0; i < this.manager.slots.length; i++) {
                context.globalAlpha = 0.8;
                context.drawImage(
                    this.sheet,
                    this.manager.slots[i].spriteX * tilesize,
                    this.manager.slots[i].spriteY * tilesize,
                    this.manager.slots[i].w * tilesize,
                    this.manager.slots[i].h * tilesize,
                    (this.inventoryX + (i % this.manager.columns)) * tilesize * baseRatio,
                    (this.inventoryY + ((i / this.manager.columns) | 0)) * tilesize * baseRatio,
                    this.manager.slots[i].w * tilesize * baseRatio,
                    this.manager.slots[i].h * tilesize * baseRatio
                )
                context.globalAlpha = 1;
                if (!this.manager.slots[i].isEmpty) {
                    this.manager.slots[i].item.x = this.inventoryX + (i % this.manager.columns);
                    this.manager.slots[i].item.y = this.inventoryY + ((i / this.manager.columns) | 0);
                    this.manager.slots[i].item.renderSprite(context, tilesize, baseRatio, fakeCamera);
                }
            }
        }
    }
}