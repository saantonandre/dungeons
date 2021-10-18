import { SpriteComponent, InterfaceComponent } from "../interfaceComponent.js";


export class SettingsComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 1;
        this.h = 1;
        this.color = '#fef3c0';
        /** Active: 7, 9 */
        this.icon = new SpriteComponent(24, 26, this.x, this.y, this.w, 1);
    }
    compute(deltaTime) {}
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.icon);
    }
}