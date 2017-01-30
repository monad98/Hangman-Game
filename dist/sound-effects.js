"use strict";
/**
 * Created by monad on 1/30/17.
 */
var SoundEffects = (function () {
    function SoundEffects() {
        this.wrong = "assets/sounds/wrong.mp3";
        this.correct = "assets/sounds/correct.mp3";
    }
    SoundEffects.playSound = function (sound) {
        (new Audio(sound)).play();
    };
    return SoundEffects;
}());
exports.SoundEffects = SoundEffects;
