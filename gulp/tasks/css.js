'use strict';

var gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  minifyCss = require('gulp-minify-css'),
  gulpif = require('gulp-if'),
  sass = require('gulp-sass'),
  sassInlineImage = require('sass-inline-image'),
  autoprefixer = require('gulp-autoprefixer'),
  es = require('event-stream'),
  rename = require('gulp-rename'),
  buffer = require('vinyl-buffer');

var production = !!require('yargs').argv.production;

gulp.task('css', function() {
  
  var unminified = gulp.src('src/akamai-core.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      functions: sassInlineImage({ /* options */ })
    }))
    .pipe(autoprefixer({
        browsers: [
          'last 2 versions',
          'ie 10',
          'ie 11'
        ],
        cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));

  var minified = gulp.src('src/akamai-core.scss')
    .pipe(buffer())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulpif(production, sourcemaps.init()))
    .pipe(gulpif(production, sass({
      functions: sassInlineImage({ /* options */ })
    })))
    .pipe(gulpif(production, minifyCss()))
    .pipe(gulpif(production, sourcemaps.write('./')))
    .pipe(gulpif(production, gulp.dest('dist')));

  return es.concat(unminified, minified);
});