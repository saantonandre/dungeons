import { SpriteComponent, TextComponent, InterfaceComponent } from "./interfaceComponent.js";

export class ManaComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 3;
        this.h = 1;

        this.contour = new SpriteComponent(6, 12, this.x, this.y, this.w, this.h);
        this.prevBar = new SpriteComponent(9, 13, this.x, this.y, this.w, this.h);
        this.progressBar = new SpriteComponent(9, 12, this.x, this.y, this.w, this.h);
        this.icon = new SpriteComponent(5, 12, this.x - 1, this.y, 1, 1);
        this.color = '#4fa4b8';

        this.text = new TextComponent(this.x + this.w / 2, this.y, this.color);
    }
    compute(deltaTime) {
        this.ratio = this.source.mana / this.source.maxMana;
        if (this.prevRatio > this.ratio) {
            this.prevRatio -= deltaTime / 200;
        }
        if (this.prevRatio < this.ratio) {
            this.prevRatio = this.ratio;
        }
        this.text.content = `${this.source.mana} / ${this.source.maxMana}`;

    }
    /** 
     * - Render the contour
     * - Render the damaged bar according to prevRatio
     * - Render the actual bar according to the ratio
     */
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio, this.contour);
        this.renderSprite(context, tilesize, baseRatio, this.prevBar, this.prevRatio);
        this.renderSprite(context, tilesize, baseRatio, this.progressBar, this.ratio);
        this.renderSprite(context, tilesize, baseRatio, this.icon);
        this.renderText(context, tilesize, baseRatio, this.text);
    }
}