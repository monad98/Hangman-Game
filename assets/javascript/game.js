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
    var currentGuessedWord = '';

    function FlickrPhoto(title, owner, flickrURL, imageURL) {
      this.title = title;
      this.owner = owner;
      this.flickrURL = flickrURL;
      this.imageURL = imageURL;
    }

    function getPhotoInfo(photoId, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', flickrGetInfoURL + photoId);
      xhr.onload = function () {
        if (xhr.status === 200) {
          var photo = JSON.parse(xhr.responseText).photo;
          var photoTitle = photo.title._content;
          var photoOwner = photo.owner.realname;
          var photoWebURL = photo.urls.url[0]._content;
          var photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
          var flickrPhoto = new FlickrPhoto(photoTitle, photoOwner, photoWebURL, photoStaticURL);
          callback(flickrPhoto);
        } else {
          alert('Request failed.  Returned status of ' + xhr.status);
        }
      };
      xhr.send();
    }

    function getCityPhotos(cityName, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', flickrSearchURL + cityName);
      xhr.onload = function () {
        if (xhr.status === 200) {
          selectedCityPhotoArray = JSON.parse(xhr.responseText).photos.photo;
          callback();
        } else {
          alert('Request failed.  Returned status of ' + xhr.status);
        }
      };
      xhr.send();
    }

    function randomIndex(arryLength) {
      return Math.floor(Math.random() * arryLength);
    }

    function loadPhoto(photo) {
      console.log("Loaded this photo: " + photo.imageURL);
      document.getElementById('capitalPhoto').src = photo.imageURL;
      setTimeout(function() {
        stopRefreshCircle();
      }, 500);
    }

    function loadRefreshCircle() {
      document.getElementById('capitalPhoto').style.opacity = 0.2;
      document.getElementById('loading').style.display = "block";
    }
    function stopRefreshCircle() {
      document.getElementById('capitalPhoto').style.opacity = 1;
      document.getElementById('loading').style.display = "none";
    }

    return {
      onUserInput: function (ev) {
        console.log("You typed '" + ev.key + "'");
        document.getElementById("hangmanInput").value = '';
      },
      newGame: function () {
        loadRefreshCircle();
        selectedCapital = capitalCities[randomIndex(capitalCities.length)].capital;
        console.log("selectedCapital is " + selectedCapital);
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
