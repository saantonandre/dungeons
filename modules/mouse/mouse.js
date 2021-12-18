export class Mouse {
    /**
     * Creates a Mouse object
     * @param {HTMLCanvasElement} canvas The canvas HTML element
     * @param {Meta} meta  Meta informations
     * @param {Camera | any} camera Optional Camera abstraction representing an offset relative to the map (0,0) coordinates
     */
    constructor(canvas, meta, camera) {
        this.x = 0;
        this.y = 0;
        this.canvas = canvas;
        this.meta = meta;
        this.camera = camera;
        /** Absolute position of the mouse (doesn't take to account the camera offsets) */
        this.absolute = {
            x: 0,
            y: 0,
            /** Defines if the mouse is hovering an user interface element */
            hoverUI: false,
            /** Defines if the mouse is currently dragging an user interface element */
            dragging: false,
            /** A reference to whatever the mouse is currently dragging */
            slot: {}
        }
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        document.addEventListener("mousemove", this.updatePos)
    }
    /**
     * Translates the mouse event coordinates into canvas coordinates, relatively to the tilesize/ratio multipliers and the camera offsets
     * @param {*} evt Event object containing information about the mouse pointer position withing the browser
     */
    updatePos = (evt = { clientX: this.lastMouseX, clientY: this.lastMouseY }) => {
        this.lastMouseX = evt.clientX;
        this.lastMouseY = evt.clientY;
        this.x = -this.camera.x + (evt.clientX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.y = -this.camera.y + (evt.clientY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;

        this.absolute.x = (evt.clientX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.absolute.y = (evt.clientY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;
    }
}