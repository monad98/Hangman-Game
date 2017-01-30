"use strict";
var rxjs_1 = require("rxjs");
var game_1 = require("./game");
var game_logic_1 = require("./game-logic");
var game_view_1 = require("./game-view");
var flickr_1 = require("./flickr");
var sound_effects_1 = require("./sound-effects");
var soundEffects = new sound_effects_1.SoundEffects();
var flickr = new flickr_1.Flickr();
var gameView = new game_view_1.GameView();
var gameLogic = new game_logic_1.GameLogic(gameView, soundEffects);
var hangman = new game_1.Hangman(gameLogic, gameView, flickr);
var hangman = (function () {
    function hangman() {
    }
    return hangman;
}());
newGame();
rxjs_1.Observable.fromEvent(document.querySelector("#refreshBtn"), "click")
    .subscribe(function (ev) { return console.log("!!@#!@#!@#"); });
// document.body.addEventListener("keyup", hangman.onUserInput.bind(hangman));
// (<HTMLButtonElement>document.getElementById("newGameBtn-c")).addEventListener("click", hangman.newGame.bind(hangman));
// (<HTMLButtonElement>document.getElementById("newGameBtn-g")).addEventListener("click", hangman.newGame.bind(hangman));
// (<HTMLButtonElement>document.getElementById("refreshBtn")).addEventListener("click", hangman.getAnotherPhoto.bind(hangman));
// (<HTMLButtonElement>document.getElementById("hintBtn")).addEventListener("click", hangman.showHint.bind(hangman));
