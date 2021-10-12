import { game } from "./modules/game.js";

console.time("Load Time");
game.initialize();
console.timeEnd("Load Time");