"use strict";
var reducer_1 = require("./reducer");
var Observable_1 = require("rxjs/Observable");
var flickr_1 = require("./flickr");
var util_1 = require("./util");
var countries_1 = require("./countries");
require("rxjs/add/operator/map");
require("rxjs/add/operator/do");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/fromPromise");
require("rxjs/add/observable/merge");
var sound_effects_1 = require("./sound-effects");
var app_1 = require("./app");
exports.newGame = function (action$, store) {
    return action$.ofType(reducer_1.NEW_GAME)
        .do(function () { return app_1.viewRenderService.initializeView(); })
        .map(function () { return countries_1.countries[util_1.Util.randomIndex(countries_1.countries.length)]; }) //selecting country randomly...
        .do(function (country) { return console.log("SelectedCountry is " + country.countryName); })
        .map(function (country) { return ({ type: reducer_1.SELECTING_COUNTRY_COMPLETE, payload: country }); });
};
exports.getPhotoArray = function (action$, store) {
    return action$.ofType(reducer_1.SELECTING_COUNTRY_COMPLETE)
        .map(function (action) { return action.payload.countryName; })
        .switchMap(function (countryName) {
        return Observable_1.Observable.fromPromise(flickr_1.Flickr.getCountryPhotos(countryName))
            .map(function (photoArray) { return ({ type: reducer_1.LOAD_COUNTRY_PHOTO_ARRY, payload: photoArray }); });
    });
};
exports.getPhotoUrl = function (action$, store) {
    return action$.ofType(reducer_1.LOAD_COUNTRY_PHOTO_ARRY)
        .do(function () { return app_1.viewRenderService.viewUpdateAfterSelectingCountry(store.getState()); }) //view update
        .do(function () { return app_1.viewRenderService.loadRefreshCircle(); }) //view update
        .map(function (action) { return action.payload; })
        .map(function (photoArray) { return photoArray[util_1.Util.randomIndex(photoArray.length)].id; }) //select random photo
        .switchMap(function (photoId) {
        return Observable_1.Observable.fromPromise(flickr_1.Flickr.getPhotoInfo(photoId))
            .do(function (photoUrl) { return app_1.viewRenderService.loadPhoto(photoUrl); })
            .map(function (photoUrl) { return ({ type: reducer_1.LOAD_COUNTRY_PHOTO, payload: photoUrl }); });
    });
};
exports.loadAnotherPhoto = function (action$, store) {
    return action$.ofType(reducer_1.FETCH_NEW_COUNTRY_PHOTO)
        .do(function () { return app_1.viewRenderService.loadRefreshCircle(); }) //view update
        .map(function () { return store.getState(); })
        .map(function (state) { return state.selectedCountryPhotoArray; })
        .map(function (photoArray) { return photoArray[util_1.Util.randomIndex(photoArray.length)].id; }) //select random photo
        .switchMap(function (photoId) {
        return Observable_1.Observable.fromPromise(flickr_1.Flickr.getPhotoInfo(photoId))
            .do(function (photoUrl) { return app_1.viewRenderService.loadPhoto(photoUrl); })
            .map(function (photoUrl) { return ({ type: reducer_1.LOAD_COUNTRY_PHOTO, payload: photoUrl }); });
    });
};
exports.checkInputLetter = function (action$, store) {
    return action$.ofType(reducer_1.PUSH_TO_LETTER_GUESSED)
        .map(function (action) { return action.payload; })
        .map(function (validUpperCaseLetter) { return app_1.gameService.updateCurrentGuessedWord(store.getState()); }) //check if this letter is part of the selected country
        .do(function (result) {
        store.dispatch({ type: reducer_1.UPDATE_CURRENT_GUESSED_WORD, payload: result });
        //sound effect
        if (result.didMatched)
            sound_effects_1.SoundEffects.playSound(sound_effects_1.SoundEffects.correct);
        else
            sound_effects_1.SoundEffects.playSound(sound_effects_1.SoundEffects.wrong);
    })
        .map(function () { return store.getState(); })
        .do(function (state) { return app_1.viewRenderService.viewUpdateAfterUserInput(state); }) //update view
        .map(function (state) { return app_1.gameService.checkResult(state); })
        .do(function (result) {
        if (result.gameOverOrUserWon) {
            if (result.didWin)
                app_1.viewRenderService.viewUpdateForUserWonMessage(result.winRecord);
            else
                app_1.viewRenderService.viewUpdateForUserLostMessage(result.winRecord);
        }
    })
        .map(function (result) {
        if (result.gameOverOrUserWon)
            return { type: reducer_1.GAME_ENDED, payload: result };
        else
            return { type: reducer_1.GAME_IN_PROGRESS };
    });
};
exports.showHint = function (action$, store) {
    return action$.ofType(reducer_1.SHOW_HINT)
        .map(function () { return store.getState().selectedCountry; })
        .map(function (country) { return app_1.viewRenderService.showCountryInfo(country); })
        .map(function () { return ({ type: reducer_1.GAME_IN_PROGRESS }); });
};
