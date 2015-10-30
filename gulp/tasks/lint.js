'use strict';

var gulp = require('gulp'),
  fs = require('fs'),
  path = require('path'),
  eslint = require('gulp-eslint'),
  mkdirp = require('mkdirp');

var config = require('../config');

gulp.task('lint', function() {
  mkdirp.sync(config.lint.path);

  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.format('junit', fs.createWriteStream(path.join(config.lint.path, config.lint.file))))
    .pipe(eslint.failAfterError());
});
