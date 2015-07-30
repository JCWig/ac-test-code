'use strict';

var pkg = require('../package.json');
var path = require('path');

var dest = './dist';
var src = './src';
var assets = './assets';
var reports = './reports';
var docs = './docs';
var production = !!require('yargs').argv.production;
var packageName = pkg.name;

var jsFileName = packageName + '.js';

module.exports = {
  productionBuild: production,
  docs: {
    sources: [
      'akamai-core.js',
      'autocomplete/**/*.js',
      'content-panel/**/*.js',
      'date-picker/**/*.js',
      'dropdown/**/*.js',
      'list-box/**/*.js',
      'mega-menu/**/*.js',
      'message-box/**/*.js',
      'switch-button/**/*.js',
      'menu-button/**/*.js',
      'navigation/**/*.js',
      'indeterminate-progress/**/*.js',
      'modal-window/**/*.js',
      'status-message/**/*.js',
      'table/**/*.js'
    ],
    base: path.resolve(process.cwd(), src),
    outputDirectory: path.resolve(process.cwd(), docs)
  },
  browserSync: {
    server: {
      // Serve up our build folder
      baseDir: dest
    }
  },
  sass: {
    src: src + '/**/*.scss',
    dest: dest,
    imagePath: 'assets/images' // Used by the image-url helper
  },
  images: {
    src: assets + '/images/**',
    dest: dest + '/images'
  },
  lint: {
    path: reports + '/unit/',
    file: 'lint.xml'
  },
  browserify: {
    entries: [src + '/' + packageName],
    fullPaths: false,
    debug: true,
    outputName: jsFileName,
    dest: dest
  },
  production: {
    src: src,
    cssSrc: dest + '/*.css',
    jsSrc: path.join(dest, jsFileName),
    jsSrcMin: path.join(dest, packageName + '.min.js'),
    jsMinMap: packageName + '.min.js.map',
    dest: dest,
    reports: reports,
    docs: docs,
    packageName: pkg.name
  }
};