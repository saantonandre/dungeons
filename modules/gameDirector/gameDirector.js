import { gameMap } from "./gameMap/gameMap.js";
import { Camera } from "./camera/camera.js";

import { Player } from "../player/player.js";

class GameDirector {

    constructor() {

        /**  Defines the this.player position in the bidimensional map array [y, x] */
        this.currentLevel = [0, 0]

        /** Defines the current floor */
        this.currentFloor = 1;
        /** The current level Object, contains info about the level entities and tiles */
        this.level;
        this.player;
        this.camera = new Camera();
        this.camera.focus = this.player;

    }
    /** !!! PROVISIONAL !!!
     * - Generates the map
     * - Sets the current level
     * - Loads the entities of the level
     * - Places the this.player at the center of the map
     */
    initialize(meta) {
        gameMap.generate();
        this.currentLevel = gameMap.findStart();
        this.loadCurrentLevel(meta.tilesWidth, meta.tilesHeight);

        let player = new Player(7.5, 7.5, this);
        this.player = player;
        this.player.x = this.level.levelW / 2;
        this.player.y = this.level.levelH / 2;
        this.level.entities.push(player)
    }
    /** 
     * - Computes every entity
     * - Resolves collisions 
     * - Computes hp bars 
     * - Updates the camera
     * - Computes the UI
     */
    compute(meta) {

        for (let entity of this.level.entities) {
            entity.compute(meta.deltaTime, this.level.entities);
        }
        for (let entity of this.level.entities) {
            entity.resolveCollisions(meta.deltaTime, this.level.entities);
        }
        for (let entity of this.level.entities) {
            if (entity.hasHpBar) {
                entity.hpBar.compute(meta.deltaTime);
            }
        }
        this.camera.compute(meta, this.level);
        this.player.userInterface.compute(meta.deltaTime);
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
        }
        for (let entity of this.level.entities) {
            if (entity.hasHpBar) {
                entity.hpBar.render(context, tilesize, ratio, this.camera);
            }
        }
        this.player.userInterface.render(context, tilesize, 2);
    }

    loadCurrentLevel(tilesWidth, tilesHeight) {
        this.level = gameMap.levels[this.currentLevel[0]][this.currentLevel[1]];
        this.level.levelX = (tilesWidth - this.level.levelW) / 2;
        this.level.levelY = (tilesHeight - this.level.levelH) / 2;
    }
    changeLevel(dir, meta) {
        // !!! PROVISIONAL !!!
        this.currentLevel[0] += dir[0];
        this.currentLevel[1] += dir[1];
        this.loadCurrentLevel(meta.tilesWidth, meta.tilesHeight);
    }
    /** Sorts entities on ascending vertical position, background elements goes first */
    sortEntities() {
        this.level.entities.sort(function(a, b) {
            if (b.background) {
                return 0;
            }
            return (a.y + a.h) - (b.y + b.h);
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