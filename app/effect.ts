/**
 * Created by monad on 1/31/17.
 */
import {Store, Action} from "redux";
import {
  State, SELECTING_COUNTRY_COMPLETE, LOAD_COUNTRY_PHOTO_ARRY, LOAD_COUNTRY_PHOTO, PUSH_TO_LETTER_GUESSED, UPDATE_CURRENT_GUESSED_WORD, GAME_ENDED,
  GAME_IN_PROGRESS, NEW_GAME, FETCH_NEW_COUNTRY_PHOTO, SHOW_HINT
} from "./reducer";
import {ActionsObservable} from "redux-observable";
import {Observable} from "rxjs/Observable";
import {Flickr} from "./flickr";
import {Util} from "./util";
import {countries} from "./countries";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/merge";
import {SoundEffects} from "./sound-effects";
import {viewRenderService, gameService} from "./app";


export const newGame =  (action$: ActionsObservable<Action>, store: Store<State>) =>
  action$.ofType(NEW_GAME)
    .do(()=> viewRenderService.initializeView())
    .map(() => countries[Util.randomIndex(countries.length)]) //selecting country randomly...
    .do(country => console.log("SelectedCountry is " + country.countryName))
    .map(country => ({type: SELECTING_COUNTRY_COMPLETE, payload: country }));

export const getPhotoArray =  (action$: ActionsObservable<Action>, store: Store<State>) =>
  action$.ofType(SELECTING_COUNTRY_COMPLETE)
    .map(action => action.payload.countryName)
    .switchMap(countryName => // get photoArray
      Observable.fromPromise(Flickr.getCountryPhotos(countryName))
        .map(photoArray => ({type: LOAD_COUNTRY_PHOTO_ARRY, payload: photoArray}))
    );

export const getPhotoUrl =  (action$: ActionsObservable<Action>, store: Store<State>) =>
  action$.ofType(LOAD_COUNTRY_PHOTO_ARRY)
    .do(() => viewRenderService.viewUpdateAfterSelectingCountry(store.getState())) //view update
    .do(() => viewRenderService.loadRefreshCircle()) //view update
    .map(action => action.payload)
    .map(photoArray => photoArray[Util.randomIndex(photoArray.length)].id) //select random photo
    .switchMap(photoId =>
      Observable.fromPromise(Flickr.getPhotoInfo(photoId))
        .do((photoUrl: string) => viewRenderService.loadPhoto(photoUrl))
        .map(photoUrl => ({type: LOAD_COUNTRY_PHOTO, payload: photoUrl}))
    );

export const loadAnotherPhoto =  (action$: ActionsObservable<Action>, store: Store<State>) =>
  action$.ofType(FETCH_NEW_COUNTRY_PHOTO)
    .do(() => viewRenderService.loadRefreshCircle()) //view update
    .map(() => store.getState())
    .map(state => state.selectedCountryPhotoArray)
    .map(photoArray => photoArray[Util.randomIndex(photoArray.length)].id) //select random photo
    .switchMap(photoId =>
      Observable.fromPromise(Flickr.getPhotoInfo(photoId))
        .do((photoUrl: string) => viewRenderService.loadPhoto(photoUrl))
        .map(photoUrl => ({type: LOAD_COUNTRY_PHOTO, payload: photoUrl}))
    );

export const checkInputLetter = (action$: ActionsObservable<Action>, store: Store<State>) => {
  return action$.ofType(PUSH_TO_LETTER_GUESSED)
    .map(action => action.payload)
    .map(validUpperCaseLetter => gameService.updateCurrentGuessedWord(store.getState())) //check if this letter is part of the selected country
    .do(result => {
      store.dispatch({type: UPDATE_CURRENT_GUESSED_WORD, payload: result});

      //sound effect
      if (result.didMatched) SoundEffects.playSound(SoundEffects.correct);
      else SoundEffects.playSound(SoundEffects.wrong);

    })
    .map(() => store.getState())
    .do(state => viewRenderService.viewUpdateAfterUserInput(state)) //update view
    .map(state => gameService.checkResult(state))
    .do(result => { //view update
      if(result.gameOverOrUserWon) {
        if(result.didWin) viewRenderService.viewUpdateForUserWonMessage(result.winRecord);
        else viewRenderService.viewUpdateForUserLostMessage(result.winRecord);
      }
    })
    .map(result => {
      if(result.gameOverOrUserWon) return {type: GAME_ENDED, payload: result};
      else return {type: GAME_IN_PROGRESS}
    });
};

export const showHint = (action$: ActionsObservable<Action>, store: Store<State>) =>
  action$.ofType(SHOW_HINT)
    .map(() => store.getState().selectedCountry)
    .map(country => viewRenderService.showCountryInfo(country))
    .map(() => ({type:GAME_IN_PROGRESS}));