import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';
import {Store} from "redux";
import {State, PUSH_TO_LETTER_GUESSED, NEW_GAME, FETCH_NEW_COUNTRY_PHOTO, SHOW_HINT} from "./reducer";


/**
 * Hangman Game Object
 */
export class Hangman {

  constructor(private store: Store<State>) {

    const refreshClick$ = Observable.fromEvent(this.refreshBtnElem, "click");
    const newGameClickAfterWin$ = Observable.fromEvent(this.newGameBtnWin, "click");
    const newGameClickAfterLost$ = Observable.fromEvent(this.newGameBtnLose, "click");
    const newGameClick$ = Observable.merge(newGameClickAfterWin$, newGameClickAfterLost$);
    const hintClick$ = Observable.fromEvent(this.hintBtn, "click");


    const keyup$ = Observable.fromEvent(document.body, 'keyup')
      .map((ev: KeyboardEvent) => ev.key)
      .map((letter: string) => {
        return !this.store.getState().gameOverOrUserWon ? letter.toUpperCase() : null;
      })
      .share();
    const refreshPhotoKey$ = keyup$.filter((letter: string) => letter === "1");
    const validKey$ = keyup$
      .filter((letter: string) => /^[A-Z]$/i.test(letter));
    const getAnotherPhoto$ = Observable.merge(refreshClick$, refreshPhotoKey$);


    validKey$.subscribe((validUpperCaseLetter) => {
      this.store.dispatch({type: PUSH_TO_LETTER_GUESSED, payload: validUpperCaseLetter});
    });

    newGameClick$.subscribe(() => {
      this.store.dispatch({type: NEW_GAME});
    });

    getAnotherPhoto$.subscribe(() => {
      this.store.dispatch({type: FETCH_NEW_COUNTRY_PHOTO})
    });

    hintClick$.subscribe(() => {
      this.store.dispatch({type: SHOW_HINT});
    });

    this.store.dispatch({type: NEW_GAME});

  }

  //Button elements
  refreshBtnElem = <HTMLElement>document.querySelector("#refreshBtn");
  newGameBtnWin = <HTMLButtonElement>document.querySelector("#newGameBtn-c");
  newGameBtnLose = <HTMLButtonElement>document.querySelector("#newGameBtn-g");
  hintBtn = <HTMLButtonElement>document.querySelector("#hintBtn");
}

