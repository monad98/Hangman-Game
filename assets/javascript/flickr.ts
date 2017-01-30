/**
 * Created by monad on 1/30/17.
 */
export class Flickr {

  flickrGetInfoURL: string = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&nojsoncallback=1&format=json&api_key=86efe8391d65d077f83708cd833ab990&photo_id=";
  flickrSearchURL: string = "https://api.flickr.com/services/rest/?method=flickr.photos.search&sort=relevance&format=json&nojsoncallback=1&per_page=50&api_key=86efe8391d65d077f83708cd833ab990&tags=";

  // method for fetching country photo using Flick API
  getPhotoInfo(photoId: string, callback: Function) {
    // Function to get selected photo's url from photo's id through Flickr Api
    let xhr = new XMLHttpRequest();
    xhr.open("GET", this.flickrGetInfoURL + photoId);
    xhr.onload =  () => {
      if (xhr.status === 200) {
        let photo = JSON.parse(xhr.responseText).photo;
        const photoStaticURL = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
        callback(photoStaticURL);
      } else {
        console.log("Request failed. Status: " + xhr.status);
      }
    };
    xhr.send();
  }

  getCountryPhotos (countryName: string, callback: Function) {
    // function to get json array of selected country photo using Flickr Api

    let xhr = new XMLHttpRequest();
    xhr.open("GET", this.flickrSearchURL + countryName);
    xhr.onload = () => {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText).photos.photo);
      } else {
        alert("Request failed. Status: " + xhr.status);
      }
    };
    xhr.send();
  }
}