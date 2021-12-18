/** Gets called after the velocities have been set 
 * 
 * Contains my own javascript implementation of the SWEPT AABB algorithm, after taking to account many resources on the matter:
 * @link https://www.youtube.com/watch?v=8JJ-4JgR7Dg
 * @link https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084/
 * @link https://blog.hamaluik.ca/posts/swept-aabb-collision-using-minkowski-difference/
 */
// import { debug } from '../debug/debug.js'
export function checkCollisions(obj, entities, deltaTime = 1) {
    if (!obj.solid) {
        // return false if the object calling this function is not solid
        return false;
    }
    // Decides if the col should be checked normally, without vectors
    simpleCollisionCheck(obj, entities);
    if (obj.xVel + obj.xVelExt === 0 && obj.yVel + obj.yVelExt === 0) {
        return;
    }

    // Broad Phase
    // Step 1: Create a broad hitbox with the added size of the velocities
    let velocitiesX = (obj.xVel + obj.xVelExt);
    let velocitiesY = (obj.yVel + obj.yVelExt);

    /** If the object has an hitbox property, check collision with that */
    let objHitbox = obj.hitbox ? obj.hitbox : obj;

    /** Bigger hitbox for the broad phase */
    let broadHitbox = {
        x: velocitiesX > 0 ? objHitbox.x : objHitbox.x + velocitiesX * deltaTime,
        y: velocitiesY > 0 ? objHitbox.y : objHitbox.y + velocitiesY * deltaTime,
        w: velocitiesX > 0 ? objHitbox.w + velocitiesX * deltaTime : objHitbox.w - velocitiesX * deltaTime,
        h: velocitiesY > 0 ? objHitbox.h + velocitiesY * deltaTime : objHitbox.h - velocitiesY * deltaTime
    };

    /** debug player dir*/
    //debug.drawLine({ x: obj.centerX, y: obj.centerY }, { x: obj.centerX + velocitiesX * deltaTime, y: obj.centerY + velocitiesY * deltaTime }, "white")
    /** debug broadHitbox*/
    //debug.drawRect(broadHitbox, "cyan")

    /** Vector containing pairs of (ID, contactTime) */
    let colPointsVector = [];
    /** Contact Time */
    const ct = { value: 0.0 };
    /** Contact Point */
    const cp = { x: 0, y: 0 };
    /** Contact normal */
    const cn = { x: 0, y: 0 };

    /** Defines if the level has been changed */
    let levelChange = false;
    // Step 2: 
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        // Skip collision exceptions
        if (collisionException(obj, entity)) {
            continue;
        }
        // BROAD
        // Checks broad hitbox collisions with entities
        if (collided(broadHitbox, entity)) {
            // Checks corner points collisions

            // NARROW
            // If the entity has an hitbox, use it instead
            let entityHitbox = entity.hitbox ? entity.hitbox : entity;
            // Swept collision check
            if (dynamicRectVsRect(objHitbox, entityHitbox, velocitiesX, velocitiesY, deltaTime, cp, cn, ct)) {
                // Handles eventual collision events
                if (obj.onCollision) {
                    obj.onCollision(entity, entities);
                }
                if (entity.onCollision) {
                    if (entity.onCollision(obj, entities) === 'levelChange') {
                        /** A level-changing event has been triggered */
                        levelChange = true;
                        return;
                    };
                }
                // Skip resolve exceptions
                if (resolveException(obj, entity)) {
                    continue;
                }
                colPointsVector.push({ id: i, ct: ct.value })

                // Compute point colliders
            }
        }
    }
    if (levelChange) {
        // Entities are changed, no point in resolving 
        return;
    }
    if (colPointsVector.length === 0) {
        //console.log('No colliders were found, obj xVel = ', obj.xVel)
        return;
    }
    // Do the sort
    colPointsVector.sort((a, b) => { return a.ct - b.ct });
    // Now resolve the collision in correct order 
    for (let rect of colPointsVector) {
        resolveDynamicRectVsRect(obj, deltaTime, entities[rect.id]);
    }

    /** 
     * Fixes slide direction change in case velocities were initially diagonal 
     * (Its' implied that at least one of the velocities isn't 0)
     * (Its' also implied there has been a collision at this point)
     * 
     */
    if (velocitiesX != 0 && velocitiesY != 0) {
        //console.log("Recursion happened");
        checkCollisions(obj, entities, deltaTime);
    }
}

class PointsCollider {
    constructor() {
        this.entity;
        this.offset = -0.01;
        /** Top left collider */
        this.TL = { x: 0, y: 0, col: false }
        /** Top right collider */
        this.TR = { x: 0, y: 0, col: false }
        /** Bottom left collider */
        this.BL = { x: 0, y: 0, col: false }
        /** Bottom right collider */
        this.BR = { x: 0, y: 0, col: false }

    }
    /** Sets the collision points on each corner of the entity */
    setColPoints(entity) {
        this.entity = entity;
        let entityHitbox = entity.hitbox ? entity.hitbox : entity;
        this.TL = {
            x: entityHitbox.x - this.offset,
            y: entityHitbox.y - this.offset,
            col: false
        };
        this.TR = {
            x: entityHitbox.x + entityHitbox.w + this.offset,
            y: entityHitbox.y - this.offset,
            col: false
        };
        this.BL = {
            x: entityHitbox.x - this.offset,
            y: entityHitbox.y + entityHitbox.h + this.offset,
            col: false
        };
        this.BR = {
            x: entityHitbox.x + entityHitbox.w + this.offset,
            y: entityHitbox.y + entityHitbox.h + this.offset,
            col: false
        };
    }
    /** Checks Points collision */
    checkCols(collider) {
        if (!this.TL.col)
            this.TL.col = pointRectCol(this.TL, collider);
        if (!this.TR.col)
            this.TR.col = pointRectCol(this.TR, collider);
        if (!this.BL.col)
            this.BL.col = pointRectCol(this.BL, collider);
        if (!this.BR.col)
            this.BR.col = pointRectCol(this.BR, collider);
    }
    /** Move the entity depending on the collided points */
    resolveCollisions() {
        //debug.drawPoint(this.TL, this.TL.col ? 'red' : 'yellow')
        //debug.drawPoint(this.TR, this.TR.col ? 'red' : 'yellow')
        //debug.drawPoint(this.BL, this.BL.col ? 'red' : 'yellow')
        //debug.drawPoint(this.BR, this.BR.col ? 'red' : 'yellow')
        if (this.TL.col || this.BL.col) {
            if (this.entity.xVel < 0) {
                this.entity.xVel = 0;
            }
            if (this.entity.xVelExt < 0) {
                this.entity.xVelExt = 0;
            }
        }
        if (this.TR.col || this.BR.col) {
            if (this.entity.xVel > 0) {
                this.entity.xVel = 0;
            }
            if (this.entity.xVelExt > 0) {
                this.entity.xVelExt = 0;
            }
        }
        if (this.TL.col || this.TR.col) {
            if (this.entity.yVel < 0) {
                this.entity.yVel = 0;
            }
            if (this.entity.yVelExt < 0) {
                this.entity.yVelExt = 0;
            }
        }
        if (this.BL.col || this.BR.col) {
            if (this.entity.yVel > 0) {
                this.entity.yVel = 0;
            }
            if (this.entity.yVelExt > 0) {
                this.entity.yVelExt = 0;
            }
        }
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
    //debug.drawRect(objHitbox2, 'cyan')
    if (dynamicRectVsRect(objHitbox1, objHitbox2, velocitiesX, velocitiesY, deltaTime, contactPoint, contactNormal, contactTime)) {
        //if (contactNormal.x < 0) { obj.col.R = -contactNormal.x * Math.abs(velocitiesY) * (1 - contactTime.value); }
        //if (contactNormal.x > 0) { obj.col.L = contactNormal.x * Math.abs(velocitiesX) * (1 - contactTime.value); }
        //if (contactNormal.y < 0) { obj.col.B = -contactNormal.y * Math.abs(velocitiesX) * (1 - contactTime.value); }
        //if (contactNormal.y > 0) { obj.col.T = contactNormal.y * Math.abs(velocitiesY) * (1 - contactTime.value); }

        // console.log('resolved a collision, old xVel = ', obj.xVel)
        // To avoid weird JS numbers behaviour
        let overlapFixMultiplier = 1.001;
        obj.xVel += contactNormal.x * Math.abs(obj.xVel) * (1.0 - contactTime.value) * overlapFixMultiplier;
        obj.yVel += contactNormal.y * Math.abs(obj.yVel) * (1.0 - contactTime.value) * overlapFixMultiplier;
        obj.xVelExt += contactNormal.x * Math.abs(obj.xVelExt) * (1.0 - contactTime.value) * overlapFixMultiplier;
        obj.yVelExt += contactNormal.y * Math.abs(obj.yVelExt) * (1.0 - contactTime.value) * overlapFixMultiplier;


        //obj.xVel = 0;
        //obj.yVel = 0;
        // console.log('new xVel', obj.xVel)
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
    /** debug broadHitbox*/
    //debug.drawRect(expanded, "orange")
    let centerRectA = {
        x: rectA.x + rectA.w / 2,
        y: rectA.y + rectA.h / 2
    }
    let direction = {
        x: xVel * deltaTime,
        y: yVel * deltaTime
    }
    if (rayVsRect(centerRectA, direction, expanded, contactPoint, contactNormal, contactTime)) {
        //console.log('ray v rect returned ct', contactTime.value)
        return (contactTime.value >= 0 && contactTime.value < 1);
    } else {
        //console.log('ray v rect returned false')
        return false;
    }

}
export function pointRectCol(point, rectangle, forceSpriteBox = false) {
    let rect = rectangle.hitbox && !forceSpriteBox ? rectangle.hitbox : rectangle;
    if (point.x >= rect.x) {
        if (point.x <= rect.x + rect.w) {
            if (point.y >= rect.y) {
                if (point.y <= rect.y + rect.h) {
                    return true;
                }
            }

        }
    }
    return false;
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

/** Defines whether the collision check is unnecessary */
function collisionException(obj, entity) {
    if (entity.removed || entity == obj) {
        return true;
    }
    return false;
}
/** Defines whether the collision resolve should be avoided */
function resolveException(obj, entity) {
    if (!entity.solid ||
        entity.removed ||
        entity == obj ||
        entity.grounded && !obj.grounded) {
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
export function simpleCollisionCheck(obj, entities) {
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
            if (resolveException(obj, entity)) {
                continue;
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