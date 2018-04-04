/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   * @returns {string} URL
   */
  static get DATABASE_URL() {
    const port = 8000 // Change this to your server port
    return `http://localhost:${port}/data/restaurants.json`;
  }

  /**
   * This callback is called when a list of items are fetched.
   * @callback DBHelper~listCallback
   * @param {string} error
   * @param {Object[]} list
   */

  /**
   * This callback is called when an item is fetched.
   * @callback DBHelper~itemCallback
   * @param {string} error
   * @param {Object} item
   */

  /**
   * Fetch all restaurants.
   * @param {DBHelper~listCallback} callback
   */
  static fetchRestaurants(callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();
  }

  /**
   * Fetch a restaurant by its ID.
   * @param {number} id
   * @param {DBHelper~itemCallback} callback
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   * @param {string} cuisine
   * @param {DBHelper~listCallback} callback
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   * @param {string} neighborhood
   * @param {DBHelper~listCallback} callback
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   * @param {string} cuisine
   * @param {string} neighborhood
   * @param {DBHelper~listCallback} callback
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   * @param {DBHelper~listCallback} callback
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   * @param {DBHelper~listCallback} callback
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   * @param {Object} restaurant
   * @returns {string} URL
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Add a suffix to a file name
   * @param {string} fileName
   * @param {string} suffix
   * @returns {string} File name
   */
  static addSuffixToFileName(fileName, suffix) {
    return fileName.replace(/\./, function(match, offset, string) {
      return (offset > 0 ? '-' + suffix : '') + match;
    });
  }

  /**
   * Restaurant image URL.
   * @param {Object} restaurant
   * @returns {Array} URLs of responsive images
   */
  static imageUrlForRestaurant(restaurant) {
    let image = `/img/${restaurant.photograph}`;
    let mediumFile = DBHelper.addSuffixToFileName(image, 'medium');
    let smallFile = DBHelper.addSuffixToFileName(image, 'small');

    return [smallFile, `${mediumFile} 720w, ${smallFile} 360w`];
  }

  /**
   * Map marker for a restaurant.
   * @param {Object} restaurant
   * @param {google.maps.Map} map
   * @returns {google.maps.Marker} Map marker
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}

/**
 * Remove some focuses from map.
 * @param {google.maps.Map} map
 */
function removeMapFocus(map) {
  google.maps.event.addListener(map, "tilesloaded", function() {
    setTimeout(function() {
      document.querySelector('#map div[tabindex="0"]').setAttribute('tabindex','-1');
      document.querySelector('#map iframe').setAttribute('tabindex','-1');
    }, 3000);
  });
}