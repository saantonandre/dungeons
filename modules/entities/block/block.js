import { Entity } from "../../entity/entity.js"
export class Block extends Entity {
    // A normal, collidable block
    constructor(x, y, type, rawLevel) {
        super(x, y);
        this.type = type;
        this.immovable = false;
        this.rawLevel = rawLevel;
        this.tile = tileSetter(rawLevel.tilesMap, x - rawLevel.x, y - rawLevel.y);
        this.background = true;
        this.solid = true;
        switch (type) {
            case 'hole':
                this.grounded = true;
                break;
        }
    }
    render(context, tilesize, ratio, camera) {
        context.drawImage(
            this.sheet,
            tiles[this.type][this.tile][0] * tilesize,
            tiles[this.type][this.tile][1] * tilesize,
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
tiles['wall'] = [
    [5, 4],
    [6, 4],
    [7, 4], // 0 - 1 - 2 holes UP
    [5, 5],
    [6, 5],
    [7, 5], // 3 - 4 - 5 holes MID
    [5, 6],
    [6, 6],
    [7, 6], // 6 - 7 - 8 holes DOWN
    [5, 7],
    [6, 7],
    [7, 7], // 9 - 10 - 11 holes HOR
    [8, 4],
    [8, 5],
    [8, 6], // 12 - 13 - 14 holes VER
    [8, 7], // 15 holes SINGLE
]

function tileSetter(array, xIndex, yIndex) {
    let sameType = array[xIndex][yIndex];

    let left = 0;
    let right = 0;
    let up = 0;
    let down = 0;

    if (xIndex - 1 < 0) {
        left = 1;
    } else if (array[xIndex - 1][yIndex]) {
        left = +(array[xIndex - 1][yIndex] === sameType)
    }
    if (xIndex + 1 >= array.length) {
        right = 1;
    } else if (array[xIndex + 1][yIndex]) {
        right = +(array[xIndex + 1][yIndex] === sameType)
    }

    if (yIndex - 1 < 0) {
        up = 1;
    } else if (array[xIndex][yIndex - 1]) {
        up = +(array[xIndex][yIndex - 1] === sameType)
    }

    if (yIndex + 1 >= array[xIndex].length) {
        down = 1;
    } else if (array[xIndex][yIndex + 1]) {
        down = +(array[xIndex][yIndex + 1] === sameType)
    }

    let binary = "" + left + up + right + down;
    let rawTile = parseInt(binary, 2);
    return adjustTile(rawTile);
    array[xIndex][yIndex].tile = adjustTile(rawTile);

}
/** Adjusts the tile id based on the standard tile placement of the spritesheet */
function adjustTile(tile) {
    switch (tile) {
        case 0:
            return 15;
        case 1:
            return 12;
        case 2:
            return 9;
        case 3:
            return 0;
        case 4:
            return 14;
        case 5:
            return 13;
        case 6:
            return 6;
        case 7:
            return 3;
        case 8:
            return 11;
        case 9:
            return 2;
        case 10:
            return 10;
        case 11:
            return 1;
        case 12:
            return 8;
        case 13:
            return 5;
        case 14:
            return 7;
        case 15:
            return 4;
        default:
            throw new Error("Tile error !!!");
    }

}