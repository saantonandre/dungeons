import { gameMap } from "./gameMap/gameMap.js";
import { vfxManager } from "../vfxManager/vfxManager.js";
import { Camera } from "./camera/camera.js";

import { Player } from "../player/player.js";

import { Controls } from "../controls/controls.js";
import { Mouse } from "../mouse/mouse.js";

import { debug } from '../debug/debug.js';
class GameDirector {

    constructor() {

        /**  Defines the this.player position in the bidimensional map array [y, x] */
        this.currentLevel = [0, 0]

        this.controls = new Controls();
        /** Defines the current floor */
        this.floor = 0;
        /** The current level Object, contains info about the level entities and tiles */
        this.level;
        this.player;
        this.mouse;
        this.camera = new Camera();
        this.camera.focus = this.player;
        this.map = gameMap;
        this.vfxRecyclePool = vfxManager.recyclePool;

        this.tabbedOut = false;
        document.addEventListener("visibilitychange", (evt) => {
            this.tabbedOut = document.visibilityState == 'hidden' ? true : false;
            if (this.tabbedOut) {
                this.player.state = 'broke';
            }
        });
    }
    /** !!! PROVISIONAL !!!
     * - Generates the map
     * - Sets the current level
     * - Loads the entities of the level
     * - Places the this.player at the center of the map
     */
    initialize(meta, canvas) {
        this.mouse = new Mouse(canvas, meta, this.camera);
        let player = new Player(0, 0, this);
        this.player = player;
        this.changeFloor(meta)
    }
    /** Deletes removed entities */
    garbageCleaner(garbage) {
        for (let i = garbage.length - 1; i >= 0; i--) {
            if (this.level.entities[garbage[i]].type === 'vfx') {
                this.vfxRecyclePool.push(this.level.entities.splice(garbage[i], 1)[0]);
                continue;
            }
            for (let drop of this.level.entities[garbage[i]].drops) {
                drop.dispatch(this.level.entities);
            }
            this.level.entities.splice(garbage[i], 1);
        }
    }
    /** 
     * - Computes every entity
     * - Resolves collisions 
     * - Computes hp bars 
     * - Computes portals 
     * - Updates the camera
     * - Computes the UI
     */
    compute = (meta) => {
        /** Where dead entities ends up */
        let garbage = [];
        /** Reiterates the computation if the level is recreated */
        let loadLevelCall = false;
        // Computes the interface
        this.player.userInterface.compute(meta.deltaTime);
        // Calls the compute function on every entities
        for (let entity of this.level.entities) {
            entity.resolveCollisions(meta.deltaTime, this.level.entities);
            entity.compute(meta.deltaTime, this.level.entities);
            if (entity.removed) {
                // Pushes the entities to the garbage
                garbage.push(this.level.entities.indexOf(entity));
                continue;
            }
            if (entity.hasDisplayName) {
                entity.displayName.compute(this.mouse);
            }
            if (entity.hasHpBar) {
                entity.hpBar.compute(meta.deltaTime);
            }
        }
        // Detaches the removed entities from this.level.entities
        this.garbageCleaner(garbage);
        // Portal specific computing, need comms with this, the map and the player
        for (let portal of this.level.portals) {
            loadLevelCall = portal.computePortal(meta, this);
            if (loadLevelCall) {
                // Stop computing other portals since they are now next level's portal
                break;
            }
        }
        // Computes the camera position
        this.camera.compute(meta, this.level);

        if (loadLevelCall) {
            this.compute(meta)
        }
    }

    /** 
     * - Sorts the entities based on their y pos
     * - Renders the floor tiles
     * - Renders the shadows
     * - Renders the entities
     * - Renders the hp bars
     * - Renders the UI
     */
    render = (context, meta) => {
        this.sortEntities();
        /** Renders the floor (ground level) tiles */
        for (let tile of this.level.floor) {
            tile.render(context, meta.tilesize, meta.ratio, this.camera);
        }
        /** Needs to be a separate cycle to avoid shadow overlapping to entities */
        for (let entity of this.level.entities) {
            entity.renderShadow(context, meta.tilesize, meta.ratio, this.camera);
        }
        /** Entities basic rendering */
        for (let entity of this.level.entities) {
            entity.render(context, meta.tilesize, meta.ratio, this.camera);
            /** Hitbox rendering */
            //entity.renderHitbox(context, meta.tilesize, meta.ratio, this.camera)
        }
        /** Needs to be a separate cycle to avoid entities overlapping the GUIs */
        for (let entity of this.level.entities) {
            if (entity.hasDisplayName) {
                entity.displayName.render(context, meta.tilesize, meta.ratio, this.camera);
            }
            if (entity.hasHpBar) {
                entity.hpBar.render(context, meta.tilesize, meta.ratio, this.camera);
            }
        }
        //debug.render(context, meta.tilesize, meta.ratio, this.camera);
        this.player.userInterface.render(context, meta.tilesize, meta.baseRatio);
    }

    changeFloor(meta) {
        this.floor += 1;
        this.map.generate();
        this.currentLevel = this.map.findStart();

        this.changeLevel([0, 0], meta, true)

        this.player.fall();
    }
    changeLevel(dir, meta, floorChange = false) {
        // !!! PROVISIONAL !!!
        // Removes player from current level
        if (this.level) {
            this.level.entities.splice(this.level.entities.indexOf(this.player), 1);
        }

        this.currentLevel[0] += dir[0];
        this.currentLevel[1] += dir[1];




        this.loadCurrentLevel(meta.tilesWidth, meta.tilesHeight);
        this.level.entities.push(this.player);
        /** Reset Velocities */
        this.player.xVel = 0;
        this.player.yVel = 0;
        this.player.xVelExt = 0;
        this.player.yVelExt = 0;
        if (floorChange) {
            this.player.x = this.level.levelW / 2;
            this.player.y = this.level.levelH / 2;
            return;
        }
        for (let portal of this.level.portals) {
            /* If the portal matches the opposite of the entered portal, 
            teleport the player here. 
            Example: if portal taken goes to "left" (-1, 0)
            then take the one that goes to "right" (1 , 0)
            */
            if (portal.dir[0] == dir[0] * -1 && portal.dir[1] == dir[1] * -1) {
                // Move the player to the target portal but out of it to avoid teleporting back
                this.player.x = -this.player.w / 2 + portal.x + portal.w / 2 - (this.player.w * portal.dir[0]);
                this.player.y = -this.player.h / 2 + portal.y + portal.h / 2 - (this.player.h * portal.dir[1]);
            }
        }

    }
    loadCurrentLevel(tilesWidth, tilesHeight) {
        this.level = this.map.levels[this.currentLevel[0]][this.currentLevel[1]];
        this.level.levelX = (tilesWidth - this.level.levelW) / 2;
        this.level.levelY = (tilesHeight - this.level.levelH) / 2;
    }
    /** Sorts the entities by type (.background goes first) and vertical position (lower -> higher) */
    sortEntities() {
        this.level.entities.sort(function(a, b) {
            return (a.y + a.h) - (b.y + b.h);
        })
        this.level.entities.sort(function(a, b) {
            if (!a.background && b.background || a.type == 'vfx') {
                return 1;
            } else {
                return -1;
            }
        })
    }

}
export const gameDirector = new GameDirector();