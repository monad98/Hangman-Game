// https://api.flickr.com/services/rest/



(function (window, document, countries) {


  var hangman = (function () {

    /**
     * Flickr string
     */
    var flickrApiKey = "86efe8391d65d077f83708cd833ab990";
    var flickrGetInfoURL = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=" + flickrApiKey + "&photo_id=";
    var flickrSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=" + flickrApiKey + "&tags=";


    /**
     * Variable for storing game related variable
     */
    var selectedCountryPhotoArray = [];
    var selectedCountry = "";
    var letterGuessed = [];
    var remainingGuess = 6;
    var currentGuessedWord = [];
    var gameOverOrUserWon = false;


    /**
     * Custom event
     */
    // var gameover = new Event("gameover");
    // var userwon = new Event("userwon");



    /**
     * Functions for fetching country photo using Flick API
     */
    function getPhotoInfo(photoId, callback) {
      // Function to get selected photo's url from photo's id through Flickr Api
      var xhr = new XMLHttpRequest();
      xhr.open("GET", flickrGetInfoURL + photoId);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var photo = JSON.parse(xhr.responseText).photo;
          var photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
          callback(photoStaticURL);
        } else {
          alert("Request failed. Status: " + xhr.status);
        }
      };
      xhr.send();
    }

    function getCountryPhotos(countryName, callback) {
      // function to get json array of selected country photo using Flickr Api
      var xhr = new XMLHttpRequest();
      xhr.open("GET", flickrSearchURL + countryName);
      xhr.onload = function () {
        if (xhr.status === 200) {
          selectedCountryPhotoArray = JSON.parse(xhr.responseText).photos.photo;
          callback();
        } else {
          alert("Request failed. Status: " + xhr.status);
        }
      };
      xhr.send();
    }




    /**
     * Game Logic
     */
    function initializeVariable() {
      /* initialize game variable after pressing new game button */
      selectedCountryPhotoArray = [];
      selectedCountry = "";
      letterGuessed = [];
      remainingGuess = 6;
      currentGuessedWord = [];
      gameOverOrUserWon = false;
    }

    function selectCountry() {
      // select a random country and make a same length hidden word to show to user
      selectedCountry = countries[randomIndex(countries.length)].country; //pick random country
      currentGuessedWord = selectedCountry //Hide selected country name.
        .split("") // to array
        .map(function (letter) {
          if (letter === " " || letter === "'") return letter;
          else return "_"; // if the letter is neither " " nor "'" , this letter is what we need to hide
        });
      console.log("SelectedCountry is " + selectedCountry);
      console.log("Hided captinal is " + currentGuessedWord);
    }

    function checkResult() {
      // 1. check ramaining life and if remaining life is 0, user lose
      // 2. check if user got answer and if so, user win.
      if (remainingGuess === 0) {
        gameOverOrUserWon = true;
        return viewUpdateForUserLostMessage(); //user lost the game
      }
      if (currentGuessedWord.join("") === selectedCountry) {
        gameOverOrUserWon = true;
        return viewUpdateForUserWonMessage(); //user won the game
      }
    }

    function checkInputLetter(letter) {
      //check input letter is same as each letter in country
      console.log("You typed '" + letter + "'");
      var isThereMatchedLetter = false;
      selectedCountry
        .split("") //to array
        .forEach(function (c, index) {
          if (c.toLowerCase() === letter.toLowerCase()) {
            console.log("got char!")
            currentGuessedWord[index] = c;
            isThereMatchedLetter = true;
          }
        });
      if (!isThereMatchedLetter) remainingGuess -= 1;
      console.log("currentGuessedWord is " + currentGuessedWord);
    }

    function pushToLetterGuessed(letter) {
      // This function is called after checking validity of user input. 
      // Add input letter to letterGuessed array.  
      letterGuessed.push(letter.toUpperCase());
      letterGuessed.sort();
      //TODO: Sort;
      console.log("Current letterGuessed is " + letterGuessed);
    }

    function isValidInput(ev) {
      // function to check if input letter is valid. 
      // I check both keyCode and charCode here to prevent another language input and special keys like Shift..etc.      
      var letter = ev.key;
      var charCode = letter.charCodeAt(0);
      var keyCode = ev.keyCode;
      if (keyCode < 65 || keyCode > 90) return false; // A(a):65, Z(z):90, check keyCode is valide
      else if (charCode > 122 || charCode < 65 || (charCode > 90 && charCode < 97)) return false; // A: 65, Z:90, a: 97, z: 122
      else if (letterGuessed.indexOf(letter.toUpperCase()) > -1) return false; // already tried letter
      return true; // user input a letter which has not been typed before, so valid input
    }




    /**
     * View Update functions
     */
    function initializeView() {
      document.getElementById('hangmanPhoto').src = "assets/images/d-6.jpg";
      document.getElementById('congratulation').style.display = "none";
      document.getElementById('gameover').style.display = "none";
      document.getElementById('remainingGuess').innerHTML = "6";
      document.getElementsByClassName('container')[0].style.opacity = 0.2;
      document.getElementById("letterGuessed").innerHTML = "_";
    }

    function viewUpdateAfterUserInput(letter) {
      // update game stat (Life, hanman image, guessed letter, current guessed word)

      //cursor animation
      document.getElementById("cursor").innerHTML = letter.toUpperCase();
      document.getElementById("cursor").className = "";
      setTimeout(function () {
        document.getElementById("cursor").innerHTML = "_";
        document.getElementById("cursor").className = "blink"
      }, 1000)

      document.getElementById("remainingGuess").innerHTML = remainingGuess;
      document.getElementById("hangmanPhoto").src = "assets/images/d-" + remainingGuess + ".jpg";
      document.getElementById("currentGuessedWord").innerHTML = "<span>" + currentGuessedWord.join("</span><span>") + "</span>";
      document.getElementById("letterGuessed").innerHTML = "<span>" + letterGuessed.join("</span><span>") + "</span>";
    }

    function viewUpdateAfterSelectingCountry() {
      // update current guess word
      document.getElementById("currentGuessedWord").innerHTML = "<span>" + currentGuessedWord.join("</span><span>") + "</span>";
      // document.getElementById("currentGuessedWord").innerHTML = "<div>a</div><div>a</div><div>a</div><div>a</div><div>a</div><div>a</div><div>a</div>"
      
    }
    //TODO: implement
    function viewUpdateForUserWonMessage() {
      console.log("USER WON!");
      document.getElementById('congratulation').style.display = "inline-block";
      // disableUserInput();
      //show information about country. ----. this is ----'s info.
    }
    //TODO: implement
    function viewUpdateForUserLostMessage() {
      console.log("GAME OVER!");
      document.getElementById('gameover').style.display = "inline-block";
      // document.dispatchEvent(gameover);
      // disableUserInput();
      //prevent more input, initialize view, make user press new game button
    }
    function loadPhoto(photoUrl) {
      //function to show fetched photo to screen
      document.getElementById("countryPhoto").src = photoUrl;
      setTimeout(function () {
        stopRefreshCircle();
      }, 1000);
    }

    function loadRefreshCircle() {
      //This function shows refresh circle git and hide previous country image
      document.getElementById("refreshBtn").style.display = "none";
      document.getElementById("countryPhoto").style.opacity = 0;
      document.getElementById("loading").style.display = "block";
    }

    function stopRefreshCircle() {
      //This function is called after we finish loading new country image
      //and stop showing refresh circle gif image.
      //TODO: animation
      document.getElementById("countryPhoto").style.opacity = 1;
      document.getElementById("loading").style.display = "none";
      document.getElementById("refreshBtn").style.display = ""; //to default display value
      document.getElementsByClassName('container')[0].style.opacity = 1; // we need this when new game's first image loaded.
    }



    /**
     * util
     */
    function randomIndex(arryLength) {
      // function to pick random index from array;
      return Math.floor(Math.random() * arryLength);
    }




    /**
     * Game object
     */
    return {
      onUserInput: function (ev) {
        // method to process an input letter
        if (gameOverOrUserWon) return;
        var letter = ev.key;
        if (!isValidInput(ev)) return; // if not valid input, just ignore user input and finish function execution
        pushToLetterGuessed(letter); // if valid input, next step => add this letter to letter guessed input
        checkInputLetter(letter); //check if this letter is part of the selected captial
        viewUpdateAfterUserInput(letter); //update the view
        checkResult();
      },
      newGame: function () {
        // method for starting new game
        initializeView();
        if (selectCountry) initializeVariable(); // at first game, no need to initialize (already did it)
        loadRefreshCircle(); // refresh circle for picking a country and loading new photp
        selectCountry();
        viewUpdateAfterSelectingCountry();
        getCountryPhotos(selectedCountry, function () {
          getPhotoInfo(selectedCountryPhotoArray[randomIndex(selectedCountryPhotoArray.length)].id, loadPhoto);
        });
      },
      getAnotherPhoto: function () {
        // method for showing another photo;
        loadRefreshCircle();
        if (!selectedCountryPhotoArray.length) this.newGame();
        else {
          getPhotoInfo(selectedCountryPhotoArray[randomIndex(selectedCountryPhotoArray.length)].id, loadPhoto);
        }
      }
    }
  }());
  hangman.newGame();
  document.body.addEventListener("keyup", hangman.onUserInput);
  document.getElementById("newGameBtn-c").addEventListener("click", hangman.newGame);
  document.getElementById("newGameBtn-g").addEventListener("click", hangman.newGame);
  document.getElementById("refreshBtn").addEventListener("click", hangman.getAnotherPhoto.bind(hangman));



})(window, document, _countries);
