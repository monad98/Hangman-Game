/**
 * Created by monad on 1/30/17.
 */
export class Flickr {

  static flickrGetInfoURL: string = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=86efe8391d65d077f83708cd833ab990&photo_id=";
  static flickrSearchURL: string = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=86efe8391d65d077f83708cd833ab990&tags=";

  // method for fetching country photo using Flick API
  static getPhotoInfo(photoId: string) {

    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", Flickr.flickrGetInfoURL + photoId);
      xhr.onload =  () => {
        if (xhr.status === 200) {
          let photo = JSON.parse(xhr.responseText).photo;
          const photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
          resolve(photoStaticURL);
        } else {
          reject("Request failed. Status: " + xhr.status);
        }
      };
      xhr.send();
    });
  }

  static getCountryPhotos (countryName: string) {
    // function to get json array of selected country photo using Flickr Api
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", Flickr.flickrSearchURL + countryName);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText).photos.photo);
        } else {
          reject(new Error("Request failed. Status: " + xhr.status));
        }
      };
      xhr.send();
    });

  }
}