var config  = require('../config').production;
var gulp    = require('gulp');
var rename  = require('gulp-rename');
var size    = require('gulp-filesize');
var uglify  = require('gulp-uglify');

gulp.task('uglify-js', ['browserify'], function() {
  return gulp.src(config.jsSrc)
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(config.dest))
    .pipe(size());
});
