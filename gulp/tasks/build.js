var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('build', function(){
    runSequence('clean', 'uglify-js', 'compass', 'test', 'copy-to-dist');
});