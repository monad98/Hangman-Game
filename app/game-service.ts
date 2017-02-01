import {State} from "./reducer";

export class GameService {

  checkResult(state: State) {
    let gameOverOrUserWon: boolean = false;
    let didWin: boolean;
    let winRecord = state.winRecord;
    let loseRecord = state.loseRecord;
    // 1. check remaining life and if remaining life is 0, user lose
    if (state.remainingGuess === 0) {
      gameOverOrUserWon = true;
      loseRecord += 1;
      didWin = false;
    }
    // 2. check if user got answer and if so, user win.
    if (state.currentGuessedWord.join("") === state.selectedCountry.countryName) {
      gameOverOrUserWon = true;
      didWin = true;
      winRecord += 1;
    }
    return {gameOverOrUserWon, didWin, loseRecord, winRecord};
  }

  updateCurrentGuessedWord(state: State): any { //uppercase
    //check input letter is same as each letter in country
    let isThereMatchedLetter = false;
    const updatedCurrentGuessedWord = state.currentGuessedWord.slice();
    state.selectedCountry.countryName
      .split("") //to array
      .forEach(function (c: string, index: number) {
        if (c.toUpperCase() === state.lastInputUpperCase) {
          updatedCurrentGuessedWord[index] = c;
          isThereMatchedLetter = true;
        }
      });
    console.log("CurrentGuessedWord is " + updatedCurrentGuessedWord);
    return {
      didMatched: isThereMatchedLetter,
      currentGuessedWord: updatedCurrentGuessedWord,
    };
  }
}