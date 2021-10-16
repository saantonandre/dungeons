import { HpComponent } from './interfaceComponents/hpComponent.js';
import { ManaComponent } from './interfaceComponents/manaComponent.js';
import { ExpComponent } from './interfaceComponents/expComponent.js';
import { FloorComponent } from './interfaceComponents/floorComponent.js';


import { EquipmentComponent } from './interfaceComponents/equipmentComponent/equipmentComponent.js';
import { InventoryComponent } from './interfaceComponents/inventoryComponent/inventoryComponent.js';
import { SettingsComponent } from './interfaceComponents/settingsComponent/settingsComponent.js';


export class UserInterface {
    constructor(source) {
        this.mouse = source.director.mouse.absolute;
        this.fontSize = 7;
        this.source = source;
        this.mouse = this.source.director.mouse.absolute;
        this.Physics = this.source.Physics;
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