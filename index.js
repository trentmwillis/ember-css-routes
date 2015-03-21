/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var stylesDir;

/**
 * Recursive method to walk a directory and return a list of all it's files
 * @param {String} dir - A string representing the directory to walk
 * @param {String} relDir - A directory to make the results relative to
 * @return {Array} results
 */
var walkDir = function(dir, relDir) {
  var list = fs.readdirSync(dir);
  var relDir = relDir || dir;
  var results = [];
  var stat;

  list.forEach(function(file) {
    file = path.resolve(dir, file);
    stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file, relDir));
    } else {
      results.push(path.relative(relDir, file));
    }
  });

  return results;
}

module.exports = {
  name: 'ember-css-modules',
  included: function() {
    var styleFiles, styleMappings;
    stylesDir = path.join(this.app.project.root, 'app/styles');

    styleFiles = walkDir(stylesDir);
    styleMappings = {};

    styleFiles.forEach(function(file) {
      var fileRoot = file.split('.')[0];

      if (fileRoot.indexOf('styles') !== -1) {
        styleMappings[fileRoot] = path.join('assets', fileRoot + '.css');
      }
    });

    // Explicitly add the 'app' output, so it is named properly
    styleMappings['app'] = path.join('assets', this.app.name + '.css');

    this.app.options.outputPaths.app.css = styleMappings;
  }
};
