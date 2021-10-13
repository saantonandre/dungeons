// FOR TESTING
import { SwordPrototype } from "../../items/swordPrototype/swordPrototype.js"

export class EquipmentManager {
    constructor(source) {
        this.owner = source;

        this.weapon = new SwordPrototype(this.owner);
        this.helmet = new Helmet();
        this.vest = new Vest();
    }
    compute(deltaTime, environment) {
        this.weapon.compute(deltaTime, environment);
        this.helmet.compute(deltaTime, environment);
        this.vest.compute(deltaTime, environment);
    }
    render(context, tilesize, ratio, camera) {
        this.weapon.render(context, tilesize, ratio, camera);
        this.helmet.render(context, tilesize, ratio, camera);
        this.vest.render(context, tilesize, ratio, camera);
    }
}

class Weapon {
    constructor() {
        // ATTACK type and DMG
    }
    attack() {

    }
    compute() {

    }
    render() {

    }
}
class Helmet {
    constructor() {
        // WEAPON modifier
    }
    compute() {

    }
    render() {

    }
}
class Vest {
    constructor() {
        // DEF and SPEED
    }
    compute() {

    }
    render() {

    }
}