"use strict";
var util_1 = require("./util");
var GameView = (function () {
    function GameView() {
        //DOM element
        this.containerElem = document.querySelector(".container");
        this.hangmanPhotoElem = document.querySelector("#hangmanPhoto");
        this.countryPhotoElem = document.querySelector("#countryPhoto");
        this.congratMsgBoxElem = document.querySelector("#congratulation");
        this.gameOverMsgBoxElem = document.querySelector("#gameover");
        this.hintBoxElem = document.querySelector("#hint");
        this.currentGuessedWordElem = document.querySelector("#currentGuessedWord");
        this.remainingGuessElem = document.querySelector("#remainingGuess");
        this.letterGuessedBoxElem = document.querySelector("#letterGuessed");
        this.audioPlayerElem = document.querySelector("#audioPlayer");
        this.cursorElem = document.querySelector("#cursor");
        this.loadingElem = document.querySelector("#loading");
        this.capitalElem = document.querySelector("#capital");
        this.continentElem = document.querySelector("#continent");
        this.populationElem = document.querySelector("#population");
        this.winRecordElem = document.querySelector("#winRecord");
        this.loseRecordElem = document.querySelector("#loseRecord");
        this.refreshBtnElem = document.querySelector("#refreshBtn");
    }
    GameView.prototype.initializeView = function () {
        this.hangmanPhotoElem.src = "assets/images/d-6.jpg";
        this.congratMsgBoxElem.style.display = "none";
        this.gameOverMsgBoxElem.style.display = "none";
        this.hintBoxElem.style.display = "none";
        this.remainingGuessElem.innerHTML = "6";
        this.containerElem.style.opacity = "0.2";
        this.letterGuessedBoxElem.innerHTML = "_";
        this.audioPlayerElem.volume = 0.3;
    };
    GameView.prototype.viewUpdateAfterUserInput = function (letter /* uppercase */, gameLogic) {
        var _this = this;
        this.cursorElem.innerHTML = letter;
        this.cursorElem.className = "";
        setTimeout(function () {
            _this.cursorElem.innerHTML = "_";
            _this.cursorElem.className = "blink"; //activate cursor animation again after 1s.
        }, 1000);
        this.remainingGuessElem.innerHTML = gameLogic.remainingGuess.toString();
        this.hangmanPhotoElem.src = "assets/images/d-" + gameLogic.remainingGuess + ".jpg";
        this.currentGuessedWordElem.innerHTML = "<span>" + util_1.Util.convertEmptySpaceToNbsp(gameLogic.currentGuessedWord, letter).join("</span><span>") + "</span>";
        this.letterGuessedBoxElem.innerHTML = "<span>" + gameLogic.letterGuessed.join("</span><span>") + "</span>";
    };
    GameView.prototype.viewUpdateAfterSelectingCountry = function (gameLogic) {
        this.currentGuessedWordElem.innerHTML = "<span>" + util_1.Util.convertEmptySpaceToNbsp(gameLogic.currentGuessedWord).join("</span><span>") + "</span>";
    };
    GameView.prototype.viewUpdateForUserWonMessage = function (gameLogic) {
        this.congratMsgBoxElem.style.display = "inline-block";
        this.containerElem.style.opacity = "0.2";
        this.winRecordElem.innerHTML = gameLogic.winRecord.toString();
    };
    GameView.prototype.viewUpdateForUserLostMessage = function (gameLogic) {
        this.gameOverMsgBoxElem.style.display = "inline-block";
        this.containerElem.style.opacity = "0.2";
        this.loseRecordElem.innerHTML = gameLogic.loseRecord.toString();
    };
    GameView.prototype.loadPhoto = function (photoUrl) {
        this.countryPhotoElem.src = photoUrl;
        var self = this;
        setTimeout(function () {
            self.stopRefreshCircle();
        }, 1000);
    };
    GameView.prototype.loadRefreshCircle = function () {
        this.refreshBtnElem.style.display = "none";
        this.hintBoxElem.style.display = "none";
        this.countryPhotoElem.style.opacity = "0";
        this.loadingElem.style.display = "block";
    };
    GameView.prototype.stopRefreshCircle = function () {
        //This function is called after we finish loading new country image
        //and stop showing refresh circle gif image.
        this.countryPhotoElem.style.opacity = "1";
        this.loadingElem.style.display = "none";
        this.refreshBtnElem.style.display = ""; //to default display value
        this.containerElem.style.opacity = "1"; // we need this when new game's first image loaded.
    };
    GameView.prototype.alreadyGuessedLetterEffect = function (letter, letterGuessed) {
        var _this = this;
        // if same letter typed again, blink effect on that letter for 2.5s;
        var blinkLetterGuessed = letterGuessed.map(function (c) {
            if (c === letter) {
                return '<span class="blink">' + c + "</span>";
            }
            else
                return "<span>" + c + "</span>";
        });
        this.letterGuessedBoxElem.innerHTML = blinkLetterGuessed.join("");
        setTimeout(function () {
            _this.letterGuessedBoxElem.innerHTML = "<span>" + letterGuessed.join("</span><span>") + "</span>";
        }, 2500);
    };
    GameView.prototype.showCountryInfo = function (selectedCountry) {
        this.hintBoxElem.style.display = "block";
        this.capitalElem.innerHTML = selectedCountry.capital;
        this.continentElem.innerHTML = selectedCountry.continentName;
        this.populationElem.innerHTML = selectedCountry.population;
    };
    return GameView;
}());
exports.GameView = GameView;
