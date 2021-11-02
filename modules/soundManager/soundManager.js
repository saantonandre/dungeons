export { soundManager };
class SoundManager {
    constructor() {
        this.playbackRate = 1;
        this.volume = 1;
        this.sounds = {};
        this.soundsBaseUrl = './../../assets/soundFxs/';
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
    }
    play = (customVolume = 1, customPlaybackRate = 1) => {
        /** Sets the audio volume */
        this.audio.volume = this.volume * customVolume;
        /** Sets the audio speed */
        this.audio.playbackRate = this.playbackRate * customPlaybackRate;

        if (this.audio.paused) {
            /** If the audio is paused, just play it */
            if (!this.audio.loop) {
                /** If it isn't a loop reset the time */
                this.audio.currentTime = 0;
            }
            /** Call the play promise */
            let promise = this.audio.play();
            if (promise !== undefined) {
                /** Catches eventual errors */
                promise.catch(function(e) {
                    /** Error response */
                });
            }
        } else {
            /** If the audio is already running */
            if (this.audio.loop) {
                /** If it is a loop, do nothing */
                return;
            }
            /** Pauses the audio, resets the time and call the play promise */
            this.audio.pause();
            this.audio.currentTime = 0;
            let promise = this.audio.play();
            if (promise !== undefined) {
                promise.catch(function(e) {
                    /** Error response */
                });
            }
        }
    }
}
const soundManager = new SoundManager();
/** Player sounds */
soundManager.createSound('sword-attack', false, 0.5);
soundManager.createSound('sword-hit', false, 0.5);
soundManager.createSound('pick-up', false, 0.4, 1.5);
soundManager.createSound('earthquake', false, 0.4);
soundManager.createSound('damaged', false, 1);

/** UI sfx */
soundManager.createSound('ui/click-1', false, 0.1);
soundManager.createSound('ui/click-2', false, 0.2);
soundManager.createSound('ui/click-3', false, 0.4);
soundManager.createSound('ui/paper', false, 0.2);