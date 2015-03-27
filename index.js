/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Recursive method to walk a directory and return a list of all it's files
 * with their paths relative to either a given directory or the directory
 * being walked
 * @param {String} dir - A string representing the directory to walk
 * @param {String} relDir - A directory to make the results relative to
 * @return {Array} results
 */
function walkDir(dir, relDir) {
  var fileList = fs.readdirSync(dir);
  var results = [];
  var stat, file;

  relDir = relDir || dir;

  for (var i=0, l=fileList.length; i<l; i++) {
    file = path.resolve(dir, fileList[i]);
    stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file, relDir));
    } else {
      results.push(path.relative(relDir, file));
    }
  }

  return results;
}

module.exports = {
  name: 'ember-css-routes',

  /**
   * @override
   * Creates a mapping of route stylesheets from the app/styles directory
   * to the assets directory.
   * @return {Void}
   */
  included: function() {
    var stylesDir = path.resolve(this.project.configPath(), '../../app/styles');
    var styleFiles = walkDir(stylesDir);
    var styleMappings = {};
    var filePath;

    for (var i=0, l=styleFiles.length; i<l; i++) {
      filePath = styleFiles[i].split('.')[0];

      if (filePath.indexOf('styles') !== -1) {
        styleMappings[filePath] = path.join('assets', filePath + '.css');
      }
    };

    // Explicitly add the 'app' output, so it is named properly
    styleMappings['app'] = path.join('assets', this.app.name + '.css');

    this.app.options.outputPaths.app.css = styleMappings;
  }
};
