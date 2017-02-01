"use strict";
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/observable/merge");
require("rxjs/add/observable/of");
require("rxjs/add/operator/map");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/withLatestFrom");
require("rxjs/add/operator/do");
require("rxjs/add/operator/share");
var reducer_1 = require("./reducer");
/**
 * Hangman Game Object
 */
var Hangman = (function () {
    function Hangman(store) {
        var _this = this;
        this.store = store;
        //Button elements
        this.refreshBtnElem = document.querySelector("#refreshBtn");
        this.newGameBtnWin = document.querySelector("#newGameBtn-c");
        this.newGameBtnLose = document.querySelector("#newGameBtn-g");
        this.hintBtn = document.querySelector("#hintBtn");
        var refreshClick$ = Observable_1.Observable.fromEvent(this.refreshBtnElem, "click");
        var newGameClickAfterWin$ = Observable_1.Observable.fromEvent(this.newGameBtnWin, "click");
        var newGameClickAfterLost$ = Observable_1.Observable.fromEvent(this.newGameBtnLose, "click");
        var newGameClick$ = Observable_1.Observable.merge(newGameClickAfterWin$, newGameClickAfterLost$);
        var hintClick$ = Observable_1.Observable.fromEvent(this.hintBtn, "click");
        var keyup$ = Observable_1.Observable.fromEvent(document.body, 'keyup')
            .map(function (ev) { return ev.key; })
            .map(function (letter) {
            return !_this.store.getState().gameOverOrUserWon ? letter.toUpperCase() : null;
        })
            .share();
        var refreshPhotoKey$ = keyup$.filter(function (letter) { return letter === "1"; });
        var validKey$ = keyup$
            .filter(function (letter) { return /^[A-Z]$/i.test(letter); });
        var getAnotherPhoto$ = Observable_1.Observable.merge(refreshClick$, refreshPhotoKey$);
        validKey$.subscribe(function (validUpperCaseLetter) {
            _this.store.dispatch({ type: reducer_1.PUSH_TO_LETTER_GUESSED, payload: validUpperCaseLetter });
        });
        newGameClick$.subscribe(function () {
            _this.store.dispatch({ type: reducer_1.NEW_GAME });
        });
        getAnotherPhoto$.subscribe(function () {
            _this.store.dispatch({ type: reducer_1.FETCH_NEW_COUNTRY_PHOTO });
        });
        hintClick$.subscribe(function () {
            _this.store.dispatch({ type: reducer_1.SHOW_HINT });
        });
        this.store.dispatch({ type: reducer_1.NEW_GAME });
    }
    return Hangman;
}());
exports.Hangman = Hangman;
