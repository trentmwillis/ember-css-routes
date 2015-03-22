# Ember CSS Routes

This is an Ember add-on to allow CSS files to be broken up and served based on routes, rather than forcing a single CSS file for the entire application on initial load.

## Usage

The add-on looks for and compiles all files named `styles` within your `app/styles` folder. These are mapped to route based on the folder structure.

Ex: `app/styles/planet/earth/styles.scss` will be output as `assets/profile/view/styles.css` and loaded on the `profile/view` route.

_Note: current version has been verified to work with `broccoli-sass` and normal CSS_

### Route Opt-out

The implementation attempts to load a stylesheet for _all_ routes. In order to opt-out of loading a stylesheet, simply add the property `noCSS: true` to that route. Example:

```javascript
export default Ember.Route.extend({
  noCSS: true
});
```
