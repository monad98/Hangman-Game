import {GameLogic} from "./game-logic";
import {Util} from "./util";
export class GameView {

  containerElem = <HTMLElement>document.getElementsByClassName("container")[0];
  hangmanPhotoElem = <HTMLImageElement>document.getElementById("hangmanPhoto");
  countryPhotoElem = <HTMLImageElement>document.getElementById("countryPhoto");
  congratMsgBoxElem = <HTMLElement>document.getElementById("congratulation");
  gameOverMsgBoxElem = <HTMLElement>document.getElementById("gameover");
  hintBoxElem = <HTMLElement>document.getElementById("hint");
  currentGuessedWordElem =  <HTMLElement>document.getElementById("currentGuessedWord");
  remainingGuessElem =  <HTMLElement>document.getElementById("remainingGuess");
  letterGuessedBoxElem = <HTMLElement>document.getElementById("letterGuessed");
  audioPlayerElem = <HTMLAudioElement>document.getElementById("audioPlayer");
  cursorElem = <HTMLElement>document.getElementById("cursor");
  loadingElem = <HTMLElement>document.getElementById("loading");
  capitalElem = <HTMLElement>document.getElementById("capital");
  continentElem = <HTMLElement>document.getElementById("continent");
  populationElem = <HTMLElement>document.getElementById("population");
  refreshBtnElem = <HTMLElement>document.getElementById("refreshBtn");
  winRecordElem = <HTMLElement>document.getElementById("winRecord");
  loseRecordElem = <HTMLElement>document.getElementById("loseRecord");

  initializeView () {
    this.hangmanPhotoElem.src = "assets/images/d-6.jpg";
    this.congratMsgBoxElem.style.display = "none";
    this.gameOverMsgBoxElem.style.display = "none";
    this.hintBoxElem.style.display = "none";
    this.remainingGuessElem.innerHTML = "6";
    this.containerElem.style.opacity = "0.2";
    this.letterGuessedBoxElem.innerHTML = "_";
    this.audioPlayerElem.volume = 0.3;
  }
  viewUpdateAfterUserInput (letter: string /* uppercase */,  gameLogic: GameLogic) { // update game stat (Life, hanman image, guessed letter, current guessed word)

    this.cursorElem.innerHTML = letter;
    this.cursorElem.className = "";
    setTimeout(()=> {
      this.cursorElem.innerHTML = "_";
      this.cursorElem.className = "blink"; //activate cursor animation again after 1s.
    }, 1000);

    this.remainingGuessElem.innerHTML = gameLogic.remainingGuess.toString();
    this.hangmanPhotoElem.src = "assets/images/d-" + gameLogic.remainingGuess + ".jpg";
    this.currentGuessedWordElem.innerHTML = "<span>" + Util.convertEmptySpaceToNbsp(gameLogic.currentGuessedWord, letter).join("</span><span>") + "</span>";
    this.letterGuessedBoxElem.innerHTML = "<span>" + gameLogic.letterGuessed.join("</span><span>") + "</span>";
  }
  viewUpdateAfterSelectingCountry (gameLogic: GameLogic) { // update current guess word
    this.currentGuessedWordElem.innerHTML = "<span>" + Util.convertEmptySpaceToNbsp(gameLogic.currentGuessedWord).join("</span><span>") + "</span>";

  }
  viewUpdateForUserWonMessage (gameLogic: GameLogic) {
    this.congratMsgBoxElem.style.display = "inline-block";
    this.containerElem.style.opacity = "0.2";
    this.winRecordElem.innerHTML = gameLogic.winRecord.toString();
  }
  viewUpdateForUserLostMessage (gameLogic: GameLogic) {
    this.gameOverMsgBoxElem.style.display = "inline-block";
    this.containerElem.style.opacity = "0.2";
    this.loseRecordElem.innerHTML = gameLogic.loseRecord.toString();
  }
  loadPhoto (photoUrl: string) { //function to show fetched photo to screen
    this.countryPhotoElem.src = photoUrl;
    let self = this;
    setTimeout(function () {
      self.stopRefreshCircle();
    }, 1000);
  }
  loadRefreshCircle () { //This function shows refresh circle git and hide previous country image
    this.refreshBtnElem.style.display = "none";
    this.hintBoxElem.style.display = "none";
    this.countryPhotoElem.style.opacity = "0";
    this.loadingElem.style.display = "block";
  }
  stopRefreshCircle () {
    //This function is called after we finish loading new country image
    //and stop showing refresh circle gif image.
    this.countryPhotoElem.style.opacity = "1";
    this.loadingElem.style.display = "none";
    this.refreshBtnElem.style.display = ""; //to default display value
    this.containerElem.style.opacity = "1"; // we need this when new game's first image loaded.
  }
  alreadyGuessedLetterEffect (letter: string, letterGuessed: Array<string>) {
    // if same letter typed again, blink effect on that letter for 2.5s;
    const blinkLetterGuessed = letterGuessed.map(function (c) {
      if (c === letter) {
        return '<span class="blink">' + c + "</span>";
      } else return "<span>" + c + "</span>";
    });
    this.letterGuessedBoxElem.innerHTML = blinkLetterGuessed.join("");
    setTimeout(() => {
      this.letterGuessedBoxElem.innerHTML = "<span>" + letterGuessed.join("</span><span>") + "</span>";
    }, 2500)
  }
  showCountryInfo (selectedCountry: any) {
    this.hintBoxElem.style.display = "block";
    this.capitalElem.innerHTML = selectedCountry.capital;
    this.continentElem.innerHTML = selectedCountry.continentName;
    this.populationElem.innerHTML = selectedCountry.population;
  }
}