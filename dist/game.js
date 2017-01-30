"use strict";
var util_1 = require("./util");
var game_logic_1 = require("./game-logic");
var game_view_1 = require("./game-view");
var flickr_1 = require("./flickr");
var sound_effects_1 = require("./sound-effects");
/**
 * Hangman Game Object
 */
var Hangman = (function () {
    function Hangman(gameLogic, gameView, flickr) {
        this.gameLogic = gameLogic;
        this.gameView = gameView;
        this.flickr = flickr;
    }
    Hangman.prototype.onUserInput = function (ev) {
        // method to process an input letter
        if (this.gameLogic.gameOverOrUserWon)
            return;
        var letter = ev.key;
        if (letter === "1")
            return this.getAnotherPhoto();
        if (!this.gameLogic.isValidInput(ev))
            return; // if not valid input, just ignore user input and finish function execution
        letter = letter.toUpperCase();
        this.gameLogic.pushToLetterGuessed(letter); // if valid input, next step => add this letter to letter guessed input
        this.gameLogic.checkInputLetter(letter); //check if this letter is part of the selected captial
        this.gameView.viewUpdateAfterUserInput(letter, this.gameLogic); //update the view
        this.gameLogic.checkResult();
    };
    Hangman.prototype.newGame = function () {
        var _this = this;
        // method for starting new game
        this.gameView.initializeView();
        if (this.gameLogic.selectCountry)
            this.gameLogic.initializeVariable(); // at first game, no need to initialize (already did it)
        this.gameView.loadRefreshCircle(); // refresh circle for picking a country and loading new photp
        this.gameLogic.selectCountry();
        this.gameView.viewUpdateAfterSelectingCountry(this.gameLogic);
        this.flickr.getCountryPhotos(this.gameLogic.selectedCountry.countryName, function (photoArray) {
            _this.gameLogic.selectedCountryPhotoArray = photoArray;
            _this.flickr.getPhotoInfo(_this.gameLogic.selectedCountryPhotoArray[util_1.Util.randomIndex(_this.gameLogic.selectedCountryPhotoArray.length)].id, _this.gameView.loadPhoto.bind(_this.gameView));
        });
    };
    Hangman.prototype.getAnotherPhoto = function () {
        // method for showing another photo;
        this.gameView.loadRefreshCircle();
        if (!this.gameLogic.selectedCountryPhotoArray.length)
            this.newGame();
        else {
            this.flickr.getPhotoInfo(this.gameLogic.selectedCountryPhotoArray[util_1.Util.randomIndex(this.gameLogic.selectedCountryPhotoArray.length)].id, this.gameView.loadPhoto.bind(this.gameView));
        }
    };
    Hangman.prototype.showHint = function () {
        this.gameView.showCountryInfo(this.gameLogic.selectedCountry);
    };
    return Hangman;
}());
exports.Hangman = Hangman;
var soundEffects = new sound_effects_1.SoundEffects();
var flickr = new flickr_1.Flickr();
var gameView = new game_view_1.GameView();
var gameLogic = new game_logic_1.GameLogic(gameView, soundEffects);
var hangman = new Hangman(gameLogic, gameView, flickr);
hangman.newGame();
document.body.addEventListener("keyup", hangman.onUserInput.bind(hangman));
document.getElementById("newGameBtn-c").addEventListener("click", hangman.newGame.bind(hangman));
document.getElementById("newGameBtn-g").addEventListener("click", hangman.newGame.bind(hangman));
document.getElementById("refreshBtn").addEventListener("click", hangman.getAnotherPhoto.bind(hangman));
document.getElementById("hintBtn").addEventListener("click", hangman.showHint.bind(hangman));
