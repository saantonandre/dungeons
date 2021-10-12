import { Entity } from "../../entity/entity.js"
export class Block extends Entity {
    // A normal, collidable block
    constructor(x, y, sprite) {
        super(x, y);
        this.type = "bg";
        this.which = sprite;
        this.immovable = false;
        this.tile = 0;
    }
    render(context, tilesize, ratio, camera) {
        context.drawImage(
            this.sheet,
            tiles[this.which][this.tile][0] * tilesize,
            tiles[this.which][this.tile][1] * tilesize,
            tilesize,
            tilesize,
            ((this.x + camera.x) * tilesize * ratio) | 0,
            ((this.y + camera.y) * tilesize * ratio) | 0,
            this.w * tilesize * ratio,
            this.h * tilesize * ratio
        );
    }
}
/** Standard:
 * 
 * - 0--1--2---12
 * - 3--4--5---13
 * - 6--7--8---14
 * - - -
 * - 9--10-11--15
 */
const tiles = {};
tiles['wall'] = [
    [1, 1], // 0 - tile
    [0, 0],
    [1, 0],
    [2, 0], // 1 - 2 - 3 upper walls
    [0, 1],
    [2, 1], // 4 - 5 side walls
    [0, 2],
    [1, 2],
    [2, 2], // 6 - 7 - 8 down walls
    [3, 0],
    [4, 0], // 9 - 10 right/left breaks (up)
    [3, 1],
    [4, 1], // 11 - 12  right/left breaks (down)
    [3, 2],
    [3, 3], // 13 - 14  up/down breaks (left)
    [4, 2],
    [4, 3], // 15 - 16  up/down breaks (right)
]
tiles['hole'] = [
    [5, 0],
    [6, 0],
    [7, 0], // 0 - 1 - 2 holes UP
    [5, 1],
    [6, 1],
    [7, 1], // 3 - 4 - 5 holes MID
    [5, 2],
    [6, 2],
    [7, 2], // 6 - 7 - 8 holes DOWN
    [5, 3],
    [6, 3],
    [7, 3], // 9 - 10 - 11 holes HOR
    [8, 0],
    [8, 1],
    [8, 2], // 12 - 13 - 14 holes VER
    [8, 3], // 15 holes SINGLE
]