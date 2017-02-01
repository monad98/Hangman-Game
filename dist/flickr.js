"use strict";
/**
 * Created by monad on 1/30/17.
 */
var Flickr = (function () {
    function Flickr() {
    }
    // method for fetching country photo using Flick API
    Flickr.getPhotoInfo = function (photoId) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", Flickr.flickrGetInfoURL + photoId);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var photo = JSON.parse(xhr.responseText).photo;
                    var photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
                    resolve(photoStaticURL);
                }
                else {
                    reject("Request failed. Status: " + xhr.status);
                }
            };
            xhr.send();
        });
    };
    Flickr.getCountryPhotos = function (countryName) {
        // function to get json array of selected country photo using Flickr Api
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", Flickr.flickrSearchURL + countryName);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText).photos.photo);
                }
                else {
                    reject(new Error("Request failed. Status: " + xhr.status));
                }
            };
            xhr.send();
        });
    };
    return Flickr;
}());
Flickr.flickrGetInfoURL = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=86efe8391d65d077f83708cd833ab990&photo_id=";
Flickr.flickrSearchURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=86efe8391d65d077f83708cd833ab990&tags=";
exports.Flickr = Flickr;
