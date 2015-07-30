'use strict';

var gulp = require('gulp');
var karma = require('karma');
var path = require('path');
var production = require('../config').productionBuild;

gulp.task('test', ['lint', 'sync-locale'], function() {
  karma.server.start({
    configFile: path.resolve('./karma.conf.js'),
    singleRun: production
  });
});