export const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;
canvas.oncontextmenu = function(event) {
    event.preventDefault();
}

function centerCanvas() {
    canvas.style.position = "absolute";
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
    canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
}
centerCanvas();

window.addEventListener("resize", centerCanvas);
export const c = canvas.getContext("2d");
c.imageSmoothingEnabled = false;
c.fillRect(0, 0, canvas.width, canvas.height);
c.clear = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
}