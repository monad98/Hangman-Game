;(function (window, document, countries) {

  /**
   * Hangman Game Object
   */
  var hangman = (function () {

    /**
     * DOM element references
     */
    var containerElem = document.getElementsByClassName("container")[0];
    var hangmanPhotoElem = document.getElementById("hangmanPhoto");
    var countryPhotoElem = document.getElementById("countryPhoto");
    var congratMsgBoxElem = document.getElementById("congratulation");
    var gameOverMsgBoxElem = document.getElementById("gameover");
    var hintBoxElem = document.getElementById("hint");
    var currentGuessedWordElem = document.getElementById("currentGuessedWord");
    var remainingGuessElem = document.getElementById("remainingGuess");
    var letterGuessedBoxElem = document.getElementById("letterGuessed");
    var audioPlayerElem = document.getElementById("audioPlayer");
    var cursorElem = document.getElementById("cursor");
    var loadingElem = document.getElementById("loading");
    var capitalElem = document.getElementById("capital");
    var continentElem = document.getElementById("continent");
    var populationElem = document.getElementById("population");
    var refreshBtnElem = document.getElementById("refreshBtn");
    var winRecordElem = document.getElementById("winRecord");
    var loseRecordElem = document.getElementById("loseRecord");

    /**
     * object for Flickr API
     */
    var flickr = {
      flickrGetInfoURL: "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=05c2c4785d9125f67f7aaafc765a1739&photo_id=",
      flickrSearchURL: "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=05c2c4785d9125f67f7aaafc765a1739&tags=",
      // method for fetching country photo using Flick API
      getPhotoInfo: function (photoId, callback) {
        // Function to get selected photo's url from photo's id through Flickr Api
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.flickrGetInfoURL + photoId);
        xhr.onload = function () {
          if (xhr.status === 200) {
            var photo = JSON.parse(xhr.responseText).photo;
            var photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
            callback(photoStaticURL);
          } else {
            console.log("Request failed. Status: " + xhr.status);
          }
        };
        xhr.send();
      },
      getCountryPhotos: function (countryName, callback) {
        // function to get json array of selected country photo using Flickr Api
        var self = this;
        var retryCount = 0;
        var selectedCountryPhotoArray;
        doRequest();
        function doRequest() {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", self.flickrSearchURL + countryName);
          xhr.onload = function () {
            if (xhr.status === 200) {
              gameLogic.selectedCountryPhotoArray = JSON.parse(xhr.responseText).photos.photo;
              //if there is no photo fetched, retry 3 more times
              if (gameLogic.selectedCountryPhotoArray.length === 0 && retryCount < 3) {
                retryCount++;
                doRequest();
                console.log("Retry Count: " + retryCount);
              } else {
                callback();
              }
            } else {
              alert("Request failed. Status: " + xhr.status);
            }
          };
          xhr.send();
        }
      }
    };



    /**
     * object for storing game related variable, game logic
     */
    var gameLogic = {
      selectedCountryPhotoArray: [],
      selectedCountry: {},
      letterGuessed: [],
      remainingGuess: 6,
      currentGuessedWord: [],
      gameOverOrUserWon: false,
      winRecord: 0,
      loseRecord: 0,
      initializeVariable: function () {
        /* initialize game variable after pressing new game button */
        this.selectedCountryPhotoArray = [];
        this.selectedCountry = {};
        this.letterGuessed = [];
        this.remainingGuess = 6;
        this.currentGuessedWord = [];
        this.gameOverOrUserWon = false;

      },
      selectCountry: function () {
        // select a random country and make a same length hidden word to show to user
        this.selectedCountry = countries[util.randomIndex(countries.length)]; //pick random country
        this.currentGuessedWord = this.selectedCountry.countryName.replace(/[a-zA-Z]/g, "_").split(""); //Hide letter except alphabetical character.
        console.log("SelectedCountry is " + this.selectedCountry.countryName);
      },
      checkResult: function () {
        // 1. check remaining life and if remaining life is 0, user lose
        if (this.remainingGuess === 0) {
          this.gameOverOrUserWon = true;
          this.loseRecord += 1;
          return gameView.viewUpdateForUserLostMessage(); //user lost the game
        }
        // 2. check if user got answer and if so, user win.
        if (this.currentGuessedWord.join("") === this.selectedCountry.countryName) {
          this.gameOverOrUserWon = true;
          this.winRecord += 1;
          return gameView.viewUpdateForUserWonMessage(); //user won the game
        }
        // 3. Game continues
        // do nothing
      },
      checkInputLetter: function (letter) { //uppercase
        //check input letter is same as each letter in country
        var isThereMatchedLetter = false;
        var self = this;
        this.selectedCountry.countryName
          .split("") //to array
          .forEach(function (c, index) {
            if (c.toUpperCase() === letter) {
              self.currentGuessedWord[index] = c;
              isThereMatchedLetter = true;
            }
          });
        if (!isThereMatchedLetter) { // input letter is wrong
          self.remainingGuess -= 1;
          soundEffects.playSound(soundEffects.wrong);
        } else {
          soundEffects.playSound(soundEffects.correct); // input letter is correct
        }
        console.log("CurrentGuessedWord is " + this.currentGuessedWord);
      },
      pushToLetterGuessed: function (letter) { //uppercase
        // This function is called after checking validity of user input.
        // Add input letter to letterGuessed array.
        this.letterGuessed.push(letter);
        this.letterGuessed.sort();
        // console.log("Current letterGuessed is " + letterGuessed);
      },
      isValidInput: function (ev) { // function to check if input letter is valid.
        var letter = ev.key;
        if (letter.length > 1) return false; // "Shift", "Tab" .....
        var charCode = letter.charCodeAt(0);
        // Check charCode here to prevent another language input
        if (charCode > 122 || charCode < 65 || (charCode > 90 && charCode < 97)) return false; // A: 65, Z:90, a: 97, z: 122
        else if (this.letterGuessed.indexOf(letter.toUpperCase()) > -1) { // already tried letter
          gameView.alreadyGuessedLetterEffect(letter.toUpperCase()); // blink effect
          return false;
        } else return true; // user input a letter which has not been typed before, so VALID input
      }
    };




    /**
     * Object for Game view
     */
    var gameView = {
      initializeView: function () {
        hangmanPhotoElem.src = "assets/images/d-6.jpg";
        congratMsgBoxElem.style.display = "none";
        gameOverMsgBoxElem.style.display = "none";
        hintBoxElem.style.display = "none";
        remainingGuessElem.innerHTML = "6";
        containerElem.style.opacity = 0.2;
        letterGuessedBoxElem.innerHTML = "_";
        audioPlayerElem.volume = 0.3;
      },
      viewUpdateAfterUserInput: function (letter /* uppercase */ ) { // update game stat (Life, hanman image, guessed letter, current guessed word)

        cursorElem.innerHTML = letter;
        cursorElem.className = "";
        setTimeout(function () {
          cursorElem.innerHTML = "_";
          cursorElem.className = "blink"; //activate cursor animation again after 1s.
        }, 1000);

        remainingGuessElem.innerHTML = gameLogic.remainingGuess.toString();
        hangmanPhotoElem.src = "assets/images/d-" + gameLogic.remainingGuess + ".jpg";
        currentGuessedWordElem.innerHTML = "<span>" + util.convertEmptySpaceToNbsp(gameLogic.currentGuessedWord, letter).join("</span><span>") + "</span>";
        letterGuessedBoxElem.innerHTML = "<span>" + gameLogic.letterGuessed.join("</span><span>") + "</span>";
      },
      viewUpdateAfterSelectingCountry: function () { // update current guess word
        currentGuessedWordElem.innerHTML = "<span>" + util.convertEmptySpaceToNbsp(gameLogic.currentGuessedWord).join("</span><span>") + "</span>";

      },
      viewUpdateForUserWonMessage: function () {
        congratMsgBoxElem.style.display = "inline-block";
        containerElem.style.opacity = 0.2;
        winRecordElem.innerHTML = gameLogic.winRecord.toString();
      },
      viewUpdateForUserLostMessage: function () {
        gameOverMsgBoxElem.style.display = "inline-block";
        containerElem.style.opacity = 0.2;
        loseRecordElem.innerHTML = gameLogic.loseRecord.toString();
      },
      loadPhoto: function (photoUrl) { //function to show fetched photo to screen
        countryPhotoElem.src = photoUrl;
        var self = this;
        setTimeout(function () {
          self.stopRefreshCircle();
        }, 1000);
      },
      loadRefreshCircle: function () { //This function shows refresh circle git and hide previous country image
        refreshBtnElem.style.display = "none";
        hintBoxElem.style.display = "none";
        countryPhotoElem.style.opacity = 0;
        loadingElem.style.display = "block";
      },
      stopRefreshCircle: function () {
        //This function is called after we finish loading new country image
        //and stop showing refresh circle gif image.
        countryPhotoElem.style.opacity = 1;
        loadingElem.style.display = "none";
        refreshBtnElem.style.display = ""; //to default display value
        containerElem.style.opacity = 1; // we need this when new game's first image loaded.
      },
      alreadyGuessedLetterEffect: function (letter) {
        // if same letter typed again, blink effect on that letter for 2.5s;
        var blinkLetterGuessed = gameLogic.letterGuessed.map(function (c) {
          if (c === letter) {
            return '<span class="blink">' + c + "</span>";
          } else return "<span>" + c + "</span>";
        });
        letterGuessedBoxElem.innerHTML = blinkLetterGuessed.join("");
        setTimeout(function () {
          letterGuessedBoxElem.innerHTML = "<span>" + gameLogic.letterGuessed.join("</span><span>") + "</span>";
        }, 2500)
      },
      showCountryInfo: function () {
        var info = {
          capital: gameLogic.selectedCountry.capital,
          continent: gameLogic.selectedCountry.continentName,
          population: gameLogic.selectedCountry.population,
        };
        hintBoxElem.style.display = "block";
        capitalElem.innerHTML = info.capital;
        continentElem.innerHTML = info.continent;
        populationElem.innerHTML = info.population;
      }
    };


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
     * helper
     */
    var util = {
      randomIndex: function (arryLength) {
        // function to pick random index from array;
        return Math.floor(Math.random() * arryLength);
      },
      convertEmptySpaceToNbsp: function (arry, letter) { //letter is uppercase
        //case 1. User Input - with user input letter: change input letter
        if (letter) return arry.map(function (c) {
          if (c === " ") return "&nbsp"; // to make empty space character take some space. <span>&nbsp</span>
          else if (c.toUpperCase() === letter) return "<strong>" + c + "</strong>";
          else return c;
        });
        //case 2. NEW Game
        else return arry.map(function (c) {
          if (c === " ") return "&nbsp";
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
        letter = letter.toUpperCase();
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
        flickr.getCountryPhotos(gameLogic.selectedCountry.countryName, function () {
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
      },
      showHint: function () {
        gameView.showCountryInfo();
      }
    };
  }());

  hangman.newGame();
  document.body.addEventListener("keyup", hangman.onUserInput.bind(hangman));
  document.getElementById("newGameBtn-c").addEventListener("click", hangman.newGame.bind(hangman));
  document.getElementById("newGameBtn-g").addEventListener("click", hangman.newGame.bind(hangman));
  document.getElementById("refreshBtn").addEventListener("click", hangman.getAnotherPhoto.bind(hangman));
  document.getElementById("hintBtn").addEventListener("click", hangman.showHint.bind(hangman));
})(window, document, _countries);
