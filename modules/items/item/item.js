import * as Physics from "../../physics/physics.js";
import { Entity } from "../../entity/entity.js";


export class Item extends Entity {
    constructor() {
        super(0, 0);
        this.Physics = Physics;
        this.solid = false;
        this.type = "item";
        this.flying = false;
    }
}