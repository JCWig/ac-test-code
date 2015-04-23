var gulp      = require('gulp');
var config    = require('../config').production;
var compass   = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var size      = require('gulp-filesize');
var rename    = require('gulp-rename');
var gulpif    = require('gulp-if');
var del       = require('del');
var path      = require('path');

gulp.task('compass', function() {
  gulp.src('./src/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: config.dest,
      sass: config.src,
      environment : 'development',
      debug : false
    }))
    .on('error', function(error) {
      // Would like to catch the error here 
      console.log(error);
      this.emit('end');
    })
    .pipe(rename({
        basename : config.packageName
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(size())
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(size())
    .on('end', function(){
        del([path.join(config.dest, 'index.css'), path.join(config.dest, 'index.css.map')], {dot: true});
    });
});