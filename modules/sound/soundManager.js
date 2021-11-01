class Sounds {
    constructor() {
        this.playbackRate = 1;
        this.volume = 1;

        Audio.prototype.baseVolume = 1;
        Audio.prototype.playy = function() {
            let aud = this;
            aud.playbackRate = this.playbackRate;
            aud.volume = aud.baseVolume * GLOBAL.volume;
            if (aud.paused) {
                if (!aud.loop) {
                    aud.currentTime = 0;
                }
                let promise = aud.play();
                if (promise !== undefined) {
                    promise.catch(function(e) {});
                }
            } else {
                if (aud.loop) {
                    return;
                }
                aud.pause();
                aud.currentTime = 0;
                let promise = aud.play();
                if (promise !== undefined) {
                    promise.catch(function(e) {});
                }
            }
        };

        this.hit = new Audio("sounds/hit.mp3")
        this.gotHit = new Audio("sounds/got-hit.mp3");

    }
}