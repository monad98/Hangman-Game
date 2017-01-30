/**
 * Created by monad on 1/30/17.
 */
export class SoundEffects {
  wrong: string = "assets/sounds/wrong.mp3";
  correct: string = "assets/sounds/correct.mp3";

  static playSound(sound: string) {
    (new Audio(sound)).play();
  }
}