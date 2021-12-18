import { gameMap } from "./gameMap/gameMap.js";
import { vfxManager } from "../vfxManager/vfxManager.js";
import { Camera } from "./camera/camera.js";

import { Player } from "../player/player.js";

import { Controls } from "../controls/controls.js";
import { Mouse } from "../mouse/mouse.js";

// import { debug } from '../debug/debug.js';
class GameDirector {

    constructor() {

        /**  Defines the this.player position in the bidimensional map array [y, x] */
        this.currentLevel = [0, 0]

        this.controls = new Controls();
        /** Defines the current floor */
        this.floor = 0;
        /** The current level Object, contains info about the level entities and tiles 
         * @type {Entity[]}
         */
        this.entities = [];
        this.portals = [];
        this.tiles = [];
        this.vfxs = [];
        this.player;
        this.mouse;
        this.camera = new Camera();
        this.camera.focus = this.player;
        this.gameMap = gameMap;
        vfxManager.setEnvironment(this.vfxs)

        /** Sets up the vfxManager */
        this.vfxRecyclePool = vfxManager.recyclePool;

        /* 
        // Easter egg (makes the player appear sleeping when the tab is not visible)
        this.tabbedOut = false;
        document.addEventListener("visibilitychange", (evt) => {
            this.tabbedOut = document.visibilityState == 'hidden' ? true : false;
            if (this.tabbedOut && this.player.state === 'idle') {
                this.player.state = 'broke';
            }
        });
        */
    }
    /** 
     * - Generates the player
     * - Generates the map
     * - Loads the entities of the level
     * - Places the this.player at the center of the map
     * 
     * @param {Meta} meta
     * @param {HTMLCanvasElement} canvas 
     */
    initialize(meta, canvas) {
        this.gameMap.generate();
        this.mouse = new Mouse(canvas, meta, this.camera);

        let start = gameMap.findStart();
        this.player = new Player(start.x + start.w / 2, start.y + start.h / 2, this);
        this.player.currentRoom = start.id;
        start.entities.push(this.player);
        this.camera.changeFocus(this.player);
    }
    /** Deletes removed entities and moves the vfxs to the recycle pool 
     * @param {Entity[] | Vfx[]} garbage Array with references of the removed entities
     *  @param {'entity' | 'vfx'} type Defines which is the type of the passed array ('entity' || 'vfx')
     */
    garbageCleaner(garbage, type = 'entity') {
        for (let i = garbage.length - 1; i >= 0; i--) {
            switch (type) {
                case 'vfx':
                    this.vfxRecyclePool.push(this.vfxs.splice(garbage[i], 1)[0]);
                    break;
                case 'entity':
                    let entity = this.entities[garbage[i]];
                    // Dispatches the entity's drops
                    for (let drop of entity.drops) {
                        drop.dispatch(this.gameMap.findRoom(entity).entities);
                    }
                    let entityRoom = this.gameMap.findRoom(entity);
                    // Removes the entity from its current room
                    entityRoom.entities.splice(entityRoom.entities.indexOf(entity), 1);

                    // Removes the entity from the current entities array
                    this.entities.splice(this.entities.indexOf(entity), 1);
                    break;
                    d
            }
        }
    }
    /** 
     * Populates the entities/tiles arrays with references of 
     * eligible entities.
     * Entities are 'eligible' only if the room has been revealed, 
     * and if they are within the screen boundaries.
     * 
     * @param {Meta} meta 
     */
    findIterableEntities(meta) {
        this.entities.length = 0;
        this.tiles.length = 0;
        for (let room of this.gameMap.map) {
            if (!room.revealed) {
                for (let comp of room.components) {
                    let compBox = { x: comp.x * gameMap.roomSize, y: comp.y * gameMap.roomSize, w: gameMap.roomSize, h: gameMap.roomSize }
                    if (this.player.Physics.collided(this.player, compBox)) {
                        room.reveal();
                    }
                }
                if (!room.revealed) { continue }
            }
            for (let entity of room.entities) {
                if (!isOutOfScreen(entity, this.camera, meta)) {
                    this.entities.push(entity)
                }
            }
            for (let tile of room.floor) {
                if (!isOutOfScreen(tile, this.camera, meta)) {
                    this.tiles.push(tile)
                }
            }

        }
    }
    /** 
     * - Computes every entity
     * - Resolves collisions 
     * - Computes hp bars 
     * - Computes portals 
     * - Updates the camera
     * - Computes the UI
     * @param {Meta} meta
     */
    compute = (meta) => {
        this.mouse.updatePos();
        this.findIterableEntities(meta);

        /** Reiterates the computation if the level is recreated */
        let loadLevelCall = false;
        /** Where removed entities ends up 
         * @type {Entity[]}
         */
        let garbage = [];
        /** Where removed vfxs ends up 
         * @type {Vfx[]}
         */
        let vfxGarbage = [];

        // Computes the UI
        this.player.userInterface.compute(meta.deltaTime);

        // Calls the compute function on every entities
        for (let entity of this.entities) {
            entity.resolveCollisions(meta.deltaTime, this.entities);
            entity.compute(meta.deltaTime, this.entities);
            if (entity.removed) {
                // Pushes the entities to the garbage
                garbage.push(this.entities.indexOf(entity));
                continue;
            }
            if (entity.hasDisplayName) {
                entity.displayName.compute(this.mouse);
            }
            if (entity.hasHpBar) {
                entity.hpBar.compute(meta.deltaTime);
            }
        }

        // Portal specific computing, need comms with this, the map and the player
        for (let portal of this.portals) {
            loadLevelCall = portal.computePortal(meta, this);
            if (loadLevelCall) {
                // Stop computing other portals since they are now next level's portal
                break;
            }
        }
        for (let i = this.vfxs.length - 1; i >= 0; i--) {
            let vfx = this.vfxs[i];
            vfx.compute(meta.deltaTime);
            if (vfx.removed) {
                // Pushes the entities to the garbage
                let index = this.vfxs.indexOf(vfx);
                vfxGarbage.push(index);
                continue;
            }
        }

        this.updateEntitiesRoom(this.entities);

        this.garbageCleaner(garbage);
        this.garbageCleaner(vfxGarbage, 'vfx');

        this.camera.compute(meta, gameMap.boundingBox);

    }
    /** Updates the location of the entities in the gameMap */
    updateEntitiesRoom(entities) {
        entities.forEach(entity => {
            if (entity.currentRoom !== -1) {
                let parentRoom = this.gameMap.map.find(room => entity.currentRoom == room.id);
                let currentRoom = gameMap.findRoom(entity, false);
                if (parentRoom !== currentRoom) {
                    if (entity == this.player && !currentRoom.revealed) {
                        currentRoom.reveal();
                    }
                    entity.currentRoom = currentRoom.id;
                    currentRoom.entities.push(
                        parentRoom.entities.splice(
                            parentRoom.entities.indexOf(entity), 1)[0]
                    )
                }
            }
        })
    }

    /** 
     * - Sorts the entities based on their y pos
     * - Renders the floor tiles
     * - Renders the shadows
     * - Renders the entities
     * - Renders the hp bars
     * - Renders the UI
     * 
     * @param {CanvasRenderingContext2D} context The drawing context
     * @param {Meta} meta Meta object containing info about tilesize, pixel ratio, delta time
     */
    render = (context, meta) => {
        this.sortEntities();
        // Renders the floor (ground level) tiles
        for (let tile of this.tiles) {
            tile.render(context, meta.tilesize, meta.ratio, this.camera);
        }
        // Needs to be a separate cycle to avoid shadow overlapping to entities
        for (let entity of this.entities) {
            entity.renderShadow(context, meta.tilesize, meta.ratio, this.camera);
        }
        // Entities basic rendering
        for (let entity of this.entities) {
            entity.render(context, meta.tilesize, meta.ratio, this.camera);
            // Hitbox rendering
            //entity.renderHitbox(context, meta.tilesize, meta.ratio, this.camera)
        }
        // Needs to be a separate cycle to avoid entities overlapping the GUIs
        for (let entity of this.entities) {
            if (entity.hasDisplayName) {
                entity.displayName.render(context, meta.tilesize, meta.ratio, this.camera);
            }
            if (entity.hasHpBar) {
                entity.hpBar.render(context, meta.tilesize, meta.ratio, this.camera);
            }
        }
        // Renders Vfxs (provisional)
        for (let vfx of this.vfxs) {
            vfx.render(context, meta.tilesize, meta.ratio, this.camera);
        }
        //debug.render(context, meta.tilesize, meta.ratio, this.camera);
        this.player.userInterface.render(context, meta.tilesize, meta.baseRatio);
    }

    /** Sorts the entities by type (.background = true goes first) and vertical position (lower -> higher) */
    sortEntities() {
        this.entities.sort(function(a, b) {
            return (a.y + a.h) - (b.y + b.h);
        })
        this.entities.sort(function(a, b) {
            if (!a.background && b.background || a.type == 'vfx') {
                return 1;
            } else {
                return -1;
            }
        })
    }


}
export const gameDirector = new GameDirector();

/**
 * Checks whether an entity is outside of the screen boundaries
 * @param {Entity} entity 
 * @param {Camera} camera 
 * @param {Meta} meta 
 * @param {Number} margin 
 * @returns {Boolean} True if it's outside the boundaries / if the entity is null
 */
function isOutOfScreen(entity, camera, meta, margin = 1) {
    if (entity == null) {
        return true;
    }
    if (entity.x > meta.tilesWidth - camera.x + margin) {
        return true;
    }
    if (entity.x + margin + entity.w < -camera.x) {
        return true;
    }
    if (entity.y > meta.tilesHeight - camera.y + margin) {
        return true;
    }
    if (entity.y + margin + entity.h < -camera.y) {
        return true;
    }
    return false;
}