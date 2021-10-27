// should have NO EXPORTS
import { meta } from "./meta/meta.js";
import { c, canvas } from "./canvas/canvas.js";
import { gameDirector } from "./gameDirector/gameDirector.js";
import { debug } from "./debug/debug.js";

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

        //gameDirector.consoleRender();
        //setTimeout(this.update, 1000 / 2)
        requestAnimationFrame(this.update);
    }
}

export const game = new Game();