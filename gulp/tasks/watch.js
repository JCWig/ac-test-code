/* Notes:
 - gulp/tasks/browserify.js handles js recompiling with watchify
 - gulp/tasks/browserSync.js watches and reloads compiled files
 */

'use strict';

var gulp = require('gulp');
var config = require('../config');

gulp.task('watch', ['watchify', 'browser-sync'], function() {
  gulp.watch('assets/**', ['copy-to-dist']);
  gulp.watch('src/**/*.scss', ['css']);
});
