import * as Entities from "./../../entities/entities.js";
/** Returns entity and Floor */
export class LevelParser {
    constructor() {

    }
    /** Translates the cells of a level to Entities and Floor  */


    /** 
     * Types: 
     * - 0: Null
     * - 1: Wall 
     * - 2: Portal 
     * - 3: Holes 
     * - 4: Spawn point 
     * - 5: Floor portal 
     * - 10: Slime
     * - 11: Bat
     */
    parse(rawLevel) {
        let entities = [],
            floor = [],
            portals = [];
        let entity;
        for (let x = 0; x < rawLevel.length; x++) {
            for (let y = 0; y < rawLevel[x].length; y++) {
                switch (rawLevel[x][y].type) {
                    case 0:
                        // Free block
                        break;
                    case 1:
                        entity = new Entities.Block(x, y, "wall", rawLevel);
                        //entity.tile = rawLevel[x][y].tile;
                        entity.environment = entities;
                        entities.push(entity);
                        break;
                    case 2:
                        entity = new Entities.Portal(x, y, rawLevel[x][y].dir, rawLevel[x][y].id);
                        entity.environment = entities;
                        entities.push(entity);
                        break;
                    case 3:
                        entity = new Entities.Block(x, y, "hole", rawLevel);
                        //entity.tile = rawLevel[x][y].tile;
                        entity.environment = entities;
                        entities.push(entity);
                        break;
                    case 4:
                        // SpawnPoint
                        break;
                    case 5:
                        entity = new Entities.FloorPortal(x, y, rawLevel[x][y].dir, rawLevel[x][y].id);
                        entity.environment = entities;
                        entities.push(entity);
                        break;
                    case 10:
                        entity = new Entities.Slime(x, y);
                        entity.environment = entities;
                        entities.push(entity);
                        break;
                    case 11:
                        entity = new Entities.Bat(x, y);
                        entity.environment = entities;
                        entities.push(entity);
                        break;
                }

                floor.push(new Entities.Floor(x, y));
            }
        }
        entities = this.mergeSameIdEntities(entities);
        floor = floor;
        for (let entity of entities) {
            if (entity.type === "portal") {
                portals.push(entity);
            }
        }
        return { entities: this.mergeSameIdEntities(entities), floor: floor, portals: portals };
    }
    /** Merges toghether the entities with the same ID, like Portals */
    mergeSameIdEntities(entities) {
        let mergedEntities = [];
        for (let i = 0; i < entities.length; i++) {
            if (!(entities[i].id >= 0)) {
                continue;
            }
            mergedEntities.push(entities.splice(i, 1)[0])
            i--;
        }
        for (let i = 0; i < mergedEntities.length; i++) {
            for (let j = 0; j < mergedEntities.length; j++) {
                if (i == j) {
                    continue;
                }
                if (mergedEntities[i].id == mergedEntities[j].id) {
                    // removes the same entity, but adds the size to the original
                    if (mergedEntities[j].x < mergedEntities[i].x) {
                        mergedEntities[i].x = mergedEntities[j].x;
                        mergedEntities[i].w += mergedEntities[j].w;
                    }
                    if (mergedEntities[j].y < mergedEntities[i].y) {
                        mergedEntities[i].y = mergedEntities[j].y;
                        mergedEntities[i].h += mergedEntities[j].h;
                    }
                    if (mergedEntities[j].x > mergedEntities[i].x) {
                        mergedEntities[i].w += mergedEntities[j].w;
                    }
                    if (mergedEntities[j].y > mergedEntities[i].y) {
                        mergedEntities[i].h += mergedEntities[j].h;
                    }
                    mergedEntities.splice(j, 1);
                    j--;
                }
            }
        }
        return entities.concat(mergedEntities);
    }
}