export class Mouse {
    constructor(canvas, meta) {
        this.x = 0;
        this.y = 0;
        this.canvas = canvas;
        this.meta = meta;
        document.addEventListener("mousemove", this.updatePos)
    }
    updatePos = (evt) => {
        this.x = (evt.clientX - this.canvas.offsetLeft) / this.meta.tilesize / this.meta.ratio;
        this.y = (evt.clientY - this.canvas.offsetTop) / this.meta.tilesize / this.meta.ratio;
    }
}