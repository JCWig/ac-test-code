var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var mkdirp = require('mkdirp');
var config    = require('../config');

gulp.task('lint', function() {
    mkdirp.sync('./build/reports/unit/');
    
    gulp.src('src/**/*.js')
        .pipe(jshint('src/.jshintrc'))
        .pipe(jshint.reporter('jshint-junit-reporter', { outputFile : './build/reports/unit/jshint.xml'}))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});