'use strict';

var gulp = require('gulp');
var karma = require('karma');
var path = require('path');

gulp.task('test', ['lint'], function() {
  karma.server.start({
    configFile: path.resolve('./karma.conf.js'),
    singleRun: true
  });
});