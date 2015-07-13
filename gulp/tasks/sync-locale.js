'use strict';

var gulp = require('gulp');
var shell = require('shelljs');

// Gulp task to run sync-locale test to generate xunitreport
gulp.task('sync-locale', function() {
    shell.exec('npm run locale-jenkins');
});
