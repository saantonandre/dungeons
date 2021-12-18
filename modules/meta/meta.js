class Meta {
    constructor() {
        /** The rendering's unit of measurement, expressed in pixels */
        this.tilesize = 16;
        this.baseRatio = 2;

        /** Acts on the size of each pixel */
        this.ratio = this.baseRatio;

        /** Frames per second */
        this.fps = 0;

        /** Defines whether the fps span will be initialized/displayed */
        this.displayFps = true;

        /** Game time multiplier */
        this.deltaTime = 1;

        /** Target frames per second */
        this.targetFrames = 60;

        /** Target frame time */
        this.perfectFrameTime = 1000 / this.targetFrames;

        this.lastTimestamp = Date.now();
        this.timestamp = Date.now();

        /** Defines the type of the game's loop, A.K.A. 'scene' */
        this.loopType = 0;

        this.baseTilesWidth = 25;
        this.baseTilesHeight = 19;

        /** Number of tiles displayed on screen (width) */
        this.tilesWidth = this.baseTilesWidth;
        /** Number of tiles displayed on screen (height) */
        this.tilesHeight = this.baseTilesHeight;
        this.init();
    }
    /** Initializes the fps counter if displayFps == true */
    init = () => {
        if (this.displayFps) {
            // Creates and styles the html element where the fps will be displayed
            let fpsSpan = document.createElement("span");
            fpsSpan.style.position = "absolute";
            fpsSpan.style.color = "white";
            fpsSpan.style.left = "5px";
            fpsSpan.style.top = "5px";
            // Places it as a child of the html body
            document.body.appendChild(fpsSpan);

            // Calls the fpsCounter function once every second
            setInterval(() => {
                this.fpsCounter(fpsSpan);
            }, 1000);
        }
    }
    /** Updates deltaTime and the fps counter */
    compute = () => {
        this.fps += 1;
        this.updateDeltaTime();
    }
    /** Calculates the difference (delta) of the time elapsed and supposed game speed  */
    updateDeltaTime = () => {
        this.lastTimestamp = this.timestamp;
        this.timestamp = Date.now();
        this.deltaTime =
            (this.timestamp - this.lastTimestamp) / this.perfectFrameTime;

        // Forces the time multiplication to be at max two times the norm
        if (this.deltaTime > 2) {
            this.deltaTime = 2;
        }
    }

    /** Keeps count of the fps, called in a setInterval. 
     * @param {HTMLSpanElement} span The html element where to display the fps variable
     */
    fpsCounter = (span) => {
        span.innerHTML = this.fps;
        this.fps = 0;
    }
}
export const meta = new Meta();
// Create a span to display fps