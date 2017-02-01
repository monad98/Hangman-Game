/**
 * Created by monad on 1/30/17.
 */

export const NEW_GAME = "NEW_GAME";
export const SELECTING_COUNTRY_COMPLETE = "SELECTING_COUNTRY_COMPLETE";
export const LOAD_COUNTRY_PHOTO_ARRY = "LOAD_COUNTRY_PHOTO_ARRY";
export const FETCH_NEW_COUNTRY_PHOTO = "FETCH_NEW_COUNTRY_PHOTO";
export const LOAD_COUNTRY_PHOTO = "LOAD_COUNTRY_PHOTO";
export const LOAD_REFRESH_CIRCLE = "LOAD_REFRESH_CIRCLE";
export const PUSH_TO_LETTER_GUESSED = "PUSH_TO_LETTER_GUESSED";
export const UPDATE_CURRENT_GUESSED_WORD = "UPDATE_CURRENT_GUESSED_WORD";
export const GAME_ENDED = "GAME_ENDED";
export const GAME_IN_PROGRESS = "GAME_IN_PROGRESS";
export const SHOW_HINT = "SHOW_HINT";


interface Action {
  type: string,
  payload: any
}


export interface Country {
  countryName: string;
  population: string;
  capital: string;
  continent: string;
}

export interface State {
  selectedCountryPhotoArray: Array<any>;
  selectedCountry: Country;
  currentPhotoUrl: string;
  letterGuessed: Array<string>;
  remainingGuess: number;
  lastInputUpperCase: string;
  currentGuessedWord: Array<string>;
  gameOverOrUserWon: boolean;
  winRecord: number;
  loseRecord: number;
}

export const initialState: State = {
  selectedCountryPhotoArray: [],
  selectedCountry: null,
  currentPhotoUrl: "",
  letterGuessed: [],
  remainingGuess: 6,
  lastInputUpperCase: "",
  currentGuessedWord: [],
  gameOverOrUserWon: false,
  winRecord: 0,
  loseRecord: 0

};


export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case NEW_GAME: {
      return initialState; //initialState
    }
    case SELECTING_COUNTRY_COMPLETE: {
      const selectedCountry: Country = (action.payload);
      const currentGuessedWord = selectedCountry.countryName.replace(/[a-zA-Z]/g, "_").split(""); //Hide letter except alphabetical character.
      return Object.assign({}, state, {selectedCountry, currentGuessedWord});
    }
    case LOAD_COUNTRY_PHOTO_ARRY: {
      const selectedCountryPhotoArray = action.payload;
      return Object.assign({}, state, {selectedCountryPhotoArray});
    }
    case LOAD_COUNTRY_PHOTO: {
      const currentPhotoUrl = action.payload;
      return Object.assign({}, state, {currentPhotoUrl});
    }
    case PUSH_TO_LETTER_GUESSED: {
      const lastInputUpperCase = action.payload;
      state.letterGuessed.push(lastInputUpperCase);
      const letterGuessed = state.letterGuessed.sort();
      return Object.assign({}, state, {letterGuessed, lastInputUpperCase})
    }
    case UPDATE_CURRENT_GUESSED_WORD: {
      const currentGuessedWord = action.payload.currentGuessedWord;
      const didMatched = action.payload.didMatched;
      const remainingGuess = didMatched ? state.remainingGuess: state.remainingGuess - 1;
      return Object.assign({}, state, {currentGuessedWord, remainingGuess});
    }
    case GAME_ENDED: {
      const gameOverOrUserWon = action.payload.gameOverOrUserWon;
      const loseRecord = action.payload.loseRecord;
      const winRecord = action.payload.winRecord;
      return Object.assign({}, state, {gameOverOrUserWon, loseRecord, winRecord})
    }

    default: {
      return state;
    }
  }
};