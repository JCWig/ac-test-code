'use strict';

var gulp = require('gulp');
var shell = require('shelljs');
var log = require('gulp-util').log;

// Gulp task to run sync-locale test to generate xunitreport
gulp.task('sync-locale', function() {
  if (shell.exec('npm run locale-jenkins').code !== 0) {
    log('errors found in locales files, exiting');
    shell.exit(1);
  }
});
