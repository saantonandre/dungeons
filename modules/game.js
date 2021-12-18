// should have NO EXPORTS
import { meta } from "./meta/meta.js";
import { c, canvas } from "./canvas/canvas.js";
import { gameDirector } from "./gameDirector/gameDirector.js";
// import { debug } from "./debug/debug.js";

class Game {
    constructor() {}
    initialize() {

        gameDirector.initialize(meta, canvas);
        this.update();
    }
    /** Steps:
     * - Compute elapsed time from last computation
     * - Clear the canvas
     * - Compute the Game Director components
     * - Render the Game Director components
     * - REPEAT 
     */
    update = () => {
        meta.compute(); // updates the deltaTime and the fps counter
        c.clear(); // clears the canvas

        gameDirector.compute(meta);
        gameDirector.render(c, meta);

        renderBoundingRect()

        // Calls the function again for the next rendering cycle (depending on the monitor update frequency)
        requestAnimationFrame(this.update);
    }
}

/** Renders a square around the canvas (provisional) */
function renderBoundingRect() {
    c.strokeStyle = "black";
    c.beginPath();
    c.rect(0, 0, canvas.width, canvas.height);
    c.closePath();
    c.stroke();
}

export const game = new Game();