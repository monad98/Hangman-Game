"use strict";
var GameService = (function () {
    function GameService() {
    }
    GameService.prototype.checkResult = function (state) {
        var gameOverOrUserWon = false;
        var didWin;
        var winRecord = state.winRecord;
        var loseRecord = state.loseRecord;
        // 1. check remaining life and if remaining life is 0, user lose
        if (state.remainingGuess === 0) {
            gameOverOrUserWon = true;
            loseRecord += 1;
            didWin = false;
        }
        // 2. check if user got answer and if so, user win.
        if (state.currentGuessedWord.join("") === state.selectedCountry.countryName) {
            gameOverOrUserWon = true;
            didWin = true;
            winRecord += 1;
        }
        return { gameOverOrUserWon: gameOverOrUserWon, didWin: didWin, loseRecord: loseRecord, winRecord: winRecord };
    };
    GameService.prototype.updateCurrentGuessedWord = function (state) {
        //check input letter is same as each letter in country
        var isThereMatchedLetter = false;
        var updatedCurrentGuessedWord = state.currentGuessedWord.slice();
        state.selectedCountry.countryName
            .split("") //to array
            .forEach(function (c, index) {
            if (c.toUpperCase() === state.lastInputUpperCase) {
                updatedCurrentGuessedWord[index] = c;
                isThereMatchedLetter = true;
            }
        });
        console.log("CurrentGuessedWord is " + updatedCurrentGuessedWord);
        return {
            didMatched: isThereMatchedLetter,
            currentGuessedWord: updatedCurrentGuessedWord,
        };
    };
    return GameService;
}());
exports.GameService = GameService;
