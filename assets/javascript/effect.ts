import {Store} from "redux";
import {State, SELECT_COUNTRY, GET_COUNTRY_PHOTO} from "./reducer";
import {ActionsObservable} from "redux-observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mapto";

/**
 * Created by monad on 1/31/17.
 */
export const selectCountry =  (action$: ActionsObservable<string>, store: Store<State>) =>
  action$.ofType(SELECT_COUNTRY)
    .map(action => action.payload)
    //selecting country...
    .mapTo({type: GET_COUNTRY_PHOTO, });


export const something =  (action$: ActionsObservable<string>, store: Store<State>) =>
  action$.ofType(SELECT_COUNTRY)
    .map(action => action.payload)
    //selecting country...
    .mapTo({type: GET_COUNTRY_PHOTO, });
