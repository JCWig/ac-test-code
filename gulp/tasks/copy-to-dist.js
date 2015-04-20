var gulp      = require('gulp');
var config    = require('../config').production;

gulp.task('copy-to-dist', function() {
  return gulp.src('assets/locales/**')
      .pipe(gulp.dest(config.dest));
});