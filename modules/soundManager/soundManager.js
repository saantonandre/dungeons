export { soundManager };
class SoundManager {
    constructor() {
        this.playbackRate = 1;
        this.volume = 1;
        this.sounds = {};
        this.soundsBaseUrl = './../../assets/soundFxs/';
    }
    /** takes an argument the sound file name (without extension) from the relative path in soundsBaseUrl */
    createSound = (relativeUrl) => {
        let fullUrl = `${this.soundsBaseUrl}${relativeUrl}.mp3`;
        let splittedUrl = relativeUrl.split('/');
        /** Extrapolates the name from the url */
        let name = splittedUrl[splittedUrl.length - 1];
        this.sounds[name] = new CustomAudio(fullUrl);
    }
}
class CustomAudio {
    constructor(url, loop = false, volume = 1, playbackRate = 1) {
        this.audio = new Audio(url);
        this.loop = loop;
        this.volume = volume;
        this.playbackRate = playbackRate;
    }
    play = (customPlaybackRate = 1) => {
        /** Sets the audio speed */
        this.audio.playbackRate = this.playbackRate * customPlaybackRate;
        /** Sets the audio volume */
        this.audio.volume = this.volume;

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
soundManager.createSound('sword-attack');
soundManager.createSound('sword-hit');
soundManager.createSound('crystal');