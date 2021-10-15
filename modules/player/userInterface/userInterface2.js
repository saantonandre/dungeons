// import { mouse } from "./mouse.js";
// import { pointSquareCol } from './physics.js';
import { spritesheet } from "../../resourceManager.js";

/** Needs some rework */
export class UserInterface {
    constructor(source) {
        /*
            TODO:
            gradual damaged bar
        */
        this.fontSize = 7;
        this.source = source;
        this.mouse = this.source.director.mouse.absolute;
        this.Physics = this.source.Physics;
        this.hpIcon = {
            spriteX: [
                [5]
            ],
            spriteY: [
                [11]
            ],
            x: 0.5,
            y: 0.5,
            w: 1,
            h: 1,
        };
        this.hpBar = {
            spriteX: [
                [6],
                [9]
            ],
            spriteY: [
                [11],
                [11]
            ],
            x: 1.5,
            y: 0.5,
            w: 3,
            h: 1,
            prevRatio: 0
        };

        this.manaIcon = {
            spriteX: [
                [5]
            ],
            spriteY: [
                [12]
            ],
            x: 4.5,
            y: 0.5,
            w: 1,
            h: 1,
        };
        this.manaBar = {
            spriteX: [
                [6],
                [9]
            ],
            spriteY: [
                [12],
                [12]
            ],
            x: 5.5,
            y: 0.5,
            w: 3,
            h: 1,
            prevRatio: 0
        };

        this.damagedBar = {
            spriteX: [
                [9],
            ],
            spriteY: [
                [13],
            ]
        };

        this.expIcon = {
            spriteX: [
                [12],
            ],
            spriteY: [
                [11]
            ],
            x: 9,
            y: 0.5,
            w: 1,
            h: 1,
        };
        this.expBar = {
            spriteX: [
                [13],
                [13]
            ],
            spriteY: [
                [11],
                [12]
            ],
            x: 10,
            y: 0.5,
            w: 5,
            h: 1,
        };
        this.floorIcon = {
            spriteX: [
                [12],
            ],
            spriteY: [
                [14]
            ],
            x: 17,
            y: 0.4,
            w: 2,
            h: 1,
        };
        this.lvlIcon = {
            spriteX: [
                [12],
            ],
            spriteY: [
                [12]
            ],
            x: 15,
            y: 0.15,
            w: 1,
            h: 1,
        };

        this.settingsIcon = {
            action: 0,
            spriteX: [
                [7],
                [7]
            ],
            spriteY: [
                [8],
                [9]
            ],
            x: 23.5,
            y: 0.5,
            w: 1,
            h: 1,
        };

        this.inventoryIcon = {
            action: 0,
            spriteX: [
                [6],
                [6]
            ],
            spriteY: [
                [8],
                [9]
            ],
            x: 22,
            y: 0.5,
            w: 1,
            h: 1,
        };

        this.equipmentIcon = {
            action: 0,
            spriteX: [
                [5],
                [5]
            ],
            spriteY: [
                [8],
                [9]
            ],
            x: 20.5,
            y: 0.5,
            w: 1,
            h: 1,
        };
        this.sheet = spritesheet;
        this.hpRatio = this.source.hp / this.source.maxHp;
        this.manaRatio = this.source.mana / this.source.maxMana;
        this.expRatio = this.source.exp / this.source.maxExp;
        this.font = 'Consolas, monaco, monospace';

        this.hpBar.prevRatio = this.hpRatio;
        this.manaBar.prevRatio = this.manaRatio;
    }
    compute(deltaTime) {

        this.hpRatio = this.source.hp / this.source.maxHp;
        this.manaRatio = this.source.mana / this.source.maxMana;
        this.expRatio = this.source.exp / this.source.maxExp;
        // Computes the white damage gradual decrease
        if (this.hpBar.prevRatio > this.hpRatio) {
            this.hpBar.prevRatio -= deltaTime / 400;
        }
        if (this.hpBar.prevRatio < this.hpRatio) {
            this.hpBar.prevRatio = this.hpRatio;
        }

        if (this.manaBar.prevRatio > this.manaRatio) {
            this.manaBar.prevRatio -= deltaTime / 400;
        }
        if (this.manaBar.prevRatio < this.manaRatio) {
            this.manaBar.prevRatio = this.manaRatio;
        }

    }
    render(context, tilesize, baseRatio) {
        this.renderHpBar(context, tilesize, baseRatio);
        this.renderManaBar(context, tilesize, baseRatio);
        this.renderExpBar(context, tilesize, baseRatio);
        this.renderSettingsIcon(context, tilesize, baseRatio);
        this.renderInventoryIcon(context, tilesize, baseRatio);
        this.renderEquipmentIcon(context, tilesize, baseRatio);
        //this.renderFloorIcon(context, tilesize, baseRatio);
    }
    renderComponent(component, context, tilesize, baseRatio, sprite0 = 0, sprite1 = 0, componentRatio = 1) {
        context.drawImage(
            this.sheet,
            component.spriteX[sprite0][sprite1] * tilesize,
            component.spriteY[sprite0][sprite1] * tilesize,
            component.w * tilesize * componentRatio,
            component.h * tilesize,
            component.x * tilesize * baseRatio,
            component.y * tilesize * baseRatio,
            component.w * tilesize * baseRatio * componentRatio,
            component.h * tilesize * baseRatio
        );
    }
    renderSettingsIcon(context, tilesize, baseRatio) {
        this.settingsIcon.action = this.Physics.pointSquareCol(this.mouse, this.settingsIcon) ? 1 : 0;
        // renders icon
        this.renderComponent(this.settingsIcon, context, tilesize, baseRatio, this.settingsIcon.action)
    }
    renderInventoryIcon(context, tilesize, baseRatio) {

        this.inventoryIcon.action = this.Physics.pointSquareCol(this.mouse, this.inventoryIcon) ? 1 : 0;
        // renders icon
        this.renderComponent(this.inventoryIcon, context, tilesize, baseRatio, this.inventoryIcon.action)
    }
    renderEquipmentIcon(context, tilesize, baseRatio) {
        this.equipmentIcon.action = this.Physics.pointSquareCol(this.mouse, this.equipmentIcon) ? 1 : 0;
        // renders icon
        this.renderComponent(this.equipmentIcon, context, tilesize, baseRatio, this.equipmentIcon.action)
    }
    renderHpBar(context, tilesize, baseRatio) {
        // variables

        // renders icon
        this.renderComponent(this.hpIcon, context, tilesize, baseRatio);
        // renders container
        this.renderComponent(this.hpBar, context, tilesize, baseRatio);
        // renders damagedBar
        this.renderComponent(this.hpBar, context, tilesize, baseRatio, 0, 0, this.hpBar.prevRatio);
        // renders bar
        this.renderComponent(this.hpBar, context, tilesize, baseRatio, 1, 0, this.hpRatio);
        // renders text
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#ad2f45';
        context.font =
            'bold ' + Math.round(this.fontSize * baseRatio) + 'px ' + this.font;
        context.fillText(
            this.source.hp + '/' + this.source.maxHp,
            (this.hpBar.x + this.hpBar.w / 2) * tilesize * baseRatio,
            this.hpBar.y * tilesize * baseRatio
        );
    }
    renderManaBar(context, tilesize, baseRatio) {
        // variables

        // renders icon
        this.renderComponent(this.manaIcon, context, tilesize, baseRatio);
        // renders container
        this.renderComponent(this.manaBar, context, tilesize, baseRatio);
        // renders damagedBar
        this.renderComponent(this.manaBar, context, tilesize, baseRatio, 0, 0, this.manaBar.prevRatio);
        // renders bar
        this.renderComponent(this.manaBar, context, tilesize, baseRatio, 1, 0, this.manaRatio);

        // renders text
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#4fa4b8';
        context.font =
            'bold ' + Math.round(this.fontSize * baseRatio) + 'px ' + this.font;
        context.fillText(
            this.source.mana + '/' + this.source.maxMana,
            (this.manaBar.x + this.manaBar.w / 2) * tilesize * baseRatio,
            this.manaBar.y * tilesize * baseRatio
        );
    }
    renderExpBar(context, tilesize, baseRatio) {
        // variables

        // renders icon
        this.renderComponent(this.expIcon, context, tilesize, baseRatio)
        // renders container
        this.renderComponent(this.expBar, context, tilesize, baseRatio)
        // renders bar
        this.renderComponent(this.expBar, context, tilesize, baseRatio, 1, 0, this.expRatio)

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#63ab3f';
        context.font = 'bold ' + Math.round(this.fontSize * baseRatio) + 'px ' + this.font;
        context.fillText(
            this.source.exp + '/' + this.source.maxExp,
            (this.expBar.x + this.expBar.w / 2) * tilesize * baseRatio,
            (this.expBar.y + 0.01) * tilesize * baseRatio
        );
        // renders lvl icon
        this.renderComponent(this.lvlIcon, context, tilesize, baseRatio)
        context.fillText(
            this.source.lv,
            (this.lvlIcon.x + this.lvlIcon.w / 2) * tilesize * baseRatio,
            (this.lvlIcon.y + this.lvlIcon.h) * tilesize * baseRatio
        );
    }
    renderFloorIcon(context, tilesize, baseRatio) {
        // renders icon
        this.renderComponent(this.floorIcon, context, tilesize, baseRatio)
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.fillStyle = '#fef3c0';
        context.font = 'bold ' + Math.round(this.fontSize * baseRatio) + 'px ' + this.font;
        context.fillText(
            map.currentFloor,
            (this.floorIcon.x + this.floorIcon.w * 1.05) * tilesize * baseRatio,
            (this.floorIcon.y + this.floorIcon.h / 1.7) * tilesize * baseRatio
        );
    }
}