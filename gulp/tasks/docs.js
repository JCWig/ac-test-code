'use strict';

var gulp = require('gulp');
var akamaiDocs = require('akamai-docs');
var bundleLogger = require('../util/bundle-logger');
var config = require('../config');

console.log('config', config.docs);
gulp.task('docs', ['clean'], function() {
  akamaiDocs({
    sources: config.docs.sources,
    base: config.docs.base,
    output: config.docs.outputDirectory
  })
    .then(function(docs){
      console.log(docs.length, 'docs generated');
    })
    .catch(function(error) {
      console.log(error);
      process.exit(1);
    });
});
