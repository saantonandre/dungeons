import { Sprite } from "../../../../entity/sprite.js"
import { IconComponent } from "../interfaceComponent.js";
import { soundManager } from "../../../../soundManager/soundManager.js";
/** Renders the game map */
export class MinimapComponent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.icon = new IconComponent(this.x, this.y);
        this.icon.setAnimation("idle", [30], [21]);
        this.icon.setAnimation("highlight", [30], [22]);
        this.icon.sound = soundManager.sounds['paper'];
    }
    compute(mouse, controls, deltaTime) {
        this.icon.compute(mouse, controls, deltaTime);
    }
    render(context, tilesize, baseRatio, gameMap, player) {
        this.icon.render(context, tilesize, baseRatio)
        if (this.icon.active) {
            this.renderMinimap(context, tilesize, baseRatio, gameMap, player)
        }
    }
    /**
     * TODO:
     * Integrate tilesize and baseRatio for the sizes
     * Proably needs to be reworked entirely
     */
    renderMinimap(context, tilesize, baseRatio, gameMap, player) {
        /** Size of the room rectangles in the minimap */
        let size = (tilesize * baseRatio) / 2;
        /** The currently iterated room */
        let boundingBox = gameMap.boundingBox;
        boundingBox.x /= gameMap.roomSize;
        boundingBox.y /= gameMap.roomSize;
        boundingBox.w /= gameMap.roomSize;
        boundingBox.h /= gameMap.roomSize;
        context.save();
        /** Minimap offset */
        context.translate(
            this.x * tilesize * baseRatio - boundingBox.w * size,
            (this.y + this.icon.h) * tilesize * baseRatio - boundingBox.h * size
        );
        let colors = ["gray", "RoyalBlue", "Khaki", "Brown", "darkgray", "#14182e"];
        /** Drawing the background */
        context.globalAlpha = 0.2;
        context.fillStyle = colors[0];
        context.fillRect(0, 0, boundingBox.w * size, boundingBox.h * size);
        context.globalAlpha = 1;
        for (let parsedRoom of gameMap.map) {
            for (let room of parsedRoom.components) {
                /** If the room hasn't been revealed, do not show it */
                if (!room.revealed) {
                    continue;
                }
                // Draws rooms
                context.fillStyle = colors[room.type];

                // Draws room
                context.fillRect(
                    (room.x - boundingBox.x) * size + size / 10,
                    (room.y - boundingBox.y) * size + size / 10,
                    size - size / 5,
                    size - size / 5
                );

                // Draws links
                for (let link of room.links) {
                    context.fillStyle = colors[4];
                    context.fillRect(
                        ((room.x + link.x) / 2 - boundingBox.x) * size + size / 2 - size / 10,
                        ((room.y + link.y) / 2 - boundingBox.y) * size + size / 2 - size / 10,
                        size / 5,
                        size / 5
                    );
                }

                // Draws Joints
                for (let joint of room.joints) {
                    context.fillStyle = colors[room.type];
                    context.fillRect(
                        ((room.x + joint.x) / 2 - boundingBox.x) * size + size / 10,
                        ((room.y + joint.y) / 2 - boundingBox.y) * size + size / 10,
                        size - size / 5,
                        size - size / 5
                    );
                }
            }
        }
        // Draws player
        context.fillStyle = colors[5];
        let px = player.x / gameMap.roomSize | 0;
        let py = player.y / gameMap.roomSize | 0;
        context.fillRect(
            (px - boundingBox.x) * size + size / 3,
            (py - boundingBox.y) * size + size / 3,
            size / 3,
            size / 3
        );
        context.globalAlpha = 1;
        context.restore();
    }
}