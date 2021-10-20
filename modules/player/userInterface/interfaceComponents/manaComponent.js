import { ImageComponent, TextComponent, InterfaceComponent } from "./interfaceComponent.js";

export class ManaComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 3;
        this.h = 1;

        this.contour = new ImageComponent(6, 12, this.x, this.y, this.w, this.h);
        this.prevBar = new ImageComponent(9, 13, this.x, this.y, this.w, this.h);
        this.progressBar = new ImageComponent(9, 12, this.x, this.y, this.w, this.h);
        this.icon = new ImageComponent(5, 12, this.x - 1, this.y, 1, 1);
        this.color = '#4fa4b8';

        this.text = new TextComponent(this.x + this.w / 2, this.y, this.color);
    }
    compute(deltaTime) {
        this.ratio = this.source.mana / this.source.maxMana;
        let overcharge = 0;
        if (this.ratio > 1) {
            this.ratio = 1;
            overcharge = this.source.mana - this.source.maxMana;
        }

        if (this.prevRatio > this.ratio) {
            this.prevRatio -= deltaTime / 200;
        }
        if (this.prevRatio < this.ratio) {
            this.prevRatio = this.ratio;
        }
        if (overcharge > 0) {
            this.text.content = `${this.source.maxMana}+${overcharge} / ${this.source.maxMana}`;
        } else {
            this.text.content = `${this.source.mana} / ${this.source.maxMana}`;
        }
    }
    /** 
     * - Render the contour
     * - Render the damaged bar according to prevRatio
     * - Render the actual bar according to the ratio
     */
    render(context, tilesize, baseRatio) {
        this.contour.render(context, tilesize, baseRatio);
        this.prevBar.render(context, tilesize, baseRatio, this.prevRatio);
        this.progressBar.render(context, tilesize, baseRatio, this.ratio);
        this.icon.render(context, tilesize, baseRatio);
        this.text.render(context, tilesize, baseRatio);
    }
}