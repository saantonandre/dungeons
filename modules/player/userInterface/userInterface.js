// import { mouse } from "./mouse.js";
// import { pointSquareCol } from './physics.js';
import { spritesheet } from "../../resourceManager.js";

export class UserInterface {
    constructor(source) {
        /*
            TODO:
            gradual damaged bar
        */
        this.fontSize = 7;
        this.source = source;
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
    renderSettingsIcon(context, tilesize, baseRatio) {
        //this.settingsIcon.action = pointSquareCol(mouse, this.settingsIcon) ? 1 : 0;
        // renders icon
        context.drawImage(
            this.sheet,
            this.settingsIcon.spriteX[this.settingsIcon.action][0] * tilesize,
            this.settingsIcon.spriteY[this.settingsIcon.action][0] * tilesize,
            this.settingsIcon.w * tilesize,
            this.settingsIcon.h * tilesize,
            this.settingsIcon.x * tilesize * baseRatio,
            this.settingsIcon.y * tilesize * baseRatio,
            this.settingsIcon.w * tilesize * baseRatio,
            this.settingsIcon.h * tilesize * baseRatio
        );
    }
    renderInventoryIcon(context, tilesize, baseRatio) {

        //this.inventoryIcon.action = pointSquareCol(mouse, this.inventoryIcon) ? 1 : 0;
        // renders icon
        context.drawImage(
            this.sheet,
            this.inventoryIcon.spriteX[this.inventoryIcon.action][0] * tilesize,
            this.inventoryIcon.spriteY[this.inventoryIcon.action][0] * tilesize,
            this.inventoryIcon.w * tilesize,
            this.inventoryIcon.h * tilesize,
            this.inventoryIcon.x * tilesize * baseRatio,
            this.inventoryIcon.y * tilesize * baseRatio,
            this.inventoryIcon.w * tilesize * baseRatio,
            this.inventoryIcon.h * tilesize * baseRatio
        );
    }
    renderEquipmentIcon(context, tilesize, baseRatio) {
        //this.equipmentIcon.action = pointSquareCol(mouse, this.equipmentIcon) ? 1 : 0;
        // renders icon
        context.drawImage(
            this.sheet,
            this.equipmentIcon.spriteX[this.equipmentIcon.action][0] * tilesize,
            this.equipmentIcon.spriteY[this.equipmentIcon.action][0] * tilesize,
            this.equipmentIcon.w * tilesize,
            this.equipmentIcon.h * tilesize,
            this.equipmentIcon.x * tilesize * baseRatio,
            this.equipmentIcon.y * tilesize * baseRatio,
            this.equipmentIcon.w * tilesize * baseRatio,
            this.equipmentIcon.h * tilesize * baseRatio
        );
    }
    renderHpBar(context, tilesize, baseRatio) {
        // variables

        // renders icon
        context.drawImage(
            this.sheet,
            this.hpIcon.spriteX[0][0] * tilesize,
            this.hpIcon.spriteY[0][0] * tilesize,
            this.hpIcon.w * tilesize,
            this.hpIcon.h * tilesize,
            this.hpIcon.x * tilesize * baseRatio,
            this.hpIcon.y * tilesize * baseRatio,
            this.hpIcon.w * tilesize * baseRatio,
            this.hpIcon.h * tilesize * baseRatio
        );
        // renders container
        context.drawImage(
            this.sheet,
            this.hpBar.spriteX[0][0] * tilesize,
            this.hpBar.spriteY[0][0] * tilesize,
            this.hpBar.w * tilesize,
            this.hpBar.h * tilesize,
            this.hpBar.x * tilesize * baseRatio,
            this.hpBar.y * tilesize * baseRatio,
            this.hpBar.w * tilesize * baseRatio,
            this.hpBar.h * tilesize * baseRatio
        );
        // renders damagedBar
        context.drawImage(
            this.sheet,
            this.damagedBar.spriteX[0][0] * tilesize,
            this.damagedBar.spriteY[0][0] * tilesize,
            this.hpBar.w * tilesize * this.hpBar.prevRatio,
            this.hpBar.h * tilesize,
            this.hpBar.x * tilesize * baseRatio,
            this.hpBar.y * tilesize * baseRatio,
            this.hpBar.w * tilesize * baseRatio * this.hpBar.prevRatio,
            this.hpBar.h * tilesize * baseRatio
        );
        // renders bar
        context.drawImage(
            this.sheet,
            this.hpBar.spriteX[1][0] * tilesize,
            this.hpBar.spriteY[1][0] * tilesize,
            this.hpBar.w * tilesize * this.hpRatio,
            this.hpBar.h * tilesize,
            this.hpBar.x * tilesize * baseRatio,
            this.hpBar.y * tilesize * baseRatio,
            this.hpBar.w * tilesize * baseRatio * this.hpRatio,
            this.hpBar.h * tilesize * baseRatio
        );
        // renders text
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#ad2f45';
        context.fontSize =
            'bold ' + Math.round(this.fontSize * baseRatio) + 'px ' + this.font;
        context.fillText(
            this.source.hp + '/' + this.source.maxHp,
            (this.hpBar.x + this.hpBar.w / 2) * tilesize * baseRatio,
            this.hpBar.y * tilesize * baseRatio
        );
    }
    renderManaBar(context, tilesize, baseRatio) {
        // variables

        // renders icond
        context.drawImage(
            this.sheet,
            this.manaIcon.spriteX[0][0] * tilesize,
            this.manaIcon.spriteY[0][0] * tilesize,
            this.manaIcon.w * tilesize,
            this.manaIcon.h * tilesize,
            this.manaIcon.x * tilesize * baseRatio,
            this.manaIcon.y * tilesize * baseRatio,
            this.manaIcon.w * tilesize * baseRatio,
            this.manaIcon.h * tilesize * baseRatio
        );
        // renders container
        context.drawImage(
            this.sheet,
            this.manaBar.spriteX[0][0] * tilesize,
            this.manaBar.spriteY[0][0] * tilesize,
            this.manaBar.w * tilesize,
            this.manaBar.h * tilesize,
            this.manaBar.x * tilesize * baseRatio,
            this.manaBar.y * tilesize * baseRatio,
            this.manaBar.w * tilesize * baseRatio,
            this.manaBar.h * tilesize * baseRatio
        );
        // renders damagedBar
        context.drawImage(
            this.sheet,
            this.damagedBar.spriteX[0][0] * tilesize,
            this.damagedBar.spriteY[0][0] * tilesize,
            this.manaBar.w * tilesize * this.manaBar.prevRatio,
            this.manaBar.h * tilesize,
            this.manaBar.x * tilesize * baseRatio,
            this.manaBar.y * tilesize * baseRatio,
            this.manaBar.w * tilesize * baseRatio * this.manaBar.prevRatio,
            this.manaBar.h * tilesize * baseRatio
        );
        // renders bar
        context.drawImage(
            this.sheet,
            this.manaBar.spriteX[1][0] * tilesize,
            this.manaBar.spriteY[1][0] * tilesize,
            this.manaBar.w * tilesize * this.manaRatio,
            this.manaBar.h * tilesize,
            this.manaBar.x * tilesize * baseRatio,
            this.manaBar.y * tilesize * baseRatio,
            this.manaBar.w * tilesize * baseRatio * this.manaRatio,
            this.manaBar.h * tilesize * baseRatio
        );

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
        context.drawImage(
            this.sheet,
            this.expIcon.spriteX[0][0] * tilesize,
            this.expIcon.spriteY[0][0] * tilesize,
            this.expIcon.w * tilesize,
            this.expIcon.h * tilesize,
            this.expIcon.x * tilesize * baseRatio,
            this.expIcon.y * tilesize * baseRatio,
            this.expIcon.w * tilesize * baseRatio,
            this.expIcon.h * tilesize * baseRatio
        );
        // renders container
        context.drawImage(
            this.sheet,
            this.expBar.spriteX[0][0] * tilesize,
            this.expBar.spriteY[0][0] * tilesize,
            this.expBar.w * tilesize,
            this.expBar.h * tilesize,
            this.expBar.x * tilesize * baseRatio,
            this.expBar.y * tilesize * baseRatio,
            this.expBar.w * tilesize * baseRatio,
            this.expBar.h * tilesize * baseRatio
        );
        // renders bar
        context.drawImage(
            this.sheet,
            this.expBar.spriteX[1][0] * tilesize,
            this.expBar.spriteY[1][0] * tilesize,
            this.expBar.w * tilesize * this.expRatio,
            this.expBar.h * tilesize,
            this.expBar.x * tilesize * baseRatio,
            this.expBar.y * tilesize * baseRatio,
            this.expBar.w * tilesize * baseRatio * this.expRatio,
            this.expBar.h * tilesize * baseRatio
        );

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
        context.drawImage(
            this.sheet,
            this.lvlIcon.spriteX[0][0] * tilesize,
            this.lvlIcon.spriteY[0][0] * tilesize,
            this.lvlIcon.w * tilesize,
            this.lvlIcon.h * tilesize,
            this.lvlIcon.x * tilesize * baseRatio,
            this.lvlIcon.y * tilesize * baseRatio,
            this.lvlIcon.w * tilesize * baseRatio,
            this.lvlIcon.h * tilesize * baseRatio
        );
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = '#63ab3f';
        context.font = 'bold ' + Math.round(this.fontSize * baseRatio) + 'px ' + this.font;
        context.fillText(
            this.source.lv,
            (this.lvlIcon.x + this.lvlIcon.w / 2) * tilesize * baseRatio,
            (this.lvlIcon.y + this.lvlIcon.h) * tilesize * baseRatio
        );
    }
    renderFloorIcon(context, tilesize, baseRatio) {
        // renders icon
        context.drawImage(
            this.sheet,
            this.floorIcon.spriteX[0][0] * tilesize,
            this.floorIcon.spriteY[0][0] * tilesize,
            this.floorIcon.w * tilesize,
            this.floorIcon.h * tilesize,
            this.floorIcon.x * tilesize * baseRatio,
            this.floorIcon.y * tilesize * baseRatio,
            this.floorIcon.w * tilesize * baseRatio,
            this.floorIcon.h * tilesize * baseRatio
        );
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