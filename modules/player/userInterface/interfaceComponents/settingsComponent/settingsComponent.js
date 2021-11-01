import { ImageComponent, InterfaceComponent, IconComponent } from "../interfaceComponent.js";
import { Text } from '../../../../text/text.js';

export class SettingsComponent extends InterfaceComponent {
    constructor(source, x, y) {
        super(source, x, y);
        this.ratio = 1;
        this.prevRatio = 1;
        this.w = 1;
        this.h = 1;
        this.color = '#fef3c0';

        this.icon = new IconComponent(this.x, this.y);
        this.icon.setAnimation('idle', [24], [26]);
        this.icon.setAnimation('highlight', [24], [27]);

    }
    compute(mouse, controls, deltaTime) {
        this.icon.compute(mouse, controls, deltaTime)
    }
    render(context, tilesize, baseRatio) {
        this.icon.render(context, tilesize, baseRatio);
    }
}