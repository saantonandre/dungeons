/** 
 *  Acts as intermediate between the manager and the entities,
 *  the entities have a reference to this class OBJECT 
 */
import * as Vfxs from "./vfxs.js";
export { vfxManager };
/** Singleton */
class VfxManager {
    constructor() {
        /** Instead of being deleted, removed Vfxs gets moved here to be reused later, gets populated by the gameDirector */
        this.recyclePool = [];
        /** Contains vfx classes declarations */
        this.vfxClasses = Vfxs;
    }
    /** Returns a recycled vfx or FALSE */
    getRecycledVfx(vfxName, source) {
        for (let i = 0; i < this.recyclePool.length; i++) {
            if (this.recyclePool[i].name === vfxName) {
                /** Found a matching Vfx */
                this.recyclePool[i].reset(source);
                return this.recyclePool.splice(i, 1)[0];
            }
        }
        /** Matching Vfx was not found */
        return false;
    }
    /** Returns a Vfx of the requested type, this function gets imported and called by entities */
    create = (vfxName, source) => {
        return this.getRecycledVfx(vfxName, source) || new this.vfxClasses[vfxName](source);
    }
}
const vfxManager = new VfxManager();