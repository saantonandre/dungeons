import { LevelGenerator } from "./levelGenerator/levelGenerator.js";
import { LevelParser } from "./../levelParser/levelParser.js";
export class GameLevel {
    constructor(levelLinks, levelType) {
        this.rawLevel = [];

        /** List of interactive entities */
        this.entities = [];
        /** Untouchable tiles, just there for the background */
        this.floor = [];
        /** List of the current room's portals */
        this.portals = [];

        this.levelGenerator = new LevelGenerator();
        this.levelParser = new LevelParser();

        this.levelW = 23;
        this.levelH = 17;
        this.levelX = 0;
        this.levelY = 0;
        /* 
        this.levelX = (meta.tilesWidth - this.levelW) / 2;
        this.levelY = (meta.tilesHeight - this.levelH) / 2; 
        */
        this.links = levelLinks;
        /**
         * | 0 = normal 
         * | 1 = start 
         * | 2 = treasure/shop 
         * | 3 = boss 
         * | */
        this.type = levelType;
        this.generate();
    }
    generate() {
        this.rawLevel = this.levelGenerator.generate(
            this.levelW,
            this.levelH,
            this.links,
            this.type);
        let parsedLevel = this.levelParser.parse(this.rawLevel);
        this.floor = parsedLevel.floor;
        this.entities = parsedLevel.entities;
        this.portals = parsedLevel.portals;
    }
}