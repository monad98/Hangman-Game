"use strict";
/**
 * Created by monad on 1/30/17.
 */
var countries_1 = require("./countries");
var util_1 = require("./util");
var sound_effects_1 = require("./sound-effects");
var GameLogic = (function () {
    function GameLogic(gameView, soundEffects) {
        this.gameView = gameView;
        this.soundEffects = soundEffects;
        this.selectedCountryPhotoArray = [];
        this.selectedCountry = {};
        this.letterGuessed = [];
        this.remainingGuess = 6;
        this.currentGuessedWord = [];
        this.gameOverOrUserWon = false;
        this.winRecord = 0;
        this.loseRecord = 0;
    }
    GameLogic.prototype.initializeVariable = function () {
        /* initialize game variable after pressing new game button */
        this.selectedCountryPhotoArray = [];
        this.selectedCountry = {};
        this.letterGuessed = [];
        this.remainingGuess = 6;
        this.currentGuessedWord = [];
        this.gameOverOrUserWon = false;
    };
    GameLogic.prototype.selectCountry = function () {
        // select a random country and make a same length hidden word to show to user
        this.selectedCountry = countries_1.countries[util_1.Util.randomIndex(countries_1.countries.length)]; //pick random country
        this.currentGuessedWord = this.selectedCountry.countryName.replace(/[a-zA-Z]/g, "_").split(""); //Hide letter except alphabetical character.
        console.log("SelectedCountry is " + this.selectedCountry.countryName);
    };
    GameLogic.prototype.checkResult = function () {
        // 1. check remaining life and if remaining life is 0, user lose
        if (this.remainingGuess === 0) {
            this.gameOverOrUserWon = true;
            this.loseRecord += 1;
            return this.gameView.viewUpdateForUserLostMessage(this); //user lost the game
        }
        // 2. check if user got answer and if so, user win.
        if (this.currentGuessedWord.join("") === this.selectedCountry.countryName) {
            this.gameOverOrUserWon = true;
            this.winRecord += 1;
            return this.gameView.viewUpdateForUserWonMessage(this); //user won the game
        }
        // 3. Game continues
        // do nothing
    };
    GameLogic.prototype.checkInputLetter = function (letter) {
        //check input letter is same as each letter in country
        var isThereMatchedLetter = false;
        var self = this;
        this.selectedCountry.countryName
            .split("") //to array
            .forEach(function (c, index) {
            if (c.toUpperCase() === letter) {
                self.currentGuessedWord[index] = c;
                isThereMatchedLetter = true;
            }
        });
        if (!isThereMatchedLetter) {
            self.remainingGuess -= 1;
            sound_effects_1.SoundEffects.playSound(this.soundEffects.wrong);
        }
        else {
            sound_effects_1.SoundEffects.playSound(this.soundEffects.correct); // input letter is correct
        }
        console.log("CurrentGuessedWord is " + this.currentGuessedWord);
    };
    GameLogic.prototype.pushToLetterGuessed = function (letter) {
        // This function is called after checking validity of user input.
        // Add input letter to letterGuessed array.
        this.letterGuessed.push(letter);
        this.letterGuessed.sort();
        // console.log("Current letterGuessed is " + letterGuessed);
    };
    GameLogic.prototype.isValidInput = function (ev) {
        var letter = ev.key;
        if (letter.length > 1)
            return false; // "Shift", "Tab" .....
        var charCode = letter.charCodeAt(0);
        // Check charCode here to prevent another language input
        if (charCode > 122 || charCode < 65 || (charCode > 90 && charCode < 97))
            return false; // A: 65, Z:90, a: 97, z: 122
        else if (this.letterGuessed.indexOf(letter.toUpperCase()) > -1) {
            this.gameView.alreadyGuessedLetterEffect(letter.toUpperCase(), this.letterGuessed); // blink effect
            return false;
        }
        else
            return true; // user input a letter which has not been typed before, so VALID input
    };
    return GameLogic;
}());
exports.GameLogic = GameLogic;
