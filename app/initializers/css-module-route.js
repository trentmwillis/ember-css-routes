/**
 * This initializer adds a 'beforeModel' method to every route that makes it
 * check for CSS related to the route.
 */
import Ember from 'ember';

let alreadyRun = false;

/**
 * Generates the path to a stylesheet for a route based on the route's name
 * @param {String} route - A route name in the form given by 'routeName'
 * @return {String}
 */
function createStylesheetPath(route) {
  let path = route.split('.').join('/');
  return '/assets/' + path + '/styles.css';
}

/**
 * Creates a link element for the stylesheet for a given route
 * @param {String} route - A route name in the form given by 'routeName'
 * @return {HTMLLinkElement} link
 */
function createStylesheetLink(route) {
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = createStylesheetPath(route);
  return link;
}

/**
 * Determines if a route is an 'index' or 'application' route
 * @param {String} route - A route name in the form given by 'routeName'
 * @return {Boolean}
 */
function isIndexRoute(route) {
  return route.indexOf('index') !== -1 || route.indexOf('application') !== -1;
}

export function initialize() {
  // Don't run initializer more than once
  if (alreadyRun) { return; }

  alreadyRun = true;

  Ember.Route.reopen({
    /**
     * Checks if the CSS for the route has been loaded, if not it inserts a new
     * link element to load the stylesheet and returns a promise that resolves
     * when it has finished loading.
     * @return {Promise} promise
     */
    beforeModel: function() {
      /**
       * There are 3 cases where we don't load a CSS file:
       * 1. The route has specified there is no CSS file via 'noCSS'
       * 2. The CSS file has already been loaded
       * 3. The route is 'application' or an 'index' route (this is because
       *    'route.index' should have the same CSS file as 'route')
       */
      if (this.noCSS || this._cssLoaded || isIndexRoute(this.routeName)) { 
        return;
      }

      // Create the link element for the route's CSS file
      let link = createStylesheetLink(this.routeName);

      // Create a promise to let us know when the stylesheet is loaded
      let promise = new Promise((resolve, reject) => {
        // Check that the link has 'onload' and 'onerror' handlers
        if (link.hasOwnProperty('onload') && link.hasOwnProperty('onerror')) {
          link.onload = () => {
            this._cssLoaded = true;
            resolve();
          }

          // Even when an error is thrown, we don't fail out completely
          link.onerror = () => {
            resolve();
          }
        } else {
          // Use the old img.onerror hack to detect when stylesheet is loaded
          let img = document.createElement('img');
          img.onerror = function() {
            this._cssLoaded = true;
            resolve();
          }
          img.src = createStylesheetPath(this.routeName);
        }
      });

      document.head.appendChild(link);

      return promise;
    }
  });
};

export default {
  name: 'css-module-route',
  initialize: initialize
};
