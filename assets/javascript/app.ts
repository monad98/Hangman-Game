/**
 * Created by monad on 1/30/17.
 */
import {applyMiddleware, createStore, combineReducers, Action, Store} from "redux";
import {createEpicMiddleware, combineEpics, Epic} from "redux-observable";
import {reducer, State, initialState} from "./reducer";
import {newGame, getPhotoArray, getPhotoUrl, checkInputLetter, loadAnotherPhoto, showHint} from "./effect";
import {ViewRenderService} from "./game-view";
import {GameService} from "./game-service";
import {Hangman} from "./game";
import * as createLogger from "redux-logger";

// const rootReducer = combineReducers({ reducer });
const rootEpic: Epic<Action, State> = combineEpics(newGame, getPhotoArray, getPhotoUrl, loadAnotherPhoto, checkInputLetter, showHint);

const epicMiddleware = createEpicMiddleware(rootEpic);
const logger = createLogger();
export const store = createStore(reducer, initialState, applyMiddleware(epicMiddleware, logger));

export const viewRenderService = new ViewRenderService();
export const gameService = new GameService();

new Hangman(store);
