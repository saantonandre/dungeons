// Creates the canvas element and exports it
export const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

canvas.width = 800;
canvas.height = 600;

/** Prevents right clicks menu from appearing */
window.oncontextmenu = function(event) {
    event.preventDefault();
}
/** Moves the canvas to the center by giving it an offset to the top/left sides */
function centerCanvas() {
    canvas.style.position = "absolute";
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
}
// Center the canvas at runtime
centerCanvas();

/** Calls the centerCanvas function every time the window size changes */
window.addEventListener("resize", centerCanvas);

// Exports the drawing context
export const c = canvas.getContext("2d");
// Disables anti aliasing
c.imageSmoothingEnabled = false;

// Clears the canvas (gets called every frame before drawing)
c.clear = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
}