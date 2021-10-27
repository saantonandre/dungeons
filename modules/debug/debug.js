class Debug {
    constructor() {
        let div = document.createElement("div");
        div.style.color = "white";
        div.style.backgroundColor = "black";
        div.style.opacity = 0.8;
        div.style.position = "absolute";
        div.style.left = '0';
        div.style.bottom = '0';
        div.style.padding = '10px';
        this.div = div;
        this.active = false;
        this.times = [];
        this.drawLater = [];
    }
    drawRect(rect, color = 'red') {
        this.drawLater.push({ color: color, type: 'rect', x: rect.x, y: rect.y, w: rect.w, h: rect.h })
    }
    drawPoint(point, color = 'red') {
        this.drawLater.push({ color: color, type: 'point', x: point.x - 0.1, y: point.y - 0.1, w: 0.2, h: 0.2 })
    }
    drawLine(pointA, pointB, color = 'red') {
        this.drawLater.push({ color: color, type: 'line', x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y })
    }
    render(context, tilesize, ratio, camera) {
        for (let draw of this.drawLater) {
            context.beginPath();
            context.strokeStyle = draw.color;
            switch (draw.type) {
                case 'point':
                case 'rect':
                    context.rect(
                        (draw.x + camera.x) * tilesize * ratio,
                        (draw.y + camera.y) * tilesize * ratio,
                        (draw.w) * tilesize * ratio,
                        (draw.h) * tilesize * ratio
                    )
                    break;
                case 'line':
                    context.moveTo((draw.x1 + camera.x) * tilesize * ratio, (draw.y1 + camera.y) * tilesize * ratio);
                    context.lineTo((draw.x2 + camera.x) * tilesize * ratio, (draw.y2 + camera.y) * tilesize * ratio);
                    break;

            }
            context.closePath();
            context.stroke();
        }
        this.drawLater.length = 0;
    }
    activate() {
        this.active = true;
        document.body.appendChild(this.div);
        setInterval(this.printTime, 1000);
    }
    averageTime = () => {
        let sum = 0;
        for (let time of this.times) {
            sum += time;
        }
        return sum / this.times.length;
    }
    printTime = () => {
        this.div.innerHTML = `Function time: ${this.averageTime().toFixed(4)}ms`;
        this.times.length = 0;

    }
    // Measures the time a function takes to complete(ms)
    measureTime = (callback, ...args) => {
        if (!this.active) { this.activate(); }
        let start = performance.now();
        callback(...args);
        this.times.push(performance.now() - start);
    }
}
export const debug = new Debug();