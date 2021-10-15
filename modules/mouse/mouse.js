export class Mouse {
    constructor(canvas, meta, camera) {
        this.x = 0;
        this.y = 0;
        this.canvas = canvas;
        this.meta = meta;
        this.camera = camera;
        this.absolute = {
            x: 0,
            y: 0
        }
        document.addEventListener("mousemove", this.updatePos)
    }
    updatePos = (evt) => {
        this.x = -this.camera.x + (evt.clientX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.y = -this.camera.y + (evt.clientY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;

        this.absolute.x = (evt.clientX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.absolute.y = (evt.clientY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;
    }
}