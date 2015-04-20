var gulp      = require('gulp');
var del       = require('del');
var config    = require('../config').production;

// Clean Output Directory
gulp.task('clean', function(){
    del(['build'], {dot: true});
});