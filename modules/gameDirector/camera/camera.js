export class Camera {
    constructor() {
        this.focus = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };
        this.lockedAngles = true;
        this.zoom = false;
        this.x = 0;
        this.y = 0;
    }
    compute(meta, level) {
        // Compute the ratio
        if (this.zoom) {
            if (meta.ratio < meta.baseRatio * 2) {
                meta.ratio += (0.005 + (meta.baseRatio * 2 - meta.ratio) / 22) * meta.deltaTime;
            }

            if (meta.ratio > meta.baseRatio * 2) {
                meta.ratio = meta.baseRatio * 2;
            }

            meta.tilesWidth = meta.baseTilesWidth * (meta.baseRatio / meta.ratio);
            meta.tilesHeight = meta.baseTilesHeight * (meta.baseRatio / meta.ratio);

        } else {
            if (meta.ratio != meta.baseRatio) {
                meta.ratio = meta.baseRatio;
                meta.tilesWidth = meta.baseTilesWidth;
                meta.tilesHeight = meta.baseTilesHeight;
            }
        }
        // Updates meta pos

        if (this.focus) {
            let xx = -(this.focus.x + this.focus.w / 2 - (meta.tilesWidth) / 2)
            let yy = -(this.focus.y + this.focus.h / 2 - (meta.tilesHeight) / 2)
            this.x += (xx - this.x) / 15 * meta.deltaTime;
            this.y += (yy - this.y) / 15 * meta.deltaTime;
        }
        if (this.lockedAngles) {
            // left boundary

            if (-this.x < -level.levelX) {
                this.x = level.levelX;
            }
            // top boundary
            // +0.5 to counterweight the top UI 
            if (-this.y < -level.levelY + 0.5) {
                this.y = level.levelY + 0.5;
            }

            // Right boundary
            if (-this.x > level.levelX + level.levelW - meta.tilesWidth) {
                this.x = -(level.levelX + level.levelW - meta.tilesWidth);
            }
            // Down boundary
            if (-this.y > level.levelY + level.levelH - meta.tilesHeight) {
                this.y = -(level.levelY + level.levelH - meta.tilesHeight);
            }
        }
    }
}