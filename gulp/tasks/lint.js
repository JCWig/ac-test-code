var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var mkdirp = require('mkdirp');
var config = require('../config');
var path   = require('path');

gulp.task('lint', function() {
    mkdirp.sync(config.lint.path);
    
    gulp.src('src/**/*.js')
        .pipe(jshint('src/.jshintrc'))
        .pipe(jshint.reporter('jshint-junit-reporter', { outputFile : path.join(config.lint.path, config.lint.file)}))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});