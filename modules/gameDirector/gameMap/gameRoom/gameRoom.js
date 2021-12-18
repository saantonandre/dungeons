import { RoomParser } from './roomParser/roomParser.js'
let roomParser = new RoomParser();
/** The GameRoom object has all the final data about a single room,
 *  knows about its tiles, entities, boundaries, knows if it has been revealed 
 *  by the player, and it can communicate with other GameRooms (in order to
 *  migrate its entities).
 */
export class GameRoom {
    /**
     * @param {ParsedRoom} parsedRoom  
     */
    constructor(parsedRoom) {

        this.x = parsedRoom.x;
        this.y = parsedRoom.y;
        this.w = parsedRoom.w;
        this.h = parsedRoom.h;
        this.type = parsedRoom.type;
        this.id = parsedRoom.id;
        //this.revealed = parsedRoom.revealed;
        this.revealed = false;
        /** Component rooms @type {Room[]} */
        this.components = parsedRoom.components;
        let parsed = roomParser.parse(parsedRoom);
        //console.log(parsed)
        this.entities = parsed.entities;
        this.floor = parsed.floor;
        this.portals = parsed.portals;
        this.assignIDs();
    }
    /** Assigns this.id to every entity in this.entities */
    assignIDs() {
        this.entities.forEach(entity => {
            entity.currentRoom = this.id;
        })
    }
    /** Reveals the room and its component rooms */
    reveal() {
        this.revealed = true;
        for (let component of this.components) {
            component.revealed = true;
        }
    }
    /**
     * @param {GameRoom} gameRoom 
     * @param {Entity} entity 
     */
    migrateEntity(entity, gameRoom) {

    }
    compute() {

    }

}