import { Room } from '../mapGen/components/room.js';
/** Will translate a mapGen map into an array of bidimensional number arrays */
export class MapParser {
    constructor() {
        /** @type {ParsedRoom[]} */
        this.parsedRooms = [];

        /**@type {Number} */
        this.x = 0;
        /**@type {Number} */
        this.x = 0;

        /**@type {Number} */
        this.w = 0;
        /**@type {Number} */
        this.h = 0;
    }
    /**
     * @param {Room[][]} roomChunks 
     */
    parseChunks(roomChunks, roomSize = 16) {
        this.parsedRooms.length = 0;
        let nx, ny, fx, fy;
        for (let chunk of roomChunks) {
            let parsed = new ParsedRoom(chunk, roomSize);
            this.parsedRooms.push(parsed);
            // Find the nearest and furthest x,y
            if (nx == undefined) {
                nx = parsed.x;
                ny = parsed.y;
                fx = parsed.x + parsed.w;
                fy = parsed.y + parsed.h;
            }
            if (parsed.x < nx) { nx = parsed.x }
            if (parsed.y < ny) { ny = parsed.y }
            if (parsed.x + parsed.w > fx) { fx = parsed.x + parsed.w }
            if (parsed.y + parsed.h > fy) { fy = parsed.y + parsed.h }
        }
        // Set the size for the whole map
        this.x = nx;
        this.y = ny;
        this.w = fx - nx;
        this.h = fy - ny;
        return this.parsedRooms;
    }
    // Finish coding this
    render = (canvas, context, sz) => {
        let size = sz / 16;
        canvas.width = size * this.w;
        canvas.height = size * this.h;
        context.clear();
        for (let room of this.parsedRooms) {
            for (let x = 0; x < room.w; x++) {
                for (let y = 0; y < room.h; y++) {
                    switch (room.tilesMap[x][y]) {
                        case 0:
                            continue;
                        case 1:
                            context.fillStyle = "gray";
                            break;
                        case 2:
                            context.fillStyle = "black";
                            break;
                        case 3:
                            context.fillStyle = "brown";
                            break;
                    }
                    context.fillRect(
                        (room.x + x - this.x) * size,
                        (room.y + y - this.y) * size,
                        size,
                        size,
                    )
                }
            }
        }
    }
}
/** Single room cell width and height */
class ParsedRoom {
    /**
     * @param {Room[]} rooms
     */
    constructor(rooms, size) {
        /**@type {Number} */
        this.x;
        /**@type {Number} */
        this.y;

        /**@type {Number} */
        this.w;
        /**@type {Number} */
        this.h;

        /**@type {Number} */
        this.type;

        /**@type {Number} @constant*/
        this.BASE_SIZE = size;

        /**@type {Boolean} */
        this.revealed = false;

        /**@type {Number[][]} */
        this.tilesMap = [];

        /**@type {Number[][]} */
        this.entitiesMap = [];

        /**@type {Room[]} */
        this.components = [];

        this.id = 0;

        this.generate(rooms);
    }
    /**
     * @param {Room[]} roomsChunks 
     */
    generate(roomsChunk) {
        this.type = roomsChunk[0].type;
        this.id = roomsChunk[0].jointID;
        if (this.type === 1) {
            this.revealed = true;
        }
        // Find nearest x, furthest x, nearest y, furthest y
        let nx, ny, fx, fy
        for (let room of roomsChunk) {
            this.components.push(room)
            if (nx == undefined) {
                nx = room.x;
                ny = room.y;
                fx = room.x + 1;
                fy = room.y + 1;
                continue;
            }
            if (room.x + 1 > fx) { fx = room.x + 1 } else if (room.x < nx) { nx = room.x }
            if (room.y + 1 > fy) { fy = room.y + 1 } else if (room.y < ny) { ny = room.y }
        }
        this.x = nx * this.BASE_SIZE;
        this.y = ny * this.BASE_SIZE;
        this.w = (fx - nx) * this.BASE_SIZE;
        this.h = (fy - ny) * this.BASE_SIZE;

        // Create an empty array of the defined size
        for (let x = 0; x < this.w; x++) {
            this.tilesMap.push([]);
            for (let y = 0; y < this.h; y++) {
                this.tilesMap[x].push(0);
            }
        }

        let tile = 1;
        let wall = 2;
        for (let room of roomsChunk) {
            let rx = room.x * this.BASE_SIZE - this.x;
            let ry = room.y * this.BASE_SIZE - this.y;
            let rw = this.BASE_SIZE;
            let rh = this.BASE_SIZE;
            // Fills the room space with floor tiles
            for (let x = rx; x < rx + rw; x++) {
                for (let y = ry; y < ry + rh; y++) {
                    this.tilesMap[x].splice(y, 1, tile);
                }
            }
            // Replace side tiles with walls


            //Check joint sides
            let jointL = room.isSideJoint('left'),
                jointR = room.isSideJoint('right'),
                jointU = room.isSideJoint('up'),
                jointD = room.isSideJoint('down');

            // Creates walls where there are no joints
            for (let y = ry; y < ry + rh; y++) {
                // Left/right walls
                if (!jointL) {
                    this.tilesMap[rx].splice(y, 1, wall);
                }

                if (!jointR) {
                    this.tilesMap[rx + rw - 1].splice(y, 1, wall);
                }
            }
            for (let x = rx; x < rx + rw; x++) {
                // up/down walls
                if (!jointU) {
                    this.tilesMap[x].splice(ry, 1, wall);
                }

                if (!jointD) {
                    this.tilesMap[x].splice(ry + rh - 1, 1, wall);
                }
            }

            //Check link sides
            let linkL = room.isSideLink('left'),
                linkR = room.isSideLink('right'),
                linkU = room.isSideLink('up'),
                linkD = room.isSideLink('down');

            // Creates doors where there are links but no joints
            let door = 3;
            let doorSize = this.BASE_SIZE % 2 ? 5 : 4;
            if (linkL && !jointL) {
                for (let i = 0; i < doorSize; i++) {
                    let y = ry + rh / 2 - doorSize / 2;
                    this.tilesMap[rx].splice(y + i, 1, door);
                }
            }
            if (linkR && !jointR) {
                for (let i = 0; i < doorSize; i++) {
                    let y = ry + rh / 2 - doorSize / 2;
                    this.tilesMap[rx + rw - 1].splice(y + i, 1, door);
                }
            }
            if (linkU && !jointU) {
                for (let i = 0; i < doorSize; i++) {
                    let x = rx + rw / 2 - doorSize / 2;
                    this.tilesMap[x + i].splice(ry, 1, door);
                }
            }
            if (linkD && !jointD) {
                for (let i = 0; i < doorSize; i++) {
                    let x = rx + rw / 2 - doorSize / 2;
                    this.tilesMap[x + i].splice(ry + rh - 1, 1, door);
                }
            }


        }

    }

}