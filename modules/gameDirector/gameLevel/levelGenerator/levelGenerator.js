class Cell {
    constructor(posX, posY, type, id, dir) {
        this.x = posX;
        this.y = posY;

        /** 
         * Types: 
         * - 0: Null
         * - 1: Wall 
         * - 2: Portal 
         * - 3: Holes 
         * - 4: SpawnPoint 
         * - 10: Slime
         */
        this.type = type || 0;

        //corresponds to movements on the map [x,y]
        this.dir = dir || 0;

        this.tile = 0;
        this.id = id >= 0 ? id : "none";
    }
}

var tiles = [
    [1, 1], // 0 - tile
    [0, 0],
    [1, 0],
    [2, 0], // 1 - 2 - 3 upper walls
    [0, 1],
    [2, 1], // 4 - 5 side walls
    [0, 2],
    [1, 2],
    [2, 2], // 6 - 7 - 8 down walls
    [3, 0],
    [4, 0], // 9 - 10 right/left breaks (up)
    [3, 1],
    [4, 1], // 11 - 12  right/left breaks (down)
    [3, 2],
    [3, 3], // 13 - 14  up/down breaks (left)
    [4, 2],
    [4, 3], // 15 - 16  up/down breaks (right)
    [5, 0],
    [6, 0],
    [7, 0], // 17 - 18 - 19 holes UP
    [5, 1],
    [6, 1],
    [7, 1], // 20 - 21 - 22 holes MID
    [5, 2],
    [6, 2],
    [7, 2], // 23 - 24 - 25 holes DOWN
    [5, 3],
    [6, 3],
    [7, 3], // 26 - 27 - 28 holes HOR
    [8, 0],
    [8, 1],
    [8, 2], // 29 - 30 - 31 holes VER
    [8, 3], // 32 holes SINGLE
];
export class LevelGenerator {
    constructor(links) {
        this.level = []; // Bi-dimensional array of numbers, representing this level
        this.w = 23;
        this.h = 17;
        this.revealed = false;
        this.cleared = false;
        // "links" or "portals" to other rooms
        /*

        links format:
        [[1,0],[0,-1]]

        they corresponds to movements on the map [x,y]
        so [0, 1] will take you DOWN on the map bi-dimensional array

        */
        this.links = links || [
            [1, 0],
            [0, -1]
        ];
    }


    /**
     * @param {*} w width of the level, expressed in tiles
     * @param {*} h height of the level, expressed in tiles
     * @param {*} links (vectors) rooms/levels linked to this
     * @param {*} type expresses this room's type
     * @returns 
     * bi-dimensional array corresponding to the level, 
       each space constitutes either of Cell or 0
       where Cell.type corresponds to the entity and 
       0 corresponds to a free space
     */
    generate(w, h, links, type) {
        if (w) {
            this.w = w;
        }
        if (h) {
            this.h = h;
        }
        if (links) {
            this.links = links;
        }
        // Fills the level with stuff
        this.level = [];
        for (let i = 0; i < this.w; i++) {
            this.level.push([]);
            for (let j = 0; j < this.h; j++) {
                this.level[i].push(0);
            }
        }
        this.makeWalls();
        this.makePortals();

        if (type !== 1) {
            this.importTemplate((Math.random() * levelTemplates.length) | 0);
        } else {
            this.importTemplate(0);
        }
        //this.assignTiles();
        //this.makeEnemies(type);
        //this.consoleRender();
        return this.level;
    }
    assignTiles() {
        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                if (this.level[j][i].type !== 1) {
                    if (this.level[j][i].type == 3 || this.level[j][i].type == 1) {
                        tileSetter(this.level, j, i);
                    }
                    continue;
                }
                if (i == 0) {
                    // top row
                    if (j == 0) {
                        this.level[j][i].tile = 1;
                    } else if (j == this.w - 1) {
                        this.level[j][i].tile = 3;
                    } else {
                        this.level[j][i].tile = 2;
                        if (this.level[j + 1][i].type == 2) {
                            this.level[j][i].tile = 9;
                        } else if (this.level[j - 1][i].type == 2) {
                            this.level[j][i].tile = 10;
                        }
                    }
                }

                if (i == this.h - 1) {
                    // bottom row
                    if (j == 0) {
                        this.level[j][i].tile = 6;
                    } else if (j == this.w - 1) {
                        this.level[j][i].tile = 8;
                    } else {
                        this.level[j][i].tile = 7;
                        if (this.level[j + 1][i].type == 2) {
                            this.level[j][i].tile = 11;
                        } else if (this.level[j - 1][i].type == 2) {
                            this.level[j][i].tile = 12;
                        }
                    }
                }

                if (j == 0 && i !== 0 && i !== this.h - 1) {
                    // left column
                    this.level[j][i].tile = 4;
                    if (this.level[j][i + 1].type == 2) {
                        this.level[j][i].tile = 13;
                    } else if (this.level[j][i - 1].type == 2) {
                        this.level[j][i].tile = 14;
                    }
                }

                if (j == this.w - 1 && i !== 0 && i !== this.h - 1) {
                    // right column
                    this.level[j][i].tile = 5;
                    if (this.level[j][i + 1].type == 2) {
                        this.level[j][i].tile = 15;
                    } else if (this.level[j][i - 1].type == 2) {
                        this.level[j][i].tile = 16;
                    }
                }


            }
        }
    }
    makeWalls() {
        // up wall
        let y = 0;
        let cell;
        for (let i = 0; i < this.w; i++) {
            cell = new Cell(i, y, 1);
            this.level[i].splice(y, 1, cell);
        }
        // down wall
        y = this.h - 1;
        for (let i = 0; i < this.w; i++) {
            cell = new Cell(i, y, 1);
            this.level[i].splice(y, 1, cell);
        }
        // left wall
        let x = 0;
        for (let i = 0; i < this.h; i++) {
            cell = new Cell(x, i, 1);
            this.level[x].splice(i, 1, cell);
        }
        // right wall
        x = this.w - 1;
        for (let i = 0; i < this.h; i++) {
            cell = new Cell(x, i, 1);
            this.level[x].splice(i, 1, cell);
        }
    }
    importTemplate(which) {
        let template = levelTemplates[which];
        let cell;
        for (let i = 0; i < this.level.length; i++) {
            for (let j = 0; j < this.level[i].length; j++) {
                if (template[j][i]) {
                    cell = new Cell(j, i, template[j][i]);
                    this.level[i].splice(j, 1, cell);
                }
            }
        }
    }
    makePortals() {
        let halfW = (this.w / 2) | 0;
        let halfH = (this.h / 2) | 0;
        let hor = false;
        let x = 0;
        let y = 0;
        let doorType = 2;
        for (let i = 0; i < this.links.length; i++) {
            if (this.links[i][0] == 0) {
                // Vertical
                hor = false;
                x = halfW;
                this.links[i][1] > 0 ? (y = this.h - 1) : (y = 0);
            } else {
                // Horizontal
                hor = true;
                y = halfH;
                this.links[i][0] > 0 ? (x = this.w - 1) : (x = 0);
            }
            // Removes the cell at the center and replaces it with a doorType cell
            this.level[x].splice(y, 1, new Cell(x, y, doorType, i, this.links[i]));
            hor ? y++ : x++;
            // creates the 2nd part of the door (down or right of center)
            this.level[x].splice(y, 1, new Cell(x, y, doorType, i, this.links[i]));

            // creates the 3rd part of the door (up or left of center) if wall length is odd
            hor ? (y -= 2) : (x -= 2);
            this.level[x].splice(y, 1, new Cell(x, y, doorType, i, this.links[i]));

        }
    }
    makeEnemies(type) {
        if (type == 1) {
            return;
        }
        let maxAmount = 5;
        let maxCycles = 15;
        while (maxAmount && maxCycles) {
            let rand1 = (Math.random() * this.level.length) | 0;
            let rand2 = (Math.random() * this.level[rand1].length) | 0;
            if (this.level[rand1][rand2] == 0) {
                this.level[rand1][rand2] = new Cell(rand1, rand2, 10);
                maxAmount--;
            }
            maxCycles--;
        }
    }
    consoleRender() {
        let line = "";
        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                line += this.level[j][i].type > 0 ? this.level[j][i].type : "-";
                line += " ";
            }
            line += "\n";
        }
        console.log(line);
    }
    render() {
        let size = 20;
        canvas.width = size * this.w;
        canvas.height = size * this.h;
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                if (this.level[i][j] == 0) {
                    continue;
                }
                // Draws rooms
                switch (this.level[i][j].type) {
                    case 0:
                        continue;
                        break;
                    case 1:
                        c.fillStyle = "black";
                        break;
                    case 2:
                        c.fillStyle = "blue";
                        break;
                    case 3:
                        c.fillStyle = "red";
                        break;
                }
                c.fillRect(
                    i * size + size / 10,
                    j * size + size / 10,
                    size - size / 5,
                    size - size / 5
                );
            }
        }
    }
}
/*

  // 0 - 1 - 2 holes UP
  // 3 - 4 - 5 holes MID
  // 6 - 7 - 8 holes DOWN
  // 9 - 10 - 11 holes HOR
  // 12 - 13 - 14 holes VER
  // 15 holes SINGLE
*/
let levelTemplates = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 3, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 3, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 3, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 3, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
]