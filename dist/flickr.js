"use strict";
/**
 * Created by monad on 1/30/17.
 */
var Flickr = (function () {
    function Flickr() {
        this.flickrGetInfoURL = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=86efe8391d65d077f83708cd833ab990&photo_id=";
        this.flickrSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=86efe8391d65d077f83708cd833ab990&tags=";
    }
    // method for fetching country photo using Flick API
    Flickr.prototype.getPhotoInfo = function (photoId, callback) {
        // Function to get selected photo's url from photo's id through Flickr Api
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.flickrGetInfoURL + photoId);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var photo = JSON.parse(xhr.responseText).photo;
                var photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
                callback(photoStaticURL);
            }
            else {
                console.log("Request failed. Status: " + xhr.status);
            }
        };
        xhr.send();
    };
    Flickr.prototype.getCountryPhotos = function (countryName, callback) {
        // function to get json array of selected country photo using Flickr Api
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.flickrSearchURL + countryName);
        xhr.onload = function () {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText).photos.photo);
            }
            else {
                alert("Request failed. Status: " + xhr.status);
            }
        };
        xhr.send();
    };
    return Flickr;
}());
exports.Flickr = Flickr;
