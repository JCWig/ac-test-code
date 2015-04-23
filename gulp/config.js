var pkg        = require('../package.json');
var path       = require('path');

var dest = './dist';
var src = './src';
var assets = './assets';
var reports = './reports';
var production = !!(require('yargs').argv.production);
var packageName = pkg.name;

var jsFileName = packageName + '.js';

module.exports = {
  productionBuild : production,
  browserSync: {
    server: {
      // Serve up our build folder
      baseDir: dest
    }
  },
  sass: {
    src: src + "/styles/**/*.scss",
    dest: dest,
    imagePath: 'assets/images' // Used by the image-url helper
  },
  images: {
    src: assets + "/images/**",
    dest: dest + "/images"
  },
  lint : {
    path : reports + '/unit/',
    file : 'jshint.xml'
  },
  browserify: {
    entries: [src],
    fullPaths: false,
    debug: true,
    outputName : jsFileName,
    dest : dest
  },
  production: {
    src : src,
    cssSrc: dest + '/*.css',
    jsSrc: path.join(dest, jsFileName),
    jsSrcMin: path.join(dest, packageName + '.min.js'),
    jsMinMap: packageName + '.min.js.map',
    dest: dest,
    reports: reports,
    packageName : pkg.name
  }
};