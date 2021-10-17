import { gameMap } from "./gameMap/gameMap.js";
import { Camera } from "./camera/camera.js";

import { Player } from "../player/player.js";

import { Controls } from "../controls/controls.js";
import { Mouse } from "../mouse/mouse.js";

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
    compute(meta) {
        let garbage = [];
        let loadLevelCall = false;
        this.player.userInterface.compute(meta.deltaTime);
        for (let entity of this.level.entities) {
            if (entity.removed || entity.scheduledDeletion) {
                garbage.push(this.level.entities.indexOf(entity));
                continue;
            }
            entity.compute(meta.deltaTime, this.level.entities);
        }
        this.garbageCleaner(garbage);

        for (let entity of this.level.entities) {
            entity.resolveCollisions(meta.deltaTime, this.level.entities);
        }
        for (let entity of this.level.entities) {
            if (entity.hasHpBar) {
                entity.hpBar.compute(meta.deltaTime);
            }
        }
        /** Portal specific computing, need comms with this, the map and the player */
        for (let portal of this.level.portals) {
            loadLevelCall = portal.computePortal(meta, this);
        }
        this.camera.compute(meta, this.level);

        // Reiterates the computation if the level is recreated
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
    render(context, tilesize, ratio) {
        this.sortEntities();
        this.renderFloor(context, tilesize, ratio);

        //(context, tilesize, ratio, offsetX, offsetY)
        for (let entity of this.level.entities) {
            entity.renderShadow(context, tilesize, ratio, this.camera);
        }
        for (let entity of this.level.entities) {
            entity.render(context, tilesize, ratio, this.camera);
            /** Hitbox rendering */
            //entity.renderHitbox(context, tilesize, ratio, this.camera)
        }
        for (let entity of this.level.entities) {
            if (entity.hasHpBar) {
                entity.hpBar.render(context, tilesize, ratio, this.camera);
            }
        }
        this.player.userInterface.render(context, tilesize, 2);
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
    /** Sorts entities on ascending vertical position, background elements goes first */
    sortEntities() {
        this.level.entities.sort(function(a, b) {
            return (a.y + a.h) - (b.y + b.h);
        })
        this.level.entities.sort(function(a, b) {
            if (!a.background && b.background) {
                return 1;
            } else {
                return -1;
            }
        })
    }
    /** Renders the floor (ground level) tiles */
    renderFloor(context, tilesize, ratio) {
        //(context, tilesize, ratio, offsetX, offsetY)
        for (let tile of this.level.floor) {
            tile.render(context, tilesize, ratio, this.camera);
        }
    }

}
export const gameDirector = new GameDirector();