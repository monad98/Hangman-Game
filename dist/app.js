"use strict";
/**
 * Created by monad on 1/30/17.
 */
var redux_1 = require("redux");
var redux_observable_1 = require("redux-observable");
var reducer_1 = require("./reducer");
var effect_1 = require("./effect");
var game_view_1 = require("./game-view");
var game_service_1 = require("./game-service");
var game_1 = require("./game");
var createLogger = require("redux-logger");
// const rootReducer = combineReducers({ reducer });
var rootEpic = redux_observable_1.combineEpics(effect_1.newGame, effect_1.getPhotoArray, effect_1.getPhotoUrl, effect_1.loadAnotherPhoto, effect_1.checkInputLetter, effect_1.showHint);
var epicMiddleware = redux_observable_1.createEpicMiddleware(rootEpic);
var logger = createLogger();
exports.store = redux_1.createStore(reducer_1.reducer, reducer_1.initialState, redux_1.applyMiddleware(epicMiddleware, logger));
exports.viewRenderService = new game_view_1.ViewRenderService();
exports.gameService = new game_service_1.GameService();
new game_1.Hangman(exports.store);
