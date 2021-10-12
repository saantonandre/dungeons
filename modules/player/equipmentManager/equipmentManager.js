export class EquipmentManager {
    constructor(source) {
        this.owner = source;

        this.weapon = new Weapon();
        this.helmet = new Helmet();
        this.vest = new Vest();
    }
    compute() {}
    render() {}
}

class Weapon {
    constructor() {

    }
}
class Helmet {
    constructor() {

    }
}
class Vest {
    constructor() {

    }
}