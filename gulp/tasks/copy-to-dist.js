var gulp = require('gulp');
var config = require('../config').production;

gulp.task('copy-to-dist', function() {
  gulp.src('assets/locales/**', {
    base: 'assets'
  })
    .pipe(gulp.dest(config.dest));
});