var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(){
    runSequence('uglify-js', 'test', 'copy-to-dist');
});