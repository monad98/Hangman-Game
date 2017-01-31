/**
 * Created by monad on 1/30/17.
 */
import {applyMiddleware, createStore, combineReducers} from "redux";
import {createEpicMiddleware, combineEpics} from "redux-observable";
import {reducer} from "./reducer";

const rootReducer = combineReducers({ reducer });
const rootEpic = combineEpics(incrementIfOddEpic);

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

