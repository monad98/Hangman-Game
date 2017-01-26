// https://api.flickr.com/services/rest/



(function (window, document, capitalCities) {


  var hangman = (function () {
    var flickrApiKey = "86efe8391d65d077f83708cd833ab990";
    var flickrGetInfoURL = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=" + flickrApiKey + "&photo_id=";
    var flickrSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=" + flickrApiKey + "&tags=";
    var selectedCityPhotoArray = [];

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
          var data = JSON.parse(xhr.responseText);
          var photo = data.photo;
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
            console.log(selectedCityPhotoArray);
            callback();
          } else {
            alert('Request failed.  Returned status of ' + xhr.status);
          }
        };
        xhr.send();
      }


    return {

      selectedCityPhotoArray: [],
      onUserInput: function (ev) {
        console.log("You typed '" + ev.key + "'");
      },
      newGame: function () {
        var selectedCapitalIndex = Math.floor(Math.random() * capitalCities.length);
        var selectedCapital = capitalCities[selectedCapitalIndex].capital;
        console.log("selectedCapital is " + selectedCapital);
        console.log(getCityPhotos);
        getCityPhotos(selectedCapital, function () {
          var selectedPhotoIndex = Math.floor(Math.random() * selectedCityPhotoArray.length);
          getPhotoInfo(selectedCityPhotoArray[selectedPhotoIndex].id, function (photo) {
            console.log(photo.imageURL);
            document.body.style.backgroundImage = "url('" + photo.imageURL + "')";
          });

        });
      }


    }
  }());
  document.getElementById("hangmanInput").addEventListener("keyup", hangman.onUserInput);
  document.getElementById("newGameBtn").addEventListener("click", hangman.newGame);






})(window, document, capitalCities);
