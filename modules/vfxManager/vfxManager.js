/** 
 *  Acts as intermediate between the manager and the entities,
 *  the entities have a reference to this class OBJECT 
 */
import * as Vfxs from "./vfxs.js"
class VfxManager {
    constructor() {
        this.vfxs = [];
        /** Instead of being deleted, removed Vfxs gets moved here to be reused later */
        this.recyclePool = [];
        /** Contains vfx classes declarations */
        this.vfxClasses = Vfxs;
    }
    compute(deltaTime) {
        for (let vfx of this.vfxs) {
            if (vfx.removed) {
                continue;
            }
            vfx.compute(deltaTime);
        }
        this.collectRemoved();
    }
    render(context, tilesize, ratio, camera) {
        for (let vfx of this.vfxs) {
            if (vfx.removed) {
                continue;
            }
            vfx.render(context, tilesize, ratio, camera);
        }
    }
    /** Moves removed vfxs to the recyclePool */
    collectRemoved() {
        for (let i = this.vfxs.length - 1; i >= 0; i--) {
            if (this.vfxs[i].removed) {
                this.recyclePool.push(this.vfxs.splice(i, 1))
            }
        }
    }
    /** Returns a recycled vfx or FALSE */
    getRecycledVfx(vfxType, x, y) {
        for (let vfx of this.recyclePool) {
            if (vfx.type === vfxType) {
                vfx.reset(x, y);
                return removed;
            }
        }
        return false;
    }
    /** Returns a Vfx of the requested type */
    create(vfxType, x, y) {
        return getRecycledVfx(vfxType, x, y) || new this.vfxClasses[vfxType](vfxType, x, y);
    }
}