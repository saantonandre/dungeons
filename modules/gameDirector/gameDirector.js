import { gameMap } from "./gameMap/gameMap.js";
import { Camera } from "./camera/camera.js";

import { player } from "../player/player.js";
class GameDirector {

    constructor() {

        /**  Defines the player position in the bidimensional map array [y, x] */
        this.currentLevel = [0, 0]

        /** Defines the current floor */
        this.currentFloor = 1;
        /** The current level Object, contains info about the level entities and tiles */
        this.level;


        this.camera = new Camera();
        this.camera.focus = player;

    }
    /** !!! PROVISIONAL !!!
     * - Generates the map
     * - Sets the current level
     * - Loads the entities of the level
     * - Places the player at the center of the map
     */
    initialize(meta) {
        gameMap.generate();
        this.currentLevel = gameMap.findStart();
        this.loadCurrentLevel(meta.tilesWidth, meta.tilesHeight);
        this.level.entities.push(player)
        player.x = this.level.levelW / 2;
        player.y = this.level.levelH / 2;
        console.log(player)
    }
    /** 
     * - Computes every entity
     * - Updates the camera
     * - Sorts the entities based on their y pos
     */
    compute(meta) {

        for (let entity of this.level.entities) {
            entity.compute(meta.deltaTime);
        }
        this.camera.compute(meta, this.level);
        this.sortEntities();
    }

    render(context, tilesize, ratio) {
        this.renderFloor(context, tilesize, ratio);
        //(context, tilesize, ratio, offsetX, offsetY)
        for (let entity of this.level.entities) {
            entity.render(context, tilesize, ratio, this.camera);
        }
    }

    loadCurrentLevel(tilesWidth, tilesHeight) {
        this.level = gameMap.levels[this.currentLevel[0]][this.currentLevel[1]];
        this.level.levelX = (tilesWidth - this.level.levelW) / 2;
        this.level.levelY = (tilesHeight - this.level.levelH) / 2;
        // player.environment = this.level.entities;
        // this.level.entities.push(player);
        // let testSlime = new Slime(18, 14)
        // testSlime.environment = this.level.entities;
        //this.level.entities.push(testSlime);
    }
    changeLevel(dir, meta) {
        // !!! PROVISIONAL !!!
        this.currentLevel[0] += dir[0];
        this.currentLevel[1] += dir[1];
        this.loadCurrentLevel(meta.tilesWidth, meta.tilesHeight);
    }
    sortEntities() {
        this.level.entities.sort(function(a, b) {
            if (b.type == "bg") {
                return 0;
            }
            return (a.y + a.h) - (b.y + b.h);
        })
    }
    renderFloor(context, tilesize, ratio) {
        //(context, tilesize, ratio, offsetX, offsetY)
        for (let tile of this.level.floor) {
            tile.render(context, tilesize, ratio, this.camera);
        }
    }

}
export const gameDirector = new GameDirector();