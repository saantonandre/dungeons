import { ImageComponent, TextComponent, InterfaceComponent } from "./interfaceComponent.js";
export class HpComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 3;
        this.h = 1;
        this.contour = new ImageComponent(6, 11, this.x, this.y, this.w, this.h);
        this.prevBar = new ImageComponent(9, 13, this.x, this.y, this.w, this.h);
        this.progressBar = new ImageComponent(9, 11, this.x, this.y, this.w, this.h);
        this.icon = new ImageComponent(5, 11, this.x - 1, this.y, 1, 1);
        this.color = '#ad2f45';
        this.text = new TextComponent(this.x + this.w / 2, this.y, this.color);
    }
    compute(deltaTime) {
        this.ratio = this.source.hp / this.source.maxHp;

        let overcharge = 0;
        if (this.ratio > 1) {
            this.ratio = 1;
            overcharge = this.source.hp - this.source.maxHp;
        }

        if (this.prevRatio > this.ratio) {
            this.prevRatio -= deltaTime / 200;
        }
        if (this.prevRatio < this.ratio) {
            this.prevRatio = this.ratio;
        }
        if (overcharge > 0) {
            this.text.content = `${this.source.maxHp}+${overcharge} / ${this.source.maxHp}`;
        } else {
            this.text.content = `${this.source.hp} / ${this.source.maxHp}`;
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