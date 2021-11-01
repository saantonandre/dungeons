import { Sprite } from "../../../../entity/sprite.js"
import { IconComponent } from "../interfaceComponent.js";
/** Renders the game map */
export class MinimapComponent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.icon = new IconComponent(this.x, this.y);
        this.icon.setAnimation("idle", [30], [21]);
        this.icon.setAnimation("highlight", [30], [22]);
    }
    compute(mouse, controls, deltaTime) {
        this.icon.compute(mouse, controls, deltaTime);
    }
    render(context, tilesize, baseRatio, map, currentLevel) {
        this.icon.render(context, tilesize, baseRatio)
        if (this.icon.active) {
            this.renderMinimap(context, tilesize, baseRatio, map, currentLevel)
        }
    }
    /**
     * TODO:
     * Integrate tilesize and baseRatio for the sizes
     * Proably needs to be reworked entirely
     */
    renderMinimap(context, tilesize, baseRatio, map, currentLevel) {
        /** Size of the room rectangles in the minimap */
        let size = (tilesize * baseRatio) / 2;
        /** The currently iterated room */
        let room;
        context.save();
        /** Minimap offset */
        context.translate(
            this.x * tilesize * baseRatio - map.width * size,
            (this.y + this.icon.h) * tilesize * baseRatio - map.height * size
        );
        /** Drawing the background */
        context.globalAlpha = 0.2;
        context.fillStyle = "#a3a7c2";
        context.fillRect(0, 0, map.width * size, map.height * size);
        context.globalAlpha = 1;
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                room = map.levels[i][j];
                /** Skip if empty room */
                if (room == 0) {
                    continue;
                }
                /** If the room hasn't been revealed, do not show it */
                if (!room.revealed) {
                    continue;
                }
                // Draws rooms
                switch (room.type) {
                    case 0:
                        context.fillStyle = "#14182e";
                        break;
                    case 1:
                        context.fillStyle = "#686f99";
                        break;
                    case 2:
                        context.fillStyle = "#f0b541";
                        break;
                    case 3:
                        context.fillStyle = "#ad2f45";
                        break;
                }
                context.fillRect(
                    i * size + size / 10,
                    j * size + size / 10,
                    size - size / 5,
                    size - size / 5
                );
                // Draws links
                for (let link of room.links) {
                    context.fillStyle = "#f5ffe8";
                    context.fillRect(
                        (i + link[0] / 2) * size + size / 2 - size / 10,
                        (j + link[1] / 2) * size + size / 2 - size / 10,
                        size / 5,
                        size / 5
                    );
                }

                if (currentLevel[0] === i && currentLevel[1] === j) {
                    context.globalAlpha = 0.8;
                    context.fillStyle = "#ffee83";
                    context.fillRect(
                        i * size + size / 3,
                        j * size + size / 3,
                        size - size / 1.5,
                        size - size / 1.5
                    );
                }
            }
        }
        context.globalAlpha = 1;
        context.restore();
    }
}

/** The bag shaped icon, handles clicks/hovering and activates the UI */
class Icon extends Sprite {
    constructor(x, y) {
        super(x, y);
        this.animation = 'idle';
        this.setAnimation("idle", [30], [21]);
        this.setAnimation("highlight", [30], [22]);
        this.active = false;
    }
    // If mouse is hover this element
    handleHover(controls) {
        if (controls.lClickDown) {
            // If left btn down
            if (this.animation !== 'idle') {
                // If this isn't in the 'idle' state (eg. is highlighted)
                // - Change this animation to 'idle' and this state to 'active'
                this.loadAnimation('idle');
                this.active = !this.active;
            }
        } else {
            // If mouse is hovering but not clicked, highlight
            this.loadAnimation('highlight');
        }
    }
    compute(mouse, controls, deltaTime) {
        if (pointSquareCol(mouse, this)) {
            mouse.hoverUI = true;
            this.handleHover(controls)
        } else {
            if (this.animation === 'highlight') {
                this.animation = 'idle';
            }
        }
        this.updateSprite(deltaTime);
    }
    render(context, tilesize, baseRatio) {
        this.renderSprite(context, tilesize, baseRatio);
    }
}

function pointSquareCol(point, sq) {
    var square = sq;
    if (sq.hitbox !== undefined) {
        square = sq.hitbox;
    }
    if (point.x >= square.x) {
        if (point.x <= square.x + square.w) {
            if (point.y >= square.y) {
                if (point.y <= square.y + square.h) {
                    return true;
                }
            }

        }
    }
    return false;
}