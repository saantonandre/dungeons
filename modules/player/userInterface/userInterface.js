import { HpComponent } from './interfaceComponents/hpComponent.js';
import { ManaComponent } from './interfaceComponents/manaComponent.js';
import { ExpComponent } from './interfaceComponents/expComponent.js';
import { FloorComponent } from './interfaceComponents/floorComponent.js';


import { CharacterComponent } from './interfaceComponents/characterComponent/characterComponent.js';
import { InventoryComponent } from './interfaceComponents/inventoryComponent/inventoryComponent.js';
import { SettingsComponent } from './interfaceComponents/settingsComponent/settingsComponent.js';

import { MinimapComponent } from './interfaceComponents/minimapComponent/minimapComponent.js';



export class UserInterface {
    constructor(source) {
        this.mouse = source.director.mouse.absolute;
        this.controls = source.controls;
        this.fontSize = 7;
        this.source = source;
        this.mouse = this.source.director.mouse.absolute;
        this.Physics = this.source.Physics;

        this.hpComponent = new HpComponent(this.source, 1.5, 0.5);
        this.manaComponent = new ManaComponent(this.source, 5.5, 0.5);
        this.expComponent = new ExpComponent(this.source, 10, 0.5);
        this.floorComponent = new FloorComponent(this.source, 17, 0.5);


        this.characterComponent = new CharacterComponent(this.source, 20.5, 0.3);
        this.inventoryComponent = new InventoryComponent(this.source, 22, 0.3);

        this.settingsComponent = new SettingsComponent(this.source, 23.5, 0.3);

        this.minimapComponent = new MinimapComponent(23.5, 17);


    }
    compute(deltaTime) {
        this.source.director.mouse.absolute.hoverUI = false;

        this.hpComponent.compute(deltaTime)
        this.manaComponent.compute(deltaTime)
        this.expComponent.compute(deltaTime)
        this.floorComponent.compute(deltaTime)

        this.characterComponent.compute(this.mouse, this.controls, deltaTime)
        this.inventoryComponent.compute(this.mouse, this.controls, deltaTime)
        this.settingsComponent.compute(this.mouse, this.controls, deltaTime)
        this.minimapComponent.compute(this.mouse, this.controls, deltaTime)


    }
    handleDragging(context, tilesize, baseRatio) {
        if (this.mouse.dragging) {
            let x = this.mouse.x - this.mouse.slot.slotRef.item.w / 2;
            let y = this.mouse.y - this.mouse.slot.slotRef.item.h / 2;
            //context.globalAlpha = 0.6;
            this.mouse.slot.slotRef.item.renderItem(x, y, context, tilesize, baseRatio);
            //context.globalAlpha = 1;
            if (!this.source.director.controls.lClickDown) {
                this.mouse.dragging = false;
                this.mouse.slot.dragging = false;
            }
        }
    }
    render(context, tilesize, baseRatio) {
        this.hpComponent.render(context, tilesize, baseRatio);
        this.manaComponent.render(context, tilesize, baseRatio);
        this.expComponent.render(context, tilesize, baseRatio);
        this.floorComponent.render(context, tilesize, baseRatio);

        this.characterComponent.render(context, tilesize, baseRatio);
        this.inventoryComponent.render(context, tilesize, baseRatio);
        this.settingsComponent.render(context, tilesize, baseRatio);
        this.minimapComponent.render(context, tilesize, baseRatio, this.source.director.gameMap, this.source);
        this.handleDragging(context, tilesize, baseRatio)

    }

}