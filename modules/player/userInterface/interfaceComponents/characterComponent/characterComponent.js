import { InterfaceComponent, IconComponent, TextComponent } from "../interfaceComponent.js";

export class CharacterComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 1;
        this.h = 1;
        this.icon = new IconComponent(this.x, this.y);
        this.icon.setAnimation('idle', [22], [26]);
        this.icon.setAnimation('highlight', [22], [27]);

        this.box = new ContentBox(this.x - 8, this.y + 1);
    }
    compute(mouse, controls, deltaTime) {
        this.icon.compute(mouse, controls, deltaTime);
        if (this.icon.active) {
            this.box.compute(mouse, controls, deltaTime);
        }
    }
    render(context, tilesize, baseRatio) {
        this.icon.render(context, tilesize, baseRatio);
        if (this.icon.active) {
            this.box.render(context, tilesize, baseRatio);
        }
    }
}
/**
 * !!! PROVISIONAL !!!
 * needs to: Render all the info about the player
 */
class ContentBox {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 7;
        this.h = 7;

    }
    compute(mouse, controls, deltaTime, source) {

    }
    render(context, tilesize, baseRatio) {
        // this.renderBox(context, tilesize, baseRatio);
    }
    renderBox(context, tilesize, ratio) {
        context.globalAlpha = 0.6;
        context.fillStyle = "#14182e";
        /** Sum of own components height */

        context.fillRect(
            (this.x) * tilesize * ratio,
            (this.y) * tilesize * ratio,
            (this.w) * tilesize * ratio,
            (this.h) * tilesize * ratio,
        )
        context.beginPath();
        context.strokeStyle = "#14182e";
        context.lineWidth = ratio;
        context.rect(
            (this.x) * tilesize * ratio,
            (this.y) * tilesize * ratio,
            (this.w) * tilesize * ratio,
            (this.h) * tilesize * ratio,
        )
        context.closePath();
        context.stroke()
        context.globalAlpha = 1;
    }
}