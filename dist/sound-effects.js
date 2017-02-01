"use strict";
/**
 * Created by monad on 1/30/17.
 */
var SoundEffects = (function () {
    function SoundEffects() {
    }
    SoundEffects.playSound = function (sound) {
        (new Audio(sound)).play();
    };
    return SoundEffects;
}());
SoundEffects.wrong = "assets/sounds/wrong.mp3";
SoundEffects.correct = "assets/sounds/correct.mp3";
exports.SoundEffects = SoundEffects;
