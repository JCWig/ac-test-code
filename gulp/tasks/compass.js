var gulp = require('gulp');
var config = require('../config').production;
var compass = require('gulp-compass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('compass', function() {
  gulp.src('./src/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: config.dest,
      sass: config.src,
      environment: 'development',
      debug: false
    }))
    .on('error', function(error) {
      // Would like to catch the error here 
      console.log(error);
      this.emit('end');
    })
    .pipe(rename({
      basename: config.packageName
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(minifyCSS({keepBreaks: true}))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
    .on('end', function() {
    });
});
