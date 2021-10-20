import { ImageComponent, TextComponent, InterfaceComponent } from "./interfaceComponent.js";

export class ExpComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 5;
        this.h = 1;
        this.color = '#63ab3f';
        this.contour = new ImageComponent(13, 11, this.x, this.y, this.w, this.h);
        this.progressBar = new ImageComponent(13, 12, this.x, this.y, this.w, this.h);
        this.icon = new ImageComponent(12, 11, this.x - 1, this.y, 1, 1);
        this.text = new TextComponent(this.x + this.w / 2, this.y, this.color);

        this.levelIcon = new ImageComponent(12, 12, this.x + 5, this.y - 0.5, 1, 1);
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

        this.contour.render(context, tilesize, baseRatio);
        this.progressBar.render(context, tilesize, baseRatio, this.ratio);
        this.icon.render(context, tilesize, baseRatio);
        this.text.render(context, tilesize, baseRatio);

        this.levelIcon.render(context, tilesize, baseRatio);
        this.levelText.render(context, tilesize, baseRatio);

    }
}