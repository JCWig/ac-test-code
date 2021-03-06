'use strict';

var gulp = require('gulp');
var del = require('del');
var config = require('../config').production;

// Clean Output Directory
gulp.task('clean', function(done) {
  del([config.reports, config.dest, config.docs], {dot: true}, function(){
    done();
  });
});