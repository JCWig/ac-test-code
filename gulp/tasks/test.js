'use strict';

var gulp = require('gulp');
var karma = require('karma');
var path = require('path');

var production = !!require('yargs').argv.production;

gulp.task('test', ['lint'], function() {
  karma.server.start({
    configFile: path.resolve('./karma.conf.js'),
    singleRun: production
  });
});