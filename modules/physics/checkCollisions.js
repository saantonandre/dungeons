import * as Physics from "./physics.js";
export function checkCollisions(obj, entities, returnColliders = false, simpleCol = true) {
    if (!obj.solid) {
        return false;
    }
    let col = "none";
    /* 
    obj.col.L = 0;
    obj.col.R = 0;
    obj.col.T = 0;
    obj.col.B = 0; 
    */
    let collidersChunk = [];
    for (let entity of entities) {
        //isOutOfScreen(entity) || entity.notSolid
        if (!entity.solid || entity.removed || obj === entity) {
            continue;
        }
        if ((obj.flying && entity.grounded) || (entity.flying && obj.grounded)) {
            continue;
        }
        if (Physics.collided(obj, entity)) {
            //adds item to colliders array
            if (simpleCol) {
                col = Physics.colCheck(obj, entity);
            } else {
                collidersChunk.push(entity);
            }
            if (obj.onCollision) {
                obj.onCollision(entity);
            }
            if (entity.onCollision) {
                entity.onCollision(obj);
            }
        }
    }

    if (collidersChunk.length > 1) {
        collidersChunk = Physics.assembleChunk(collidersChunk, obj);
    }
    for (let i = 0; i < collidersChunk.length; i++) {
        col = Physics.colCheck(obj, collidersChunk[i]);
    }
    /* 
        if (obj.col.R - obj.col.L !== 0) {
            obj.x -= obj.col.R - obj.col.L;
        }
        if (obj.col.B - obj.col.T !== 0) {
            obj.y -= obj.col.B - obj.col.T;
        } */
    if (returnColliders) {
        return collidersChunk;
    }
}