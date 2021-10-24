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
        this.times = []
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