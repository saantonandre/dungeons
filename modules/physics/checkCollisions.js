/** Gets called after the velocities have been set */
import { debug } from '../debug/debug.js'
export function checkCollisions(obj, entities, deltaTime = 1) {
    if (!obj.solid) {
        // return false if the object calling this function is not solid
        return false;
    }
    // Decides if the col should be checked normally, without vectors
    if (obj.xVel + obj.xVelExt === 0 && obj.yVel + obj.yVelExt === 0) {
        //simpleCollisionCheck(obj, entities);
        return;
    }

    // Broad Phase
    // Step 1: Create a broad hitbox with the added size of the velocities
    let velocitiesX = (obj.xVel + obj.xVelExt);
    let velocitiesY = (obj.yVel + obj.yVelExt);

    /** If the object has an hitbox property, check collision with that */
    let objHitbox = obj.hitbox ? obj.hitbox : obj;

    // Make a bigger hitbox for the broad phase
    let broadHitbox = {
        x: velocitiesX > 0 ? objHitbox.x : objHitbox.x + velocitiesX * deltaTime,
        y: velocitiesY > 0 ? objHitbox.y : objHitbox.y + velocitiesY * deltaTime,
        w: velocitiesX > 0 ? objHitbox.w + velocitiesX * deltaTime : objHitbox.w - velocitiesX * deltaTime,
        h: velocitiesY > 0 ? objHitbox.h + velocitiesY * deltaTime : objHitbox.h - velocitiesY * deltaTime
    };
    debug.drawRect(broadHitbox)

    /** Vector containing pairs of (ID, contactTime) */
    let colPointsVector = [];
    /** Contact Time */
    const ct = { value: 0.0 };
    /** Contact Point */
    const cp = { x: 0, y: 0 };
    /** Contact normal */
    const cn = { x: 0, y: 0 };


    // Step 2: 
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        // Skip exceptions
        if (collisionException(obj, entity)) {
            continue;
        }
        // BROAD
        // Checks broad hitbox collisions with entities
        if (collided(broadHitbox, entity)) {
            // NARROW
            // If the entity has an hitbox, use it instead
            let entityHitbox = entity.hitbox ? entity.hitbox : entity;
            // Swept collision check
            if (dynamicRectVsRect(objHitbox, entityHitbox, velocitiesX, velocitiesY, deltaTime, cp, cn, ct)) {
                debug.drawLine(cp, { x: cp.x + cn.x * ct.value, y: cp.y + cn.y * ct.value });
                // Handles eventual collision events
                if (obj.onCollision) {
                    obj.onCollision(entity);
                }
                if (entity.onCollision) {
                    entity.onCollision(obj);
                }
                colPointsVector.push({ id: i, ct: ct.value })
            }
        }
    }
    if (colPointsVector.length === 0) {
        return;
    }
    // Do the sort
    colPointsVector.sort((a, b) => { return a.ct - b.ct });
    // Now resolve the collision in correct order 
    for (let rect of colPointsVector) {
        resolveDynamicRectVsRect(obj, deltaTime, entities[rect.id]);
    }
}

function resolveDynamicRectVsRect(obj, deltaTime, rectB) {
    let contactPoint = { x: 0, y: 0 };
    let contactNormal = { x: 0, y: 0 };
    let contactTime = { value: 0.0 };
    let velocitiesX = (obj.xVel + obj.xVelExt);
    let velocitiesY = (obj.yVel + obj.yVelExt);

    let objHitbox1 = obj.hitbox ? obj.hitbox : obj;
    let objHitbox2 = rectB.hitbox ? rectB.hitbox : rectB;

    if (dynamicRectVsRect(objHitbox1, objHitbox2, velocitiesX, velocitiesY, deltaTime, contactPoint, contactNormal, contactTime)) {
        //if (contactNormal.x < 0) { obj.col.R = -contactNormal.x * Math.abs(velocitiesY) * (1 - contactTime.value); }
        //if (contactNormal.x > 0) { obj.col.L = contactNormal.x * Math.abs(velocitiesX) * (1 - contactTime.value); }
        //if (contactNormal.y < 0) { obj.col.B = -contactNormal.y * Math.abs(velocitiesX) * (1 - contactTime.value); }
        //if (contactNormal.y > 0) { obj.col.T = contactNormal.y * Math.abs(velocitiesY) * (1 - contactTime.value); }

        obj.xVel += contactNormal.x * Math.abs(obj.xVel) * (1.0 - contactTime.value);
        obj.yVel += contactNormal.y * Math.abs(obj.yVel) * (1.0 - contactTime.value);
        obj.xVelExt += contactNormal.x * Math.abs(obj.xVelExt) * (1.0 - contactTime.value);
        obj.yVelExt += contactNormal.y * Math.abs(obj.yVelExt) * (1.0 - contactTime.value);
        //obj.xVel = 0;
        //obj.yVel = 0;
        return true;
    }

    return false;
}

/** Swaps 2 values */
function dynamicRectVsRect(rectA, rectB, xVel, yVel, deltaTime, contactPoint, contactNormal, contactTime) {
    // Check if dynamic rectangle is actually moving  
    // we assume rectangles are NOT in collision to start
    if (xVel == 0 && yVel == 0) {
        return false;
    }
    contactTime.value = 0;
    // Expand target rectangle by source dimensions
    let expanded = {
        x: rectB.x - rectA.w / 2,
        y: rectB.y - rectA.h / 2,
        w: rectB.w + rectA.w,
        h: rectB.h + rectA.h
    }
    debug.drawRect(expanded)
    let centerRectA = {
        x: rectA.x + rectA.w / 2,
        y: rectA.y + rectA.h / 2
    }
    let direction = {
        x: xVel * deltaTime,
        y: yVel * deltaTime
    }
    debug.drawLine(centerRectA, { x: centerRectA.x + direction.x, y: centerRectA.y + direction.y });
    if (rayVsRect(centerRectA, direction, expanded, contactPoint, contactNormal, contactTime)) {

        return (contactTime.value >= 0.0 && contactTime.value < 1.0);
    } else {
        return false;
    }

}

/**
 * @param {Object} origin (point)
 * @param {Object} direction (point)
 * @param {Object} target (rectangle)
 * @param {Object} contactPoint (point)
 * @param {Object} contactNormal (point)
 * @param {Object} timeHitNear ({value:Number})
 */
function rayVsRect(origin, direction, target, contactPoint, contactNormal, timeHitNear) {

    contactPoint.x = 0;
    contactPoint.y = 0;

    contactNormal.x = 0;
    contactNormal.y = 0;

    // Cache division
    let inverseDir = {
        x: 1 / direction.x,
        y: 1 / direction.y
    };
    // Calculate intersections with rectangle bounding axes
    let timeNear = {
        x: (target.x - origin.x) * inverseDir.x,
        y: (target.y - origin.y) * inverseDir.y
    }
    let timeFar = {
        x: (target.x + target.w - origin.x) * inverseDir.x,
        y: (target.y + target.h - origin.y) * inverseDir.y
    }
    if (isNaN(timeFar.y) || isNaN(timeFar.x)) { return false };
    if (isNaN(timeNear.y) || isNaN(timeNear.x)) { return false };

    // Sort distances
    if (timeNear.x > timeFar.x) {
        let temp = timeNear.x;
        timeNear.x = timeFar.x;
        timeFar.x = temp;
    }
    if (timeNear.y > timeFar.y) {
        let temp = timeNear.y;
        timeNear.y = timeFar.y;
        timeFar.y = temp;
    }

    // Early rejection		
    if (timeNear.x > timeFar.y || timeNear.y > timeFar.x) { return false; }

    // Closest 'time' will be the first contact
    timeHitNear.value = Math.max(timeNear.x, timeNear.y);

    // Furthest 'time' is contact on opposite side of target
    let timeHitFar = Math.min(timeFar.x, timeFar.y);

    // Reject if ray direction is pointing away from object
    if (timeHitFar < 0) { return false; }

    // Contact point of collision from parametric line equation
    contactPoint.x = origin.x + timeHitNear.value * direction.x;
    contactPoint.y = origin.y + timeHitNear.value * direction.y;


    if (timeNear.x > timeNear.y) {
        if (inverseDir.x < 0) {
            contactNormal.x = 1;
            contactNormal.y = 0;
        } else {
            contactNormal.x = -1;
            contactNormal.y = 0;
        }
    } else if (timeNear.x < timeNear.y) {
        if (inverseDir.y < 0) {
            contactNormal.x = 0;
            contactNormal.y = 1;
        } else {
            contactNormal.x = 0;
            contactNormal.y = -1;
        }
    }
    return true;
}

/** Defines whether the collision check should be avoided */
function collisionException(obj, entity) {
    if (!entity.solid ||
        entity.removed ||
        entity == obj ||
        entity.grounded && obj.flying ||
        entity.flying && obj.grounded) {
        return true;
    }
    return false;
}


function collided(a, b, forceSpriteBox = false) {
    let rect1 = a.hitbox && !forceSpriteBox ? a.hitbox : a;
    let rect2 = b.hitbox && !forceSpriteBox ? b.hitbox : b;
    if (rect1.x < rect2.x + rect2.w) {
        if (rect1.x + rect1.w > rect2.x) {
            if (rect1.y < rect2.y + rect2.h) {
                if (rect1.y + rect1.h > rect2.y) {
                    return true;
                }
            }
        }
    }
    return false;
}

/** Gets called if a more advanced colcheck is not necessary */
function simpleCollisionCheck(obj, entities) {
    for (let entity of entities) {
        if (collisionException(obj, entity)) {
            continue;
        }
        if (collided(obj, entity)) {
            if (obj.onCollision) {
                obj.onCollision(entity);
            }
            if (entity.onCollision) {
                entity.onCollision(obj);
            }
            colCheck(obj, entity);
        }
    }
}
export function colCheck(shapeA, shapeB) {
    if (shapeA == null || shapeB == null) {
        return true;
    }
    // get the vectors to check against
    var shapeAA = shapeA.hitbox || shapeA,
        shapeBB = shapeB.hitbox || shapeB;
    var vX = (shapeAA.x + (shapeAA.w / 2)) - (shapeBB.x + (shapeBB.w / 2)),
        vY = (shapeAA.y + (shapeAA.h / 2)) - (shapeBB.y + (shapeBB.h / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeAA.w / 2) + (shapeBB.w / 2),
        hHeights = (shapeAA.h / 2) + (shapeBB.h / 2),
        colDir = false;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = 't';
                if (shapeA.col.T < oY) {
                    if (oY > 0.01)
                        shapeA.col.T += oY;
                }
            } else {
                colDir = 'b';
                if (shapeA.col.B < oY) {
                    if (oY > 0.01)
                        shapeA.col.B += oY;
                }
            }

        } else {
            if (vX > 0) {
                colDir = 'l';
                if (shapeA.col.L < oX) {
                    if (oX > 0.01)
                        shapeA.col.L += oX;
                }
            } else {
                colDir = 'r';
                if (shapeA.col.R < oX) {
                    if (oX > 0.01)
                        shapeA.col.R += oX;
                }
            }
        }

    }

    return colDir;

}