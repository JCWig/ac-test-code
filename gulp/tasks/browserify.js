var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var mkdirp = require('mkdirp');
var pkg = require('../../package.json');
var path = require('path');
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');

var jsFilename = pkg.name + '.js';
var jsMinFilename = pkg.name + '.min.js';
var target = 'target/dist';
var bundlePath = path.join(target, jsFilename);

var bundleLogger = require('../util/bundle-logger');

var _ = require('lodash');

gulp.task('browserify', function() {
    mkdirp.sync('./build/dist');
    
    var bundler = browserify(_.extend(watchify.args, {
        entries: ['./src'],
        fullPaths: false,
        debug: true
    }));

    function bundle() {
        bundleLogger.start('browserify');
        var unminified = bundler.bundle()
            .pipe(source(jsFilename))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(plugins.ngAnnotate())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(target));

        var minified = bundler.bundle()
            .pipe(source(jsMinFilename))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(plugins.ngAnnotate())
            .pipe(plugins.uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(target))
            .on('end', function() {
                bundleLogger.end('browserify');
            });

        return es.concat(unminified, minified);
    }

    if (global.isWatching) {
        bundler = watchify(bundler, { delay: 1000 });
        bundler.on('update', bundle);
    }

    return bundle();
});