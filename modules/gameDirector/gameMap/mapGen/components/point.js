/** Represents a position in two dimensions */
export class Point {
    constructor(x, y) {
        /** Horizontal position */
        this.x = x;
        /** Vertical position */
        this.y = y;
    }
    /** Compares two points, returns true if they are equal 
     *  @param {Point} point
     *  @return {Boolean}
     */
    isEqual(point) {
        if (this.x === point.x && this.y === point.y) {
            return true;
        }
        return false;
    }
    /** Returns the inverse of this point 
     *  @return {Number[]}
     */
    getInverse() {
        return [this.x * -1, this.y * -1];
    }
    /** Returns the distance between two points 
     *  @param {Point} point
     *  @returns {Number} Distance
     */
    distance(point) {
        // Pythagora's Theorem 
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2))
    }
}