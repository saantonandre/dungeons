/** 
 *  Acts as intermediate between the manager and the entities,
 *  the entities have a reference to this class OBJECT 
 */
import * as Vfxs from "./vfxs.js"
class VfxManager {
    constructor() {
        /** Instead of being deleted, removed Vfxs gets moved here to be reused later, gets populated by the gameDirector */
        this.recyclePool = [];
        /** Contains vfx classes declarations */
        this.vfxClasses = Vfxs;
    }
    /** Returns a recycled vfx or FALSE */
    getRecycledVfx(vfxName, x, y) {
        for (let i = 0; i < this.recyclePool.length; i++) {
            if (this.recyclePool[i].name === vfxName) {
                this.recyclePool[i].reset(x, y);
                console.log("found!")
                return this.recyclePool.splice(i, 1)[0];
            }
        }
        //console.log("not found!", this.recyclePool)
        return false;
    }
    /** Returns a Vfx of the requested type, this function gets imported and called by entities */
    create = (vfxName, x, y) => {
        return this.getRecycledVfx(vfxName, x, y) || new this.vfxClasses[vfxName](x, y);
    }
}
export let vfxManager = new VfxManager();