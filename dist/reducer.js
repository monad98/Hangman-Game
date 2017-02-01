/**
 * Created by monad on 1/30/17.
 */
"use strict";
exports.NEW_GAME = "NEW_GAME";
exports.SELECTING_COUNTRY_COMPLETE = "SELECTING_COUNTRY_COMPLETE";
exports.LOAD_COUNTRY_PHOTO_ARRY = "LOAD_COUNTRY_PHOTO_ARRY";
exports.FETCH_NEW_COUNTRY_PHOTO = "FETCH_NEW_COUNTRY_PHOTO";
exports.LOAD_COUNTRY_PHOTO = "LOAD_COUNTRY_PHOTO";
exports.LOAD_REFRESH_CIRCLE = "LOAD_REFRESH_CIRCLE";
exports.PUSH_TO_LETTER_GUESSED = "PUSH_TO_LETTER_GUESSED";
exports.UPDATE_CURRENT_GUESSED_WORD = "UPDATE_CURRENT_GUESSED_WORD";
exports.GAME_ENDED = "GAME_ENDED";
exports.GAME_IN_PROGRESS = "GAME_IN_PROGRESS";
exports.SHOW_HINT = "SHOW_HINT";
exports.initialState = {
    selectedCountryPhotoArray: [],
    selectedCountry: null,
    currentPhotoUrl: "",
    letterGuessed: [],
    remainingGuess: 6,
    lastInputUpperCase: "",
    currentGuessedWord: [],
    gameOverOrUserWon: false,
    winRecord: 0,
    loseRecord: 0
};
exports.reducer = function (state, action) {
    switch (action.type) {
        case exports.NEW_GAME: {
            return exports.initialState; //initialState
        }
        case exports.SELECTING_COUNTRY_COMPLETE: {
            var selectedCountry = (action.payload);
            var currentGuessedWord = selectedCountry.countryName.replace(/[a-zA-Z]/g, "_").split(""); //Hide letter except alphabetical character.
            return Object.assign({}, state, { selectedCountry: selectedCountry, currentGuessedWord: currentGuessedWord });
        }
        case exports.LOAD_COUNTRY_PHOTO_ARRY: {
            var selectedCountryPhotoArray = action.payload;
            return Object.assign({}, state, { selectedCountryPhotoArray: selectedCountryPhotoArray });
        }
        case exports.LOAD_COUNTRY_PHOTO: {
            var currentPhotoUrl = action.payload;
            return Object.assign({}, state, { currentPhotoUrl: currentPhotoUrl });
        }
        case exports.PUSH_TO_LETTER_GUESSED: {
            var lastInputUpperCase = action.payload;
            state.letterGuessed.push(lastInputUpperCase);
            var letterGuessed = state.letterGuessed.sort();
            return Object.assign({}, state, { letterGuessed: letterGuessed, lastInputUpperCase: lastInputUpperCase });
        }
        case exports.UPDATE_CURRENT_GUESSED_WORD: {
            var currentGuessedWord = action.payload.currentGuessedWord;
            var didMatched = action.payload.didMatched;
            var remainingGuess = didMatched ? state.remainingGuess : state.remainingGuess - 1;
            return Object.assign({}, state, { currentGuessedWord: currentGuessedWord, remainingGuess: remainingGuess });
        }
        case exports.GAME_ENDED: {
            var gameOverOrUserWon = action.payload.gameOverOrUserWon;
            var loseRecord = action.payload.loseRecord;
            var winRecord = action.payload.winRecord;
            return Object.assign({}, state, { gameOverOrUserWon: gameOverOrUserWon, loseRecord: loseRecord, winRecord: winRecord });
        }
        default: {
            return state;
        }
    }
};
