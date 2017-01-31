import {Util} from "./util";
import {GameLogic} from "./game-logic";
import {GameView} from "./game-view";
import {Flickr} from "./flickr";
import {SoundEffects} from "./sound-effects";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/share';



/**
 * Hangman Game Object
 */
export class Hangman {

  constructor(private gameLogic: GameLogic, private gameView: GameView, private flickr: Flickr) {

    const refreshClick$ = Observable.fromEvent(this.refreshBtnElem, "click");
    const newGameClickAfterWin$ = Observable.fromEvent(this.newGameBtnWin, "click");
    const newGameClickAfterLost$ = Observable.fromEvent(this.newGameBtnLose, "click");
    const newGameClick$ = Observable.merge(newGameClickAfterWin$, newGameClickAfterLost$);
    const hintClick$ = Observable.fromEvent(this.hintBtn, "click");


    const keyup$ = Observable.fromEvent(document.body, 'keyup')
      .map((ev:KeyboardEvent) => ev.key)
      .withLatestFrom(this.gameLogic.gameOverOrUserWon$, (letter: string, gameOverOrUserWon: boolean) => {
        return !gameOverOrUserWon ? letter.toUpperCase() : null;
      })
      .share();
    const refreshPhotoKey$ = keyup$.filter((letter: string) => letter === "1");
    const validKey$ = keyup$
      .filter((letter: string) => /^[A-Z]$/i.test(letter));
    const getAnotherPhoto$ = Observable.merge(refreshClick$, refreshPhotoKey$);


    validKey$.subscribe((validUpperCaseLetter) => {
      this.gameLogic.pushToLetterGuessed(validUpperCaseLetter); // if valid input, next step => add this letter to letter guessed input
      this.gameLogic.checkInputLetter(validUpperCaseLetter); //check if this letter is part of the selected captial
      this.gameView.viewUpdateAfterUserInput(validUpperCaseLetter, this.gameLogic); //update the view
      this.gameLogic.checkResult();
    });
    newGameClick$.subscribe(this.newGame.bind(this));
    getAnotherPhoto$.subscribe(this.getAnotherPhoto.bind(this));
    hintClick$.subscribe(this.showHint.bind(this));

    this.newGame();

  }
  //Button elements
  refreshBtnElem = <HTMLElement>document.querySelector("#refreshBtn");
  newGameBtnWin = <HTMLButtonElement>document.querySelector("#newGameBtn-c");
  newGameBtnLose = <HTMLButtonElement>document.querySelector("#newGameBtn-g");
  hintBtn = <HTMLButtonElement>document.querySelector("#hintBtn");

  onUserInput (validUpperCase: string) {
    // method to process an input letter
    this.gameLogic.pushToLetterGuessed(validUpperCase); // if valid input, next step => add this letter to letter guessed input
    this.gameLogic.checkInputLetter(validUpperCase); //check if this letter is part of the selected captial
    this.gameView.viewUpdateAfterUserInput(validUpperCase, this.gameLogic); //update the view
    this.gameLogic.checkResult();
  }
  newGame () {
    // method for starting new game
    this.gameView.initializeView();
    if (this.gameLogic.selectCountry) this.gameLogic.initializeVariable(); // at first game, no need to initialize (already did it)
    this.gameView.loadRefreshCircle(); // refresh circle for picking a country and loading new photp
    this.gameLogic.selectCountry();
    this.gameView.viewUpdateAfterSelectingCountry(this.gameLogic);
    this.flickr.getCountryPhotos(this.gameLogic.selectedCountry.countryName, (photoArray: Array<any>) => {
      this.gameLogic.selectedCountryPhotoArray = photoArray;
      this.flickr.getPhotoInfo(this.gameLogic.selectedCountryPhotoArray[Util.randomIndex(this.gameLogic.selectedCountryPhotoArray.length)].id, this.gameView.loadPhoto.bind(this.gameView));
    });
  }
  getAnotherPhoto () {
    // method for showing another photo;
    this.gameView.loadRefreshCircle();
    if (!this.gameLogic.selectedCountryPhotoArray.length) this.newGame();
    else {
      this.flickr.getPhotoInfo(this.gameLogic.selectedCountryPhotoArray[Util.randomIndex(this.gameLogic.selectedCountryPhotoArray.length)].id, this.gameView.loadPhoto.bind(this.gameView));
    }
  }
  showHint () {
    this.gameView.showCountryInfo(this.gameLogic.selectedCountry);
  }
}

const soundEffects = new SoundEffects();
const flickr = new Flickr();
const gameView = new GameView();
const gameLogic = new GameLogic(gameView, soundEffects);
const hangman = new Hangman(gameLogic, gameView, flickr);


// hangman.newGame();
// Observable.fromEvent((<HTMLButtonElement>document.querySelector("#refreshBtn")), "click")
//   .subscribe((ev) => console.log("!!@#!@#!@#"));
//
// document.body.addEventListener("keyup", hangman.onUserInput.bind(hangman));
// (<HTMLButtonElement>document.getElementById("newGameBtn-c")).addEventListener("click", hangman.newGame.bind(hangman));
// (<HTMLButtonElement>document.getElementById("newGameBtn-g")).addEventListener("click", hangman.newGame.bind(hangman));
// // (<HTMLButtonElement>document.getElementById("refreshBtn")).addEventListener("click", hangman.getAnotherPhoto.bind(hangman));
// (<HTMLButtonElement>document.getElementById("hintBtn")).addEventListener("click", hangman.showHint.bind(hangman));
