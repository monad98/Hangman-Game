// https://api.flickr.com/services/rest/



(function (window, document, capitalCities) {


  var hangman = (function () {

    var flickrApiKey = "86efe8391d65d077f83708cd833ab990";
    var flickrGetInfoURL = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=" + flickrApiKey + "&photo_id=";
    var flickrSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=" + flickrApiKey + "&tags=";

    var selectedCityPhotoArray = [];
    var selectedCapital = '';
    var letterGuessed = [];
    var remainingGuess = 6;
    var currentGuessedWord = [];

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

    function loadRefreshCircle() {
      document.getElementById('refreshBtn').style.display = "none";
      document.getElementById('capitalPhoto').style.opacity = 0;
      document.getElementById('loading').style.display = "block";
    }

    function stopRefreshCircle() {
      //TODO: animation
      document.getElementById('capitalPhoto').style.opacity = 1;
      document.getElementById('loading').style.display = "none";
      document.getElementById('refreshBtn').style.display = ""; //to default display value
    }

    function checkThisLetter(letter) {
      console.log("You typed '" + letter + "'");
      selectedCapital
        .split("") //to array
        .forEach(function(c, index) {
          if(c === letter.toUpperCase()) currentGuessedWord[index] = c;
        });
        console.log(currentGuessedWord);
    }

    function pushToLetterGuessed(letter) {
      letterGuessed.push(letter);
      //TODO: Sort;
      console.log("Current letterGuessed is " + letterGuessed.toString());
    }


    /**
     * Select a random capital city and make a same length hidden word to show to user
     */
    function selectCapital() {
      selectedCapital = capitalCities[randomIndex(capitalCities.length)].capital.toUpperCase(); //pick random capital city
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
     * function to check if input letter is valid
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

    return {
      onUserInput: function (ev) {
        var letter = ev.key;
        document.getElementById("hangmanInput").value = ''; //delete user input from input element
        if (!isValidInput(ev)) return; // if not valid input, just ignore user input
        pushToLetterGuessed(letter); // add this letter to letter guessed input
        checkThisLetter(letter); //check if this letter is part of the selected captial
      },
      newGame: function () {
        loadRefreshCircle(); // refresh circle for picking a capital city and loading new photp
        selectCapital();
        getCityPhotos(selectedCapital, function () {
          getPhotoInfo(selectedCityPhotoArray[randomIndex(selectedCityPhotoArray.length)].id, loadPhoto);
        });
      },
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
