// https://api.flickr.com/services/rest/



(function (window, document, capitalCities) {


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
    var selectedCityPhotoArray = [];
    var selectedCapital = '';
    var letterGuessed = [];
    var remainingGuess = 6;
    var currentGuessedWord = [];

    /**
     * Select a random capital city and make a same length hidden word to show to user
     */
    function selectCapital() {
      //TODO: check non english character included in city name 
      selectedCapital = capitalCities[randomIndex(capitalCities.length)].capital; //pick random capital city
      currentGuessedWord = selectedCapital //Hide selected capital city name.
        .split("") // to array
        .map(function (letter) {
          if (letter === " " || letter === "'") return letter;
          else return "_"; // if the letter is neither " " nor "'" , this letter is what we need to hide
        });
      console.log("SelectedCapital is " + selectedCapital);
      console.log("Hided captinal is " + currentGuessedWord.toString());
    }

    /**
     * Function to get selected photo's url from photo's id through Flickr Api
     */
    function getPhotoInfo(photoId, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', flickrGetInfoURL + photoId);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var photo = JSON.parse(xhr.responseText).photo;
          var photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
          callback(photoStaticURL);
        } else {
          alert('Request failed. Status: ' + xhr.status);
        }
      };
      xhr.send();
    }

    /**
     * Function to get json array of selected city photo using Flickr Api
     */
    function getCityPhotos(cityName, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', flickrSearchURL + cityName);
      xhr.onload = function () {
        if (xhr.status === 200) {
          selectedCityPhotoArray = JSON.parse(xhr.responseText).photos.photo;
          callback();
        } else {
          alert('Request failed. Status: ' + xhr.status);
        }
      };
      xhr.send();
    }

    /**
     * function to pick random index from array;
     */
    function randomIndex(arryLength) {
      return Math.floor(Math.random() * arryLength);
    }

    /**
     * function to show fetched photo to screen
     */
    function loadPhoto(photoUrl) {
      console.log("Loaded this photo: " + photoUrl);
      document.getElementById('capitalPhoto').src = photoUrl;
      setTimeout(function () {
        stopRefreshCircle();
      }, 1000);
    }

    /**
     * This function shows refresh circle git and hide previous capital image
     */
    function loadRefreshCircle() {
      document.getElementById('refreshBtn').style.display = "none";
      document.getElementById('capitalPhoto').style.opacity = 0;
      document.getElementById('loading').style.display = "block";
    }

    /**
     * This function is called after we finish loading new capital image
     * and stop showing refresh circle gif image.
     */
    function stopRefreshCircle() {
      //TODO: animation
      document.getElementById('capitalPhoto').style.opacity = 1;
      document.getElementById('loading').style.display = "none";
      document.getElementById('refreshBtn').style.display = ""; //to default display value
    }

    /**
     * check input letter is same as each letter in capital city
     */
    function checkInputLetter(letter) {
      console.log("You typed '" + letter + "'");
      var isThereMatchedLetter = false;
      selectedCapital
        .split("") //to array
        .forEach(function (c, index) {
          if (c.toLowerCase() === letter.toLowerCase()) {
            currentGuessedWord[index] = c;
            isThereMatchedLetter = true;
          }
        });
      if (!isThereMatchedLetter) remainingGuess -= 1;
      console.log(currentGuessedWord);
      updateGameStatsOnScreen(); //update the view
    }

    //TODO: implement 
    function updateGameStatsOnScreen() {
      // document.getElementById('currentGuessedWord').innerText = currentGuessedWord[i]
      document.getElementById('remainingGuess').innerText = remainingGuess;
    }

    // Initialize game variable
    function initializeVariable() {
      selectedCityPhotoArray = [];
      selectedCapital = '';
      letterGuessed = [];
      remainingGuess = 6;
      currentGuessedWord = [];
    }

    /**
     * 1. check ramaining life and if remaining life is 0, user lose
     * 2. check if user got answer and if so, user win.
     */
    function checkResult() {
      if (remainingGuess === 0) return showUserLostMessage(); //user lost the game
      if (letterGuessed.join("") === selectedCapital) return showUserWonMessage(); //user won the game
    }

    //TODO: implement
    function showUserWonMessage() {
      
    }

    //TODO: implement
    function showUserLostMessage() {

    }


    /**
     * This function is called after checking validity of user input. 
     * This function add input letter to letterGuessed array.
     */
    function pushToLetterGuessed(letter) {
      letterGuessed.push(letter);
      //TODO: Sort;
      console.log("Current letterGuessed is " + letterGuessed.toString());
    }

    /**
     * function to check if input letter is valid. 
     * I check both keyCode and charCode here to prevent another language input and special keys like Shift..etc.
     */
    function isValidInput(ev) {
      var letter = ev.key;
      var charCode = letter.charCodeAt(0);
      var keyCode = ev.keyCode;
      console.log("Typed charcode is " + charCode);
      console.log("Typed keycode is " + keyCode);
      if (keyCode < 65 || keyCode > 90) return false; // A(a):65, Z(z):90, check keyCode is valide
      else if (charCode > 122 || charCode < 65 || (charCode > 90 && charCode < 97)) return false; // A: 65, Z:90, a: 97, z: 122
      else if (letterGuessed.indexOf(letter) > -1) return false; // already tried letter
      return true; // user input a letter which has not been typed before, so valid input
    }

    //delete user input from input element
    function resetInputElement() {
      document.getElementById("hangmanInput").value = '';
    }

    return {
      /**
       * method to process an input letter
       */
      onUserInput: function (ev) {
        var letter = ev.key;
        resetInputElement();
        if (!isValidInput(ev)) return; // if not valid input, just ignore user input and finish function execution
        pushToLetterGuessed(letter); // if valid input, next step => add this letter to letter guessed input
        checkInputLetter(letter); //check if this letter is part of the selected captial
        checkResult();
      },
      /**
       * method for starting new game
       */
      newGame: function () {
        initializeVariable();
        loadRefreshCircle(); // refresh circle for picking a capital city and loading new photp
        selectCapital();
        getCityPhotos(selectedCapital, function () {
          getPhotoInfo(selectedCityPhotoArray[randomIndex(selectedCityPhotoArray.length)].id, loadPhoto);
        });
      },
      /**
       * method for showing another photo;
       */
      getAnotherPhoto: function () {
        loadRefreshCircle();
        if (!selectedCityPhotoArray.length) this.newGame();
        else {
          getPhotoInfo(selectedCityPhotoArray[randomIndex(selectedCityPhotoArray.length)].id, loadPhoto);
        }
      }
    }
  }());
  // hangman.newGame();
  document.getElementById("hangmanInput").addEventListener("keyup", hangman.onUserInput.bind(hangman));
  document.getElementById("newGameBtn").addEventListener("click", hangman.newGame.bind(hangman));
  document.getElementById("refreshBtn").addEventListener("click", hangman.getAnotherPhoto.bind(hangman));





})(window, document, capitalCities);
