import { ImageComponent, TextComponent, InterfaceComponent } from "./interfaceComponent.js";


export class FloorComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 2;
        this.h = 1;
        this.color = '#fef3c0';
        this.icon = new ImageComponent(12, 14, this.x, this.y - 0.5, this.w, 1);
        this.text = new TextComponent(this.x + this.w / 2, this.y + 0.5, this.color);
    }
    compute(deltaTime) {
        this.text.content = `${this.source.director.floor}`;
    }
    render(context, tilesize, baseRatio) {
        this.icon.render(context, tilesize, baseRatio);
        this.text.render(context, tilesize, baseRatio);
    }
}