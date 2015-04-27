'use strict';

var gulp = require('gulp'),
  fs = require('fs'),
  eslint = require('gulp-eslint');

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.format('junit', fs.createWriteStream('reports/unit/lint.xml')))
    .pipe(eslint.failOnError());
});
