class Room {
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
        this.links = [];
        this.entities = [];
        /**
         * | 0 = normal 
         * | 1 = start 
         * | 2 = treasure/shop 
         * | 3 = boss 
         * | */
        this.type = 0;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }
}
export class MapGenerator {
    constructor() {
        this.map = [];
        this.w = 11;
        this.h = 11;
        this.rooms = 16;
        this.inhabitedRooms = [];
    }
    generate(w, h, rooms) {
        this.w = w || 11;
        this.h = h || 11;
        this.rooms = rooms || 16;

        this.map = [];
        this.inhabitedRooms = [];
        for (let i = 0; i < this.w; i++) {
            this.map.push([]);
            for (let j = 0; j < this.h; j++) {
                this.map[i].push(0);
            }
        }
        // Inhabit a room in the center
        let center = [(this.w / 2) | 0, (this.h / 2) | 0];
        this.inhabitedRooms.push(center);
        this.map[center[0]].splice(center[1], 1, new Room(center[0], center[1]));
        // Cycle
        let count = 0;
        while (this.inhabitedRooms.length < this.rooms) {
            // Pick a random inhabited room (Parent)
            let coords =
                this.inhabitedRooms[(Math.random() * this.inhabitedRooms.length) | 0];
            // Pick a neighbor of Parent(←,↑,→,↓)
            let randDir = this.pickDirection();
            let neighbor = [randDir[0] + coords[0], randDir[1] + coords[1]];
            // Is it legit?
            if (
                neighbor[0] < 0 ||
                neighbor[0] >= this.w ||
                neighbor[1] < 0 ||
                neighbor[1] >= this.h
            ) {
                // -y: continue cycling
                count++;
                continue;
            }
            // Is it free?
            if (this.map[neighbor[0]][neighbor[1]] == 0) {
                // -y:  new Child
                this.map[neighbor[0]].splice(
                    neighbor[1],
                    1,
                    new Room(neighbor[0], neighbor[1])
                );

                // put a link on both rooms
                this.map[coords[0]][coords[1]].links.push(randDir);
                this.map[neighbor[0]][neighbor[1]].links.push([
                    randDir[0] * -1,
                    randDir[1] * -1,
                ]);
                // Assigns the link direction
                if (randDir[0] == 0) {
                    // verical
                    if (randDir[1] > 1) {
                        this.map[coords[0]][coords[1]].down = true;
                        this.map[neighbor[0]][neighbor[1]].up = true;
                    } else {
                        this.map[coords[0]][coords[1]].up = true;
                        this.map[neighbor[0]][neighbor[1]].down = true;
                    }
                } else {
                    // hotizontal
                    if (randDir[0] > 1) {
                        this.map[coords[0]][coords[1]].right = true;
                        this.map[neighbor[0]][neighbor[1]].left = true;
                    } else {
                        this.map[coords[0]][coords[1]].left = true;
                        this.map[neighbor[0]][neighbor[1]].right = true;
                    }
                }

                // push the neighbor coords into the inhabited rooms array
                this.inhabitedRooms.push(neighbor);
            }

            // n: do nothing
            // emergency exit
            count++;
            if (count > 1000) {
                console.log("EMERGENCY EXIT");
                console.log("#inhabited rooms: " + this.inhabitedRooms.length);
                break;
            }
        }
        this.assignRooms(center);
        // Outputs the map

        //this.consoleRender();
        return this.map;
    }
    assignRooms(center) {
        // Types: ["N", "S", "T", "B"]; NORMAL - START - TREASURE/SHOP - BOSS

        // The start room is the first one
        this.map[center[0]][center[1]].type = 1;
        // The boss room is the furthest away from the start
        let rooms = this.inhabitedRooms;
        let furthest = center;
        let furthest2 = center;
        let dist = 0;
        let maxDist = 0;

        for (let i = 0; i < rooms.length; i++) {
            dist =
                Math.abs(rooms[i][0] - center[0]) + Math.abs(rooms[i][1] - center[1]);
            if (dist > maxDist) {
                maxDist = dist;
                furthest = rooms[i];
            }
        }
        this.map[furthest[0]][furthest[1]].type = 3; // Boss room

        // The treasure room is the furthest away from the boss AND start room
        (dist = 0), (maxDist = 0);
        for (let i = 0; i < rooms.length; i++) {
            if (this.map[rooms[i][0]][rooms[i][1]].type === 1) {
                continue;
            }
            dist =
                Math.abs(rooms[i][0] - furthest[0]) +
                Math.abs(rooms[i][1] - furthest[1]) +
                Math.abs(rooms[i][0] - center[0]) +
                Math.abs(rooms[i][1] - center[1]);
            if (dist > maxDist) {
                maxDist = dist;
                furthest2 = rooms[i];
            }
        }
        this.map[furthest2[0]][furthest2[1]].type = 2; // Treasure room
        return this.map;
    }
    pickDirection() {
        // dir = [left, right, up, down]
        let dirs = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, +1],
        ];
        return dirs[(Math.random() * dirs.length) | 0];
    }
    consoleRender() {
        let line = "";
        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                line += this.map[j][i].type >= 0 ? this.map[j][i].type : "-";
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
        let room;
        for (let i = 0; i < this.w; i++) {
            for (let j = 0; j < this.h; j++) {
                room = this.map[i][j];
                if (room == 0) {
                    continue;
                }
                // Draws rooms
                switch (this.map[i][j].type) {
                    case 0:
                        c.fillStyle = "black";
                        break;
                    case 1:
                        c.fillStyle = "blue";
                        break;
                    case 2:
                        c.fillStyle = "yellow";
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
                // Draws links
                for (let k = 0; k < room.links.length; k++) {
                    c.fillStyle = "orange";
                    c.fillRect(
                        (i + room.links[k][0] / 2) * size + size / 2 - size / 10,
                        (j + room.links[k][1] / 2) * size + size / 2 - size / 10,
                        size / 5,
                        size / 5
                    );
                }
            }
        }
    }
}