'use strict';

var gulp = require('gulp');
var karma = require('karma');
var path = require('path');
var production = require('../config').productionBuild;

gulp.task('test', ['lint', 'sync-locale'], function(done) {
  karma.server.start({
    configFile: path.resolve('./karma.conf.js'),
    singleRun: production
  },
  // the karma run is always asynchronous,
  // make sure to declare it's finished only when it executes the callback
  function(exitCode){
    done(exitCode);
  });
});