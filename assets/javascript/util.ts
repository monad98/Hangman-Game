/**
 * Created by monad on 1/30/17.
 */
export class Util {
  static randomIndex (arryLength: number) {
    // function to pick random index from array;
    return Math.floor(Math.random() * arryLength);
  }
  static convertEmptySpaceToNbsp (arry: Array<string>, letter?: string):Array<string> { //letter is uppercase
    //case 1. User Input - with user input letter: change input letter
    if (letter) return arry.map((c)=> {
      if (c === " ") return "&nbsp"; // to make empty space character take some space. <span>&nbsp</span>
      else if (c.toUpperCase() === letter) return "<strong>" + c + "</strong>";
      else return c;
    });
    //case 2. NEW Game
    else return arry.map( (c)=> {
      if (c === " ") return "&nbsp";
      else return c;
    })
  }
}