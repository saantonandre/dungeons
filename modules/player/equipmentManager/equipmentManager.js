// FOR TESTING
import { SwordPrototype } from "../../items/swordPrototype/swordPrototype.js"

export class EquipmentManager {
    constructor(source) {
        this.owner = source;

        this.noWeapon = new Weapon();
        this.weapon = new SwordPrototype(this.owner);


        this.noHelmet = new Helmet();
        this.helmet = this.noHelmet;

        this.noVest = new Vest();
        this.vest = this.noVest;
    }
    compute(deltaTime, environment) {
        if (this.weapon) {
            this.weapon.compute(deltaTime, environment);
        }
        this.helmet.compute(deltaTime, environment);
        this.vest.compute(deltaTime, environment);
    }
    render(context, tilesize, ratio, camera) {
        if (this.weapon) {
            this.weapon.render(context, tilesize, ratio, camera);
        }
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
    special() {

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