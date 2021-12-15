import * as Entities from "../../../../entities/entities.js";
/** Returns entity and Floor */
export class RoomParser {
    constructor() {}

    /** 
     * Types: 
     * - 0: Null
     * - 1: floor Tile 
     * - 2: Wall
     * - 3: Door
     */
    /** Translates the cells of a level to Entities and Floor  
     * @param {ParsedRoom} rawRoom a bidimensional array of numbers
     */
    parse(rawRoom) {
        let entities = [],
            floor = [],
            portals = [];
        for (let x = 0; x < rawRoom.tilesMap.length; x++) {
            for (let y = 0; y < rawRoom.tilesMap[x].length; y++) {
                // Let's make test dummy appears randomly in each room #testing
                if (rawRoom.tilesMap[x][y] == 1) {
                    rawRoom.tilesMap[x][y] = Math.random() * 10 > 9.9 ? 4 : 1;
                }

                let entity;
                switch (rawRoom.tilesMap[x][y]) {
                    case 0:
                        // Nothing 
                        break;
                    case 1:
                        // Just floor
                        floor.push(new Entities.FloorTile(x + rawRoom.x, y + rawRoom.y));
                        break;
                    case 2:
                        // Walls
                        entity = new Entities.Block(x + rawRoom.x, y + rawRoom.y, "wall", rawRoom);
                        entity.environment = entities;
                        entities.push(entity);
                        break;
                    case 3:
                        // Door (just floor for now)
                        floor.push(new Entities.FloorTile(x + rawRoom.x, y + rawRoom.y));
                        break;
                    case 4:
                        // Dummy
                        entity = new Entities.Slime(x + rawRoom.x, y + rawRoom.y);
                        entity.environment = entities;
                        entities.push(entity);
                        floor.push(new Entities.FloorTile(x + rawRoom.x, y + rawRoom.y));
                        break;
                }

            }
        }
        for (let entity of entities) {
            if (entity.type === "portal") {
                portals.push(entity);
            }
        }
        return { entities: entities, floor: floor, portals: portals };
    }
}