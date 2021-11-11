/** Data type representing a dungeon room */
import { Point } from './point.js';
let ROOM_ID = 0;
/** Resets the ROOM_ID variable back to 0  */
export function resetRoomID() {
    ROOM_ID = 0;
}
export class Room extends Point {
    constructor(x, y, type = 0) {
        super(x, y);
        /** Room's type:
         * 0: Normal
         * 1: Start
         * 2: Tresure/shop
         * 3: Boss
         */
        this.type = type;
        /** Adiacent rooms linked to this one 
         * @type {Point[]}
         */
        this.links = [];
        /** Adiacent rooms directly connected to this one 
         * @type {Point[]}
         */
        this.joints = [];
        this.roomID = ROOM_ID++;
        /** -1 means no joints otherwise it represents the root joint's id */
        this.jointID = this.roomID;
        /** Adiacent rooms
         * - Left
         * - Up
         * - Right
         * - Down
         * @type {Point[]}
         */
        this.neighbors = [
            new Point(x - 1, y), // left
            new Point(x, y - 1), // up
            new Point(x + 1, y), // right
            new Point(x, y + 1) // down
        ]
    }
    /**
     * @param {String} side 
     * @returns {Boolean} true if the side is a link
     */
    isSideLink(side) {
        switch (side) {
            case 'left':
                return this.links.find(link => link.isEqual(this.neighbors[0])) !== undefined;
            case 'up':
                return this.links.find(link => link.isEqual(this.neighbors[1])) !== undefined;
            case 'right':
                return this.links.find(link => link.isEqual(this.neighbors[2])) !== undefined;
            case 'down':
                return this.links.find(link => link.isEqual(this.neighbors[3])) !== undefined;
        }
        return false;
    }
    /**
     * @param {String} side 
     * @returns {Boolean} true if the side is a joint
     */
    isSideJoint(side) {
        switch (side) {
            case 'left':
                return this.joints.find(joint => joint.isEqual(this.neighbors[0])) !== undefined;
            case 'up':
                return this.joints.find(joint => joint.isEqual(this.neighbors[1])) !== undefined;
            case 'right':
                return this.joints.find(joint => joint.isEqual(this.neighbors[2])) !== undefined;
            case 'down':
                return this.joints.find(joint => joint.isEqual(this.neighbors[3])) !== undefined;
        }
        return false;
    }
    /**
     * Create a link between this and another room
     * @param {Room} room 
     */
    link(room) {
        this.links.push(new Point(room.x, room.y));
        room.links.push(new Point(this.x, this.y));
    }
    /**
     * Create a direct connection between this and another room
     * @param {Room} room 
     */
    joint(room) {
        this.joints.push(new Point(room.x, room.y));
        room.joints.push(new Point(this.x, this.y));

    }
}
/** Bidimensional array composed of either rooms or zero's 
 * @type {Rooms[][]}
 */
export class RoomsMap extends Array {
    constructor() {
        super();
    }
    /** This array's width */
    get w() { return this.length }
    /** This array's height */
    get h() { return this[0].length }

    /** Checks wether the given coords are outside of this 2D array
     *  @param {Point} coords 
     *  @returns {Boolean}
     */
    isOutside(coords) {
        if (coords.x < 0 ||
            coords.x >= this.w ||
            coords.y < 0 ||
            coords.y >= this.h) {
            return true;
        }
        return false;
    }
    /** Checks wether the given spot doesn't host a room
     *  @param {Point} coords 
     */
    isFree(coords) {
        return this[coords.x][coords.y] === 0;
    }
    /** Returns a list of available neighbouring coords
     *  @param {Point} coords 
     *  @returns {Point[]}
     */
    availableNeighbors(coords) {

        /** @type {Point[]} */
        let neighbors = [];

        /** @type {Room} */
        let room = this[coords.x][coords.y];

        for (let n of room.neighbors) {
            if (!this.isOutside(n) && this.isFree(n)) {
                // Found a free neighbor (that isn't outside)
                neighbors.push(n);
            }
        }
        return neighbors;
    }
}