// https://api.flickr.com/services/rest/



(function (window, document, countries) {

  /**
   * Hangman Game Object
   */
  var hangman = (function () {

    /**
     * Sounds
     */
    var soundEffects = {
      wrong: "assets/sounds/wrong.mp3",
      correct: "assets/sounds/correct.mp3",
      playSound: function (sound) {
        (new Audio(sound)).play();
      }
    };

    /**
     * object for Flickr API
     */
    var flickr = {
      flickrGetInfoURL: "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=86efe8391d65d077f83708cd833ab990&photo_id=",
      flickrSearchURL: "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=86efe8391d65d077f83708cd833ab990&tags=",
      // method for fetching country photo using Flick API
      getPhotoInfo: function(photoId, callback) {
        // Function to get selected photo's url from photo's id through Flickr Api
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.flickrGetInfoURL + photoId);
        xhr.onload = function () {
          if (xhr.status === 200) {
            var photo = JSON.parse(xhr.responseText).photo;
            var photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
            callback(photoStaticURL); //TODO: this??
          } else {
            console.log("Request failed. Status: " + xhr.status);
          }
        };
        xhr.send();
      },
      getCountryPhotos: function(countryName, callback) {
        // function to get json array of selected country photo using Flickr Api
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.flickrSearchURL + countryName);
        xhr.onload = function () {
          if (xhr.status === 200) {
            gameLogic.selectedCountryPhotoArray = JSON.parse(xhr.responseText).photos.photo;
            callback(); //TODO: this??
          } else {
            alert("Request failed. Status: " + xhr.status);
          }
        };
        xhr.send();
      }
    };



    /**
     * object for storing game related variable, game logic
     */
    var gameLogic = {
      selectedCountryPhotoArray: [],
      selectedCountry: "",
      letterGuessed: [],
      remainingGuess: 6,
      currentGuessedWord: [],
      gameOverOrUserWon: false,
      initializeVariable: function () {
        /* initialize game variable after pressing new game button */
        this.selectedCountryPhotoArray = [];
        this.selectedCountry = "";
        this.letterGuessed = [];
        this.remainingGuess = 6;
        this.currentGuessedWord = [];
        this.gameOverOrUserWon = false;
      },
      selectCountry:function () {
        // select a random country and make a same length hidden word to show to user
        this.selectedCountry = countries[util.randomIndex(countries.length)].countryName; //pick random country
        this.currentGuessedWord = this.selectedCountry.replace(/[a-zA-Z]/g, "_").split(""); //Hide letter except alphabetical character.
        console.log("SelectedCountry is " + this.selectedCountry);
      },
      checkResult: function () {
        // 1. check ramaining life and if remaining life is 0, user lose
        // 2. check if user got answer and if so, user win.
        if (this.remainingGuess === 0) {
          this.gameOverOrUserWon = true;
          return gameView.viewUpdateForUserLostMessage(); //user lost the game
        }
        if (this.currentGuessedWord.join("") === this.selectedCountry) {
          this.gameOverOrUserWon = true;
          return gameView.viewUpdateForUserWonMessage(); //user won the game
        }
      },
      checkInputLetter: function (letter) {
        //check input letter is same as each letter in country
        var isThereMatchedLetter = false;
        this.selectedCountry
          .split("") //to array
          .forEach(function (c, index) {
            if (c.toLowerCase() === letter.toLowerCase()) {
              this.currentGuessedWord[index] = c;
              isThereMatchedLetter = true;
            }
          });
        if (!isThereMatchedLetter) { // input letter is wrong
          this.remainingGuess -= 1;
          soundEffects.playSound(soundEffects.wrong);
        } else {
          soundEffects.playSound(soundEffects.correct); // input letter is correct
        }
        // console.log("CurrentGuessedWord is " + currentGuessedWord);
      },
      pushToLetterGuessed: function (letter) {
        // This function is called after checking validity of user input.
        // Add input letter to letterGuessed array.
        this.letterGuessed.push(letter.toUpperCase());
        this.letterGuessed.sort();
        // console.log("Current letterGuessed is " + letterGuessed);
      },
      isValidInput: function (ev) {
        // function to check if input letter is valid.
        // I check both keyCode and charCode here to prevent another language input and special keys like Shift..etc.
        var letter = ev.key;
        var charCode = letter.charCodeAt(0);
        var keyCode = ev.keyCode;
        if (keyCode < 65 || keyCode > 90) return false; // A(a):65, Z(z):90, check keyCode is valide
        else if (charCode > 122 || charCode < 65 || (charCode > 90 && charCode < 97)) return false; // A: 65, Z:90, a: 97, z: 122
        else if (this.letterGuessed.indexOf(letter.toUpperCase()) > -1) {
          gameView.alreadyGuessedLetterEffect(letter.toUpperCase());
          return false; // already tried letter
        }
        return true; // user input a letter which has not been typed before, so valid input
      }
    };





    /**
     * Object for Game view
     */
    var gameView = {
      initializeView: function () {
        document.getElementById("hangmanPhoto").src = "assets/images/d-6.jpg";
        document.getElementById("congratulation").style.display = "none";
        document.getElementById("gameover").style.display = "none";
        document.getElementById("remainingGuess").innerHTML = "6";
        document.getElementsByClassName("container")[0].style.opacity = 0.2;
        document.getElementById("letterGuessed").innerHTML = "_";
        document.getElementById("audioPlayer").volume = 0.3;
      },
      viewUpdateAfterUserInput: function (letter) { // update game stat (Life, hanman image, guessed letter, current guessed word)

        document.getElementById("cursor").innerHTML = letter.toUpperCase(); // temporary change cursor to input letter
        document.getElementById("cursor").className = "";
        setTimeout(function () {
          document.getElementById("cursor").innerHTML = "_";
          document.getElementById("cursor").className = "blink"; //activate cursor animation again after 1s.
        }, 1000);

        document.getElementById("remainingGuess").innerHTML = gameLogic.remainingGuess.toString();
        document.getElementById("hangmanPhoto").src = "assets/images/d-" + gameLogic.remainingGuess + ".jpg";
        document.getElementById("currentGuessedWord").innerHTML = "<span>" + util.convertEmptySpaceToNbsp(gameLogic.currentGuessedWord, letter.toLowerCase()).join("</span><span>") + "</span>";
        document.getElementById("letterGuessed").innerHTML = "<span>" + gameLogic.letterGuessed.join("</span><span>") + "</span>";
      },
      viewUpdateAfterSelectingCountry: function () { // update current guess word
        document.getElementById("currentGuessedWord").innerHTML = "<span>" + util.convertEmptySpaceToNbsp(gameLogic.currentGuessedWord).join("</span><span>") + "</span>";

      },
      viewUpdateForUserWonMessage: function () {
        document.getElementById("congratulation").style.display = "inline-block";
        document.getElementsByClassName("container")[0].style.opacity = 0.2;
        //show information about country. ----. this is ----'s info.
      },
      viewUpdateForUserLostMessage: function () {
        document.getElementById("gameover").style.display = "inline-block";
        document.getElementsByClassName("container")[0].style.opacity = 0.2;
      },
      loadPhoto: function (photoUrl) { //function to show fetched photo to screen
        document.getElementById("countryPhoto").src = photoUrl;
        var self = this;
        setTimeout(function () {
          self.stopRefreshCircle();
        }, 1000);
      },
      loadRefreshCircle: function () { //This function shows refresh circle git and hide previous country image
        document.getElementById("refreshBtn").style.display = "none";
        document.getElementById("countryPhoto").style.opacity = 0;
        document.getElementById("loading").style.display = "block";
      },
      stopRefreshCircle: function () {
        //This function is called after we finish loading new country image
        //and stop showing refresh circle gif image.
        document.getElementById("countryPhoto").style.opacity = 1;
        document.getElementById("loading").style.display = "none";
        document.getElementById("refreshBtn").style.display = ""; //to default display value
        document.getElementsByClassName("container")[0].style.opacity = 1; // we need this when new game's first image loaded.
      },
      alreadyGuessedLetterEffect: function (letter) {
        // if same letter typed again, blink effect on that letter for 2.5s;
        var blinkLetterGuessed = gameLogic.letterGuessed.map(function (c) {
          if (c === letter) {
            return '<span class="blink">' + c + "</span>";
          } else return "<span>" + c + "</span>";
        });
        document.getElementById("letterGuessed").innerHTML = blinkLetterGuessed.join("");
        setTimeout(function () {
          document.getElementById("letterGuessed").innerHTML = "<span>" + gameLogic.letterGuessed.join("</span><span>") + "</span>";
        }, 2500)
      }
    };



    /**
     * helper
     */
    var util = {
      randomIndex: function (arryLength) {
        // function to pick random index from array;
        return Math.floor(Math.random() * arryLength);
      },
      convertEmptySpaceToNbsp: function (arry, lowerCaseletter) {
        //case 1. with input letter: change input letter
        if (lowerCaseletter) return arry.map(function (c) {
          if (c === " ") return "&nbsp"; // to make empty space character take some space. <span>&nbsp</span>
          else if(c.toLowerCase() === lowerCaseletter) return "<strong>" + c + "</strong>";
          else return c;
        });
        else return arry.map(function (c) {
          if (c === " ") return "&nbsp"; // to make empty space character take some space. <span>&nbsp</span>
          else return c;
        })
      }
    };



    /**
     * Game object to return;
     */
    return {
      onUserInput: function (ev) {
        // method to process an input letter
        if (gameLogic.gameOverOrUserWon) return;
        var letter = ev.key;
        if (letter === "1") return this.getAnotherPhoto();
        if (!gameLogic.isValidInput(ev)) return; // if not valid input, just ignore user input and finish function execution
        gameLogic.pushToLetterGuessed(letter); // if valid input, next step => add this letter to letter guessed input
        gameLogic.checkInputLetter(letter); //check if this letter is part of the selected captial
        gameView.viewUpdateAfterUserInput(letter); //update the view
        gameLogic.checkResult();
      },
      newGame: function () {
        // method for starting new game
        gameView.initializeView();
        if (gameLogic.selectCountry) gameLogic.initializeVariable(); // at first game, no need to initialize (already did it)
        gameView.loadRefreshCircle(); // refresh circle for picking a country and loading new photp
        gameLogic.selectCountry();
        gameView.viewUpdateAfterSelectingCountry();
        flickr.getCountryPhotos(gameLogic.selectedCountry, function () {
          flickr.getPhotoInfo(gameLogic.selectedCountryPhotoArray[util.randomIndex(gameLogic.selectedCountryPhotoArray.length)].id, gameView.loadPhoto.bind(gameView));
        });
      },
      getAnotherPhoto: function () {
        // method for showing another photo;
        gameView.loadRefreshCircle();
        if (!gameLogic.selectedCountryPhotoArray.length) this.newGame();
        else {
          flickr.getPhotoInfo(gameLogic.selectedCountryPhotoArray[util.randomIndex(gameLogic.selectedCountryPhotoArray.length)].id, gameView.loadPhoto.bind(gameView));
        }
      }
    };
  }());
  hangman.newGame();
  document.body.addEventListener("keyup", hangman.onUserInput.bind(hangman));
  document.getElementById("newGameBtn-c").addEventListener("click", hangman.newGame.bind(hangman));
  document.getElementById("newGameBtn-g").addEventListener("click", hangman.newGame.bind(hangman));
  document.getElementById("refreshBtn").addEventListener("click", hangman.getAnotherPhoto.bind(hangman));

})(window, document, _countries);
