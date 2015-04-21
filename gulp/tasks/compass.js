var gulp      = require('gulp');
var config    = require('../config').production;
var compass   = require('gulp-compass');

gulp.task('compass', function() {
  gulp.src('./src/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: 'target/dist',
      sass: 'src'
    }))
    .on('error', function(error) {
      // Would like to catch the error here 
      console.log(error);
      this.emit('end');
    });
    //.pipe(gulp.dest(config.dest));
});