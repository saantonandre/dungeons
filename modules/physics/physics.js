/*
    Requires the map to have the following properties:
    
    map.tilesWidth = the width of the canvas in terms of tiles
    map.tilesHeight = the height of the canvas in terms of tiles

export function isOutOfScreen(entity, optionalMargin) {
    let margin = optionalMargin == undefined ? 1 : optionalMargin;
    if (entity == null) {
        return true;
    }
    if (entity.x > map.tilesWidth - map.x + margin) {
        return true;
    }
    if (entity.x + margin + entity.w < -map.x) {
        return true;
    }
    if (entity.y > map.tilesHeight - map.y + margin) {
        return true;
    }
    if (entity.y + margin + entity.h < -map.y) {
        return true;
    }
    return false;
}
*/


/*
    Requires the map to have the following properties:
    
    map.levelX = the x position of the level on the map
    map.levelY = the y position of the level on the map
    map.levelWidth = the width of the level
    map.levelHeight = the height of the level
export function isOutOfBounds(entity, optionalMargin) {
    let margin = optionalMargin == undefined ? 1 : optionalMargin;
    if (entity == null) {
        return true;
    }
    if (entity.x + entity.w > map.levelWidth + map.levelX + margin) {
        return true;
    }
    if (entity.x < map.levelX - margin) {
        return true;
    }
    if (entity.y + entity.h > map.levelHeight + map.levelY + margin) {
        return true;
    }
    if (entity.y < map.levelY - margin) {
        return true;
    }
    return false;
}
*/

export function colCheck(shapeA, shapeB) {
    if (shapeA == null || shapeB == null) {
        return true;
    }
    // get the vectors to check against
    var shapeAA, shapeBB;
    if (shapeA.hitbox != null) {
        shapeAA = shapeA.hitbox;
    } else {
        shapeAA = shapeA;
    }
    if (shapeB.hitbox != null) {
        shapeBB = shapeB.hitbox;
    } else {
        shapeBB = shapeB;
    }
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

/*
    To use this:
    -Check for all the simple collisions
    -Send the collided entities' array and the colliding object
    Returns:
    An array of the merged colliders.
*/
// Merges the colliders(asks for a list of colliders and return another one)
export function assembleChunk(chunk, obj) {
    let assembledChunks = [];
    let brokenChunk = [];
    if (chunk.length == 1) {
        return (chunk);
    }
    for (let i = 0; i < chunk.length; i++) {
        for (let j = 0; j < chunk[i].w; j++) {
            for (let k = 0; k < chunk[i].h; k++) {
                let part = {
                    x: chunk[i].x + j,
                    y: chunk[i].y + k,
                    w: 1,
                    h: 1
                }
                if (collided(obj, part)) {
                    brokenChunk.push(part);
                }
            }
        }
    }
    let firstBlock = {
        x: brokenChunk[0].x,
        y: brokenChunk[0].y,
        w: brokenChunk[0].w,
        h: brokenChunk[0].h
    }
    assembledChunks.push(firstBlock)
    let a, b;
    for (let i = 0; i < brokenChunk.length; i++) {
        for (let j = 0; j < assembledChunks.length; j++) {
            a = brokenChunk[i].hitbox ? brokenChunk[i].hitbox : brokenChunk[i];
            b = assembledChunks[j];
            if (a.y == b.y && a.h == b.h) {
                if (a.x + a.w > b.x + b.w) {
                    b.w = a.x + a.w - b.x;
                }
                if (a.x < b.x) {
                    b.w += b.x - a.x;
                    b.x = a.x;
                }
            } else if (a.x == b.x && a.w == b.w) {
                if (a.y + a.h > b.y + b.h) {
                    b.h = a.y + a.h - b.y;
                }
                if (a.y < b.y) {
                    b.h += b.y - a.y;
                    b.y = a.y;
                }
            } else {
                let temp = {
                    x: a.x,
                    y: a.y,
                    w: a.w,
                    h: a.h
                }
                assembledChunks.push(temp)
            }
        }
    }
    return assembledChunks;
}

export function collided(a, b) {
    var square1 = a.hitbox ? a.hitbox : a;
    var square2 = b.hitbox ? b.hitbox : b;
    if (square1.x < square2.x + square2.w) {
        if (square1.x + square1.w > square2.x) {
            if (square1.y < square2.y + square2.h) {
                if (square1.y + square1.h > square2.y) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function pointSquareCol(point, sq) {
    var square = sq;
    if (sq.hitbox !== undefined) {
        square = sq.hitbox;
    }
    if (point.x >= square.x) {
        if (point.x <= square.x + square.w) {
            if (point.y >= square.y) {
                if (point.y <= square.y + square.h) {
                    return true;
                }
            }

        }
    }
    return false;
}

export function lineSquareCol(line, sq) {
    let squareLines = getRectSides(sq);
    for (let i = 0; i < squareLines.length; i++) {
        if (intersect(
                squareLines[i].x1,
                squareLines[i].y1,
                squareLines[i].x2,
                squareLines[i].y2,
                line.x1,
                line.y1,
                line.x2,
                line.y2
            )) {
            return true;
        }
    }

    return false;
}

export function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {
        x,
        y
    }
}

export function getRectSides(rect) {
    let sides = [];
    let sq = rect;
    if (rect.hitbox !== undefined) {
        sq = rect.hitbox;
    }
    sides.push({
        x1: sq.x,
        y1: sq.y,
        x2: sq.x + sq.w,
        y2: sq.y
    })
    sides.push({
        x1: sq.x + sq.w,
        y1: sq.y,
        x2: sq.x + sq.w,
        y2: sq.y + sq.h
    })
    sides.push({
        x1: sq.x + sq.w,
        y1: sq.y + sq.h,
        x2: sq.x,
        y2: sq.y + sq.h
    })
    sides.push({
        x1: sq.x,
        y1: sq.y + sq.h,
        x2: sq.x,
        y2: sq.y
    })


    return sides;
}
export function returnCosine(x1, y1, x2, y2) {
    let cosine = {
        cos: 0,
        sin: 0
    };
    let deltaX = x1 - x2;
    let deltaY = y1 - y2;
    let rotation = Math.atan2(deltaY, deltaX);
    cosine.cos = Math.cos(rotation);
    cosine.sin = Math.sin(rotation);
    return cosine;
}

// returns [cos,sin]
export function cosSin(x1, y1, x2, y2) {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    let rotation = Math.atan2(deltaY, deltaX);
    let xTarget = Math.cos(rotation);
    let yTarget = Math.sin(rotation);
    return [xTarget, yTarget];
}
export function getAngle(x1, y1, x2, y2) {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    let rotation = Math.atan2(deltaY, deltaX);
    return rotation;
}
export function getRotation(obj1, obj2) {
    let x = obj1.x + obj1.w / 2;
    let y = obj1.y + obj1.h / 2;
    let x2 = obj2.x + obj2.w / 2;
    let y2 = obj2.y + obj2.h / 2;
    let deltaX = x2 - x;
    let deltaY = y2 - y;
    return Math.atan2(deltaY, deltaX);
}

export function distance(obj1, obj2) {
    let x1 = obj1.w ? obj1.x + obj1.w / 2 : obj1.x;
    let y1 = obj1.h ? obj1.y + obj1.h / 2 : obj1.y;

    let x2 = obj2.w ? obj2.x + obj2.w / 2 : obj2.x;
    let y2 = obj2.h ? obj2.y + obj2.h / 2 : obj2.y;

    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}