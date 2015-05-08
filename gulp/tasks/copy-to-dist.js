var gulp = require('gulp');
var config = require('../config').production;

gulp.task('copy-to-dist', function() {
  gulp.src([
    'assets/locales/**',
    'assets/images/head_sprite.png',
    'assets/images/search-icons.png'
  ], {
    base: 'assets'
  })
    .pipe(gulp.dest(config.dest));
});