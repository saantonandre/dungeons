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
     * @param {*} type - 0 = Normal - 1 = Start - 2 = Treasure - 3 = Boss
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

        // If this is the start room load the start room template
        if (type === 1) {
            this.importTemplate(startTemplate);
        } else {
            this.importTemplate(levelTemplates[(Math.random() * levelTemplates.length) | 0]);
        }
        if (type === 3) {
            this.makeFloorPortal();
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
    importTemplate(template) {
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
    makeFloorPortal() {
        let halfW = (this.w / 2) | 0;
        let halfH = (this.h / 2) | 0;
        let hor = false;
        let x = 0;
        let y = 0;
        let floorPortalType = 5;
        let floorPortalId = Math.random();
        if (this.links.length > 3) {
            throw new Error("Cannot generate a floor portal, too many links!")
        }
        let possibleLinks = [
            [1, -0],
            [-0, 1],
            [-1, -0],
            [-0, -1]
        ]
        for (let i = possibleLinks.length - 1; i >= 0; i--) {
            for (let j = 0; j < this.links.length; j++) {
                if (possibleLinks[i][0] == this.links[j][0] && possibleLinks[i][1] == this.links[j][1]) {
                    possibleLinks.splice(i, 1);
                    break;
                }
            }
        }
        let chosenSide = possibleLinks[Math.random() * possibleLinks.length | 0];

        if (chosenSide[0] == 0) {
            // Vertical
            hor = false;
            x = halfW;
            chosenSide[1] > 0 ? (y = this.h - 1) : (y = 0);
        } else {
            // Horizontal
            hor = true;
            y = halfH;
            chosenSide[0] > 0 ? (x = this.w - 1) : (x = 0);
        }
        // Removes the cell at the center and replaces it with a doorType cell
        this.level[x].splice(y, 1, new Cell(x, y, floorPortalType, floorPortalId, chosenSide));
        hor ? y++ : x++;
        // creates the 2nd part of the door (down or right of center)
        this.level[x].splice(y, 1, new Cell(x, y, floorPortalType, floorPortalId, chosenSide));

        // creates the 3rd part of the door (up or left of center) if wall length is odd
        hor ? (y -= 2) : (x -= 2);
        this.level[x].splice(y, 1, new Cell(x, y, floorPortalType, floorPortalId, chosenSide));

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
let startTemplate = [
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
];
let levelTemplates = [
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0],
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
        [0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0],
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
        [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 3, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 3, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0],
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
        [0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0],
        [0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 3, 11, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 3, 10, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0],
        [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 10, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 11, 3, 3, 3, 3, 3, 0],
        [0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
]