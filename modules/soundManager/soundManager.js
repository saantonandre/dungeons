export { soundManager };
class SoundManager {
    constructor() {
        this.playbackRate = 1;
        this.volume = 1;
        this.sounds = {
            playRandom: (soundsArray) => {
                this.sounds[soundsArray[(Math.random() * soundsArray.length | 0)]].play()
            }
        };
        this.soundsBaseUrl = 'assets/soundFxs/';
    }
    /** takes an argument the sound file name (without extension) from the relative path in soundsBaseUrl */
    createSound = (relativeUrl, loop = false, volume = 1, playbackRate = 1) => {
        let fullUrl = `${this.soundsBaseUrl}${relativeUrl}.mp3`;
        let splittedUrl = relativeUrl.split('/');
        /** Extrapolates the name from the url */
        let name = splittedUrl[splittedUrl.length - 1];
        this.sounds[name] = new CustomAudio(fullUrl, loop, volume, playbackRate);
    }
}
class CustomAudio {
    constructor(url, loop = false, volume = 1, playbackRate = 1) {
        this.audio = new Audio(url);
        this.loop = loop;
        this.volume = volume;
        this.playbackRate = playbackRate;
        this.calledPlayPromise = false;
    }
    play = (customVolume = 1, customPlaybackRate = 1) => {
        if (this.calledPlayPromise) {
            /** A play promise has been already called, do nothing */
            return false;
        }
        /** Sets the audio volume */
        this.audio.volume = this.volume * customVolume;
        /** Sets the audio volume */
        this.audio.loop = this.loop;
        /** Sets the audio speed */
        this.audio.playbackRate = this.playbackRate * customPlaybackRate;

        if (this.audio.paused) {
            /** If the audio is paused, just play it */
            if (!this.audio.loop) {
                /** If it isn't a loop reset the time */
                this.audio.currentTime = 0;
            }
        } else {
            /** If the audio is already running */
            if (this.audio.loop) {
                /** If it is a loop, do nothing */
                return;
            }
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        /** Call the play promise */
        let promise = this.audio.play();
        this.calledPlayPromise = true;
        if (promise !== undefined) {
            promise.catch(function(e) {
                /** Error response */
                console.warn("there was an audio error!", e)
            }).then(() => {
                this.calledPlayPromise = false;
            })
        }
    }
}
const soundManager = new SoundManager();
/** Player sounds */
soundManager.createSound('sword-attack');
soundManager.createSound('sword-hit');
soundManager.createSound('pick-up');
soundManager.createSound('damaged');

/** UI sfx */
soundManager.createSound('ui/click-1', false, 0.4);
soundManager.createSound('ui/click-2', false, 0.4);
soundManager.createSound('ui/click-3', false, 0.4);
soundManager.createSound('ui/paper', false, 0.8);


/** Environmental */
soundManager.createSound('sliding', false, 1, 2);
soundManager.createSound('sliding-reversed', false, 1, 2);
soundManager.createSound('earthquake');

soundManager.createSound('bounce1');
soundManager.createSound('bounce2');
soundManager.createSound('bounce3');
soundManager.createSound('bounce4');