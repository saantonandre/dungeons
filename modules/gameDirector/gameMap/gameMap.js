import { MapGenerator } from "./mapGenerator/mapGenerator.js";
import { GameLevel } from "./../gameLevel/gameLevel.js";

class GameMap {
    constructor() {
        this.mapGenerator = new MapGenerator();
        this.width = 10;
        this.height = 10;
        this.levelsAmount = 4;
        this.rawLevels = []; // Levels provided by the generator
        this.levels = []; // Levels parsed
    }
    initEmptyLevels = () => {
        this.levels = [];
        for (let y = 0; y < this.height; y++) {
            this.levels.push([]);
            for (let x = 0; x < this.width; x++) {
                this.levels[y].push([]);
            }
        }
    }
    /** Creates both raw and soft parsed levels */
    generate = () => {
        this.rawLevels = this.mapGenerator.generate(this.width, this.height, this.levelsAmount);
        this.initEmptyLevels();
        for (let y = 0; y < this.rawLevels.length; y++) {
            for (let x = 0; x < this.rawLevels[y].length; x++) {

                if (this.rawLevels[y][x] === 0) {
                    this.levels[y][x] = 0;
                } else {
                    this.levels[y][x] = new GameLevel(this.rawLevels[y][x].links, this.rawLevels[y][x].type);
                }
            }
        }
    }
    /** Returns the starting level of the current map */
    findStart = () => {
        for (let y = 0; y < this.rawLevels.length; y++) {
            for (let x = 0; x < this.rawLevels[y].length; x++) {
                if (this.rawLevels[y][x].type == 1) {
                    return [y, x];
                }
            }
        }
        throw new Error("The map is missing the starting level (a level of type:1)");
    }
}

export const gameMap = new GameMap();