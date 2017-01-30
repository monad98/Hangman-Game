import {Util} from "./util";
import {GameLogic} from "./game-logic";
import {GameView} from "./game-view";
import {Flickr} from "./flickr";
import {SoundEffects} from "./sound-effects";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';




/**
 * Hangman Game Object
 */
export class Hangman {

  constructor(private gameLogic: GameLogic, private gameView: GameView, private flickr: Flickr) {

    this.refreshClickStream = Observable.fromEvent(this.refreshBtnElem, "click");
    const newGameClickStreamAfterWin = Observable.fromEvent(this.newGameBtnWin, "click");
    const newGameClickStreamAfterLost = Observable.fromEvent(this.newGameBtnLose, "click");
    this.newGameClickStream = Observable.merge(newGameClickStreamAfterWin, newGameClickStreamAfterLost);
    this.hintClickSteam = Observable.fromEvent(this.hintBtn, "click");
    this.keyupStream = Observable.fromEvent(document.body, 'keyup');

    this.newGame();

  }
  //Button elements
  refreshBtnElem = <HTMLElement>document.querySelector("#refreshBtn");
  newGameBtnWin = <HTMLButtonElement>document.getElementById("newGameBtn-c");
  newGameBtnLose = <HTMLButtonElement>document.getElementById("newGameBtn-g");
  hintBtn = <HTMLButtonElement>document.getElementById("hintBtn");

  //Stream
  refreshClickStream: Observable<any>;
  newGameClickStream: Observable<any>;
  hintClickSteam: Observable<any>;
  keyupStream: Observable<any>;

  onUserInput (ev: KeyboardEvent) {
    // method to process an input letter
    if (this.gameLogic.gameOverOrUserWon) return;
    let letter = ev.key;
    if (letter === "1") return this.getAnotherPhoto();
    if (!this.gameLogic.isValidInput(ev)) return; // if not valid input, just ignore user input and finish function execution
    letter = letter.toUpperCase();
    this.gameLogic.pushToLetterGuessed(letter); // if valid input, next step => add this letter to letter guessed input
    this.gameLogic.checkInputLetter(letter); //check if this letter is part of the selected captial
    this.gameView.viewUpdateAfterUserInput(letter, this.gameLogic); //update the view
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
