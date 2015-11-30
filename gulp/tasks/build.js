'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(callback) {
  runSequence('browserify', 'css', 'copy-to-dist', callback);
});