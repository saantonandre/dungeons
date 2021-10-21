import { Entity } from "../../entity/entity.js"
export class FloorTile extends Entity {
    // A normal, collidable block
    constructor(x, y) {
        super(x, y);
        this.type = "bg";
        this.immovable = false;
        this.tiles = [
            [0, 3], // Normal
            [1, 3], // Normal
            [2, 3], // Normal
            [0, 4], // Normal
            [1, 4], // Normal
            [2, 4] // Normal
        ]
        this.tile = (Math.random() * this.tiles.length) | 0;
        this.solid = false;
    }
    render(context, tilesize, ratio, camera) {
        context.drawImage(
            this.sheet,
            this.tiles[this.tile][0] * tilesize,
            this.tiles[this.tile][1] * tilesize,
            tilesize,
            tilesize,
            ((this.x + camera.x) * tilesize * ratio) | 0,
            ((this.y + camera.y) * tilesize * ratio) | 0,
            this.w * tilesize * ratio,
            this.h * tilesize * ratio
        );
    }
}