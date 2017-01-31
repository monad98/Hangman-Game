/**
 * Created by monad on 1/30/17.
 */
import {countries} from "./countries";
import {GameView} from "./game-view";
import {Util} from "./util";
import {SoundEffects} from "./sound-effects";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export class GameLogic {
  constructor(private gameView: GameView, private soundEffects: SoundEffects) {
    this.gameOverOrUserWon$ = new BehaviorSubject(false);
  }
  selectedCountryPhotoArray: Array<any>  =  [];
  selectedCountry: any = {};
  letterGuessed: Array<any> = [];
  remainingGuess: number = 6;
  currentGuessedWord: Array<any> = [];
  gameOverOrUserWon$: BehaviorSubject<boolean>;

  // gameOverOrUserWon: boolean = false;
  winRecord: number = 0;
  loseRecord: number = 0;

  initializeVariable () {
    /* initialize game variable after pressing new game button */
    this.selectedCountryPhotoArray = [];
    this.selectedCountry = {};
    this.letterGuessed = [];
    this.remainingGuess = 6;
    this.currentGuessedWord = [];
    this.gameOverOrUserWon$.next(false);
  }
  selectCountry () {
    // select a random country and make a same length hidden word to show to user
    this.selectedCountry = countries[Util.randomIndex(countries.length)]; //pick random country
    this.currentGuessedWord = this.selectedCountry.countryName.replace(/[a-zA-Z]/g, "_").split(""); //Hide letter except alphabetical character.
    console.log("SelectedCountry is " + this.selectedCountry.countryName);
  }
  checkResult () {
    // 1. check remaining life and if remaining life is 0, user lose
    if (this.remainingGuess === 0) {
      this.gameOverOrUserWon$.next(true);
      this.loseRecord += 1;
      return this.gameView.viewUpdateForUserLostMessage(this); //user lost the game
    }
    // 2. check if user got answer and if so, user win.
    if (this.currentGuessedWord.join("") === this.selectedCountry.countryName) {
      this.gameOverOrUserWon$.next(true);
      this.winRecord += 1;
      return this.gameView.viewUpdateForUserWonMessage(this); //user won the game
    }
    // 3. Game continues
    // do nothing
  }
  checkInputLetter (letter: string) { //uppercase
    //check input letter is same as each letter in country
    let isThereMatchedLetter = false;
    let self = this;
    this.selectedCountry.countryName
      .split("") //to array
      .forEach(function (c: string, index: number) {
        if (c.toUpperCase() === letter) {
          self.currentGuessedWord[index] = c;
          isThereMatchedLetter = true;
        }
      });
    if (!isThereMatchedLetter) { // input letter is wrong
      self.remainingGuess -= 1;
      SoundEffects.playSound(this.soundEffects.wrong);
    } else {
      SoundEffects.playSound(this.soundEffects.correct); // input letter is correct
    }
    console.log("CurrentGuessedWord is " + this.currentGuessedWord);
  }
  pushToLetterGuessed (letter: string) { //uppercase
    // This function is called after checking validity of user input.
    // Add input letter to letterGuessed array.
    this.letterGuessed.push(letter);
    this.letterGuessed.sort();
    // console.log("Current letterGuessed is " + letterGuessed);
  }
  isValidInput (ev: KeyboardEvent) { // function to check if input letter is valid.
    const letter = ev.key;
    if (letter.length > 1) return false; // "Shift", "Tab" .....
    const charCode = letter.charCodeAt(0);
    // Check charCode here to prevent another language input
    if (charCode > 122 || charCode < 65 || (charCode > 90 && charCode < 97)) return false; // A: 65, Z:90, a: 97, z: 122
    else if (this.letterGuessed.indexOf(letter.toUpperCase()) > -1) { // already tried letter
      this.gameView.alreadyGuessedLetterEffect(letter.toUpperCase(), this.letterGuessed); // blink effect
      return false;
    } else return true; // user input a letter which has not been typed before, so VALID input
  }
}