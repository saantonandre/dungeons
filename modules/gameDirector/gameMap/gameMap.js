import { MapGenerator } from "./mapGen/mapGen.js";
import { MapParser } from "./mapParser/mapParser.js";
import { GameRoom } from "./gameRoom/gameRoom.js";
import { pointRectCol } from "../../physics/physics.js";

class GameMap {
    constructor() {

        /** @type {MapGenerator} */
        this.mapGen = new MapGenerator();

        /** @type {MapParser} */
        this.mapParser = new MapParser();

        /** @type {Number} */
        this.width = 10;
        /** @type {Number} */
        this.height = 10;
        /** @type {Number} */
        this.roomAmount = 40;
        /** @type {Number} */
        this.roomSize = 16;

        /** @type {Room[][]} */
        this.rawMap = []; // Map provided by the generator
        /** @type {ParsedRoom[]} */
        this.parsedMap = []; // Map provided by the parser

        /** @type {GameRoom[]} */
        this.map = []; // Map generated
    }
    /**
     * Returns a square based on revealed rooms positions and sizes
     */
    get boundingBox() {
        let box = { x: undefined, y: undefined, w: undefined, h: undefined }
        for (let room of this.map) {
            if (!room.revealed) {
                continue;
            }
            if (typeof box.x == 'undefined') {
                box.x = room.x;
                box.y = room.y;
                box.w = room.w;
                box.h = room.h;
                continue;
            }
            if (room.x < box.x) {
                box.w += box.x - room.x
                box.x = room.x;
            }
            if (room.y < box.y) {
                box.h += box.y - room.y
                box.y = room.y;
            }
            if (room.x + room.w > box.x + box.w) {
                box.w = room.x + room.w - box.x;
            }
            if (room.y + room.h > box.y + box.h) {
                box.h = room.y + room.h - box.y;
            }

        }
        return box;
    }
    /** Creates both raw and soft parsed levels */
    generate = () => {
        this.rawMap = this.mapGen.generate(this.width, this.height, this.roomAmount, true, true)
        this.parsedMap = this.mapParser.parseChunks(this.rawMap, this.roomSize);

        for (let parsedRoom of this.parsedMap) {
            this.map.push(new GameRoom(parsedRoom));
        }
    }
    /** Returns the starting level of the current map */
    findStart = () => {
        for (let room of this.map) {
            if (room.type == 1) {
                return room;
            }
        }
        throw new Error("The map is missing the starting level (a level of type:1)");
    }
    /** Returns the room containing the given coordinates in the form of an object containing {x,y} properties */
    findRoom = (point, revealed = false) => {
        for (let room of this.map) {
            if (!revealed && !room.revealed) {
                continue;
            }
            for (let comp of room.components) {
                let compBox = { x: comp.x * this.roomSize, y: comp.y * this.roomSize, w: this.roomSize, h: this.roomSize };
                if (pointRectCol(point, compBox)) {
                    return room;
                }
            }
        }
        // If the room was not found, returns the first room
        return this.map[0];
    }

}
export const gameMap = new GameMap();