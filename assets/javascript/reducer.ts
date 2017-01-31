/**
 * Created by monad on 1/30/17.
 */
import {Action} from "redux";

export const SELECT_COUNTRY = "SELECT_COUNTRY";
export const GET_COUNTRY_PHOTO = "GET_COUNTRY_PHOTO";




export interface State {
  selectedCountryPhotoArray: Array<any>;
  selectedCountry: any;
  letterGuessed: Array<any>;
  remainingGuess: number;
  currentGuessedWord: Array<any>;
  gameOverOrUserWon: boolean;
  winRecord: number;
  loseRecord: number;
}

const initialState = {
  selectedCountryPhotoArray: [],
  selectedCountry: {},
  letterGuessed: [],
  remainingGuess: 6,
  currentGuessedWord: [],
  gameOverOrUserWon: false,
  winRecord: 0,
  loseRecord: 0
};


export const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case SELECT_COUNTRY: {
      return state;
    }
    default: {
      return state;
    }
  }
};