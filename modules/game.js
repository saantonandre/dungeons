// should have NO EXPORTS
import { meta } from "./meta/meta.js";
import { c, canvas } from "./canvas/canvas.js";
import { Mouse } from "./mouse/mouse.js";
import { gameDirector } from "./gameDirector/gameDirector.js";

class Game {
    constructor() {}
    initialize() {

        gameDirector.initialize(meta);
        gameDirector.mouse = new Mouse(canvas, meta);
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
        gameDirector.render(c, meta.tilesize, meta.ratio);
        //gameDirector.consoleRender();
        requestAnimationFrame(this.update);
    }
}

export const game = new Game();