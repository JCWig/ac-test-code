var config  = require('../config').production;
var gulp    = require('gulp');
var uglify  = require('uglify-js');
var fs      = require('fs');

gulp.task('uglify-js', ['browserify'], function() {
    var result = uglify.minify(config.jsSrc, {
        sourceMapRoot : '../../',
        inSourceMap: config.jsSrc + '.map',
        outSourceMap: config.jsMinMap,
        sourceMappingURL : config.jsMinMap
    });
    
    fs.writeFile(config.jsSrcMin, result.code);
    fs.writeFile(config.jsSrcMin + '.map', result.map);
});
