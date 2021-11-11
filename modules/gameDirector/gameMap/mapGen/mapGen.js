import { Room, RoomsMap, resetRoomID } from './components/room.js';
export class MapGenerator {
    constructor() {
        this.w = 0;
        this.h = 0;

        /** Bidimensional array composed of either rooms or zero's  
         * @type {Room|0[][]}
         * */
        this.roomsMap = new RoomsMap();

        /** List of inhabited rooms
         * @type {Room[]}
         */
        this.roomsPool = [];

        /** List of inhabited rooms with neighboring space 
         * @type {Room[]}
         */
        this.spacedRooms = [];

        /** List of inhabited rooms with neighboring space 
         * @type {Room[][]}
         */
        this.jointedChunks = [];
    }

    /**
     * 
     * @param {Number} w Width constraint
     * @param {Number} h Height constraint
     * @param {Number} roomsAmount 
     * @param {Boolean} joints 
     * @param {Boolean} uSquares transforms u-shapes into 2x2 squares
     * 
     * @returns {Room[][]} an array containing jointed rooms
     */
    generate = (w = 11, h = 11, roomsAmount = 16, joints = true, uSquares = false) => {
        resetRoomID();
        this.initialize(w, h);

        this.populate(roomsAmount);

        this.assignTypes();
        if (joints) {
            this.assignJoints(uSquares);
            return this.jointedChunks;
        }
    }
    /** Creates an empty map of the given measures and populates with 0's 
     * @param {Number} w Width
     * @param {Number} h Height
     */
    initialize = (w, h) => {
        /** Resets arrays */
        this.roomsMap.length = 0;
        this.roomsPool.length = 0;
        this.spacedRooms.length = 0;
        this.jointedChunks.length = 0;

        this.w = w;
        this.h = h;
        for (let w = 0; w < this.w; w++) {
            this.roomsMap.push([]);
            for (let h = 0; h < this.h; h++) {
                this.roomsMap[w].push(0);
            }
        }
    }

    /** Pushes a room in the map and its coords in the pool arrays
     * @param {Number} x
     * @param {Number} y
     * @param {Number} roomType
     * @returns {Room} The generated room
     */
    createRoom = (x, y, roomType = 0) => {
        let room = new Room(x, y, roomType);
        this.roomsMap[x].splice(y, 1, room);
        this.roomsPool.push(room);
        this.spacedRooms.push(room);
        return room;
    }

    /**
     * Populates an empty map array
     * @param {Number} roomsAmount Amount of rooms to generate
     */
    populate = (roomsAmount) => {
        // Inhabits a room in the center
        let centerW = this.w / 2 | 0;
        let centerH = this.h / 2 | 0;
        this.createRoom(centerW, centerH);

        let iterCount = 0;

        while (this.roomsPool.length < roomsAmount) {
            if (this.spacedRooms.length === 0) {
                console.warn("Out of space exit")
                break;
            }
            // Pick a random room with neighboring space

            let randIndex = Math.random() * this.spacedRooms.length | 0;
            let randRoom = this.spacedRooms[randIndex];
            let availableNeighbors = this.roomsMap.availableNeighbors(randRoom);

            // Skip and discard if the room doesn't have neighboring space
            if (availableNeighbors.length === 0) {
                this.spacedRooms.splice(randIndex, 1);
                iterCount++;
                continue;
            }
            // Pick a random neighbor of chosen room
            let chosenNeighbor = availableNeighbors[Math.random() * availableNeighbors.length | 0];
            this.createRoom(chosenNeighbor.x, chosenNeighbor.y).link(randRoom)
            iterCount++;
            if (iterCount > roomsAmount * 3) {
                console.warn(`Too many attemps to reach desired amount of rooms count \n 
                inhabited rooms: ${this.roomsPool.length}`);
                break;
            }
        }
        console.log('Iterations: ' + iterCount);

    }

    /** Assigns specific rooms types */
    assignTypes = () => {
        // The start room is assigned randomly
        let startRoom = this.roomsPool[Math.random() * this.roomsPool.length | 0];
        startRoom.type = 1;

        // The exit/boss room is the furthest away from the start
        let exitRoom = startRoom;
        let maxDistance = 0
        for (let room of this.roomsPool) {

            let distance = room.distance(startRoom)
            if (distance > maxDistance) {
                maxDistance = distance;
                exitRoom = room;
            }
        }
        exitRoom.type = 3;

        // The shop room is the furthest away from the boss AND start room
        let shopRoom = startRoom;
        maxDistance = 0
        for (let room of this.roomsPool) {
            let distance = room.distance(startRoom) + room.distance(exitRoom)
            if (distance > maxDistance) {
                maxDistance = distance;
                shopRoom = room;
            }
        }
        shopRoom.type = 2;


    }

    /** Transforms some rooms links into joints */
    assignJoints = (uSquares = false) => {
        for (let room of this.roomsPool) {
            if (room.type !== 0 || room.joints.length > 0) {
                /** Skip if room is not of 'normal' type or if it already has joints */
                continue;
            }
            /** Pick a link and make it a joint*/
            for (let linkCoords of room.links) {
                let linkRoom = this.roomsMap[linkCoords.x][linkCoords.y];
                if (linkRoom.type === 0 && linkRoom.joints.length === 0) {
                    room.joint(linkRoom);
                    break;
                }
            }
        }
        this.shapeJoints();

        /** Experimental */
        this.assignJointsID();
        this.jointedChunks = this.getJointedChunks(false);
        if (uSquares) {
            this.jointRoomsU();
        }
    }
    /** Gives every room a jointID  */
    assignJointsID() {
        for (let room of this.roomsPool) {
            for (let jointCoords of room.joints) {
                let jointRoom = this.roomsMap[jointCoords.x][jointCoords.y];
                this.propagateJointID(room, jointRoom)
            }
        }
    }
    /** Recursive function wich takes a room and its child as argument, 
     *  will give the same ID to each of the joints
     * @param {Room} parent
     * @param {Room} child
     */
    propagateJointID(parent, child) {
        if (child.jointID === parent.jointID) {
            return;
        }
        child.jointID = parent.jointID;
        for (let jointCoords of child.joints) {
            let jointRoom = this.roomsMap[jointCoords.x][jointCoords.y];
            this.propagateJointID(child, jointRoom);
        }
    }
    /**
     * @param {Boolean} onlyChunks Defines if you want to exclude single chunks
     * @returns {Room[][]} An array of Room Arrays, each representing a jointed chunk 
     */
    getJointedChunks(onlyChunks = true) {
        let knownIDs = [];
        let jointedChunks = [];
        for (let room of this.roomsPool) {
            if (onlyChunks && room.joints.length === 0) {
                continue;
            }
            // Compare the id with existing IDs, if it's new push all the same id rooms into the array
            if (knownIDs.find(id => id === room.jointID) !== undefined) {
                continue;
            }
            // If it is a new ID push it into the known IDs
            knownIDs.push(room.jointID);
            // Push an array of rooms with this same ID into the jointedChunks
            jointedChunks.push(this.roomsPool.filter(r => r.jointID == room.jointID));
        }
        return jointedChunks;
    }
    /**
     * Checks if there are 'U' shaped rooms, and make them go 'full circle' to create a square
     * 
     * - 1: Find chunks of joints with a joint depth of 4
     * - 2: If the 2 rooms with 1 joint are adiacent, joint them
     *  
     */
    jointRoomsU() {
        // Assign a joint id for each joint chunk
        for (let chunk of this.jointedChunks) {
            if (chunk.length !== 4) {
                continue;
            }

            let unjointed1 = chunk.find(room => room.joints.length == 1);
            let unjointed2 = chunk.find(room => room.joints.length == 1 && room !== unjointed1);
            if (!unjointed1 || !unjointed2) {
                continue;
            }
            if (unjointed1.distance(unjointed2) == 1) {
                unjointed1.joint(unjointed2);
                // Joint diagonal room to fill the black square
                unjointed1.joint(chunk.find(room => room.distance(unjointed1) > 1));
            }
        }

    }
    /** Gives more shapes to the joints */
    shapeJoints = (random = true) => {
        for (let room of this.roomsPool) {
            if (room.type !== 0 || room.joints.length > 0) {
                // Skip if room is not of 'normal' type or if it already has joints 
                continue;
            }
            // Randomly skips, for more diversity
            if (random && Math.random() * 2 | 0) {
                continue;
            }
            /** Shuffles the links array */
            room.links.sort(() => Math.random() - 0.5);

            /** Pick a link to a cell with no joints and make it a joint for both */
            for (let linkCoords of room.links) {
                let linkRoom = this.roomsMap[linkCoords.x][linkCoords.y];
                if (linkRoom.type === 0 && linkRoom.joints.length === 1) {
                    room.joint(linkRoom);
                    break;
                }
            }
        }
    }
    /** Renders each room of the pool */
    render = (canvas, context, size = 20) => {
        canvas.width = size * this.w;
        canvas.height = size * this.h;
        context.clear();
        context.fillStyle = "black";
        context.fillRect(0, 0, canvas.width, canvas.height);

        for (let room of this.roomsPool) {
            let colors = ["Lavender", "RoyalBlue", "Khaki", "Brown"];
            context.fillStyle = colors[room.type];

            // Draws room
            context.fillRect(
                room.x * size + size / 10,
                room.y * size + size / 10,
                size - size / 5,
                size - size / 5
            );

            // Draws links
            for (let linkCoords of room.links) {
                let link = this.roomsMap[linkCoords.x][linkCoords.y];
                context.fillStyle = colors[0];
                context.fillRect(
                    (room.x + link.x) / 2 * size + size / 2 - size / 10,
                    (room.y + link.y) / 2 * size + size / 2 - size / 10,
                    size / 5,
                    size / 5
                );
            }

            // Draws Joints
            for (let jointCoords of room.joints) {
                let joint = this.roomsMap[jointCoords.x][jointCoords.y];
                context.fillStyle = colors[0];
                context.fillRect(
                    (room.x + joint.x) / 2 * size + size / 10,
                    (room.y + joint.y) / 2 * size + size / 10,
                    size - size / 5,
                    size - size / 5
                );
            }


        }
    }
}