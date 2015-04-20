'use strict';

/*
  Akamai Components
  Copyright 2015 Akamai Technologies Inc. All rights reserved.

  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.
  
  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });



var gulp = require('gulp');
var runSequence = require('run-sequence');

var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');
var watchify = require('watchify');
var karma = require('karma');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var pretty = require('pretty-hrtime');
var pkg = require('./package.json');
var path = require('path');

var fs = require('fs');
var mkdirp = require('mkdirp');
var rsync = require('rsyncwrapper').rsync;
var globby = require('globby');

var moment = require('moment');


var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');

var jsFilename = pkg.name + '.js';
var jsMinFilename = pkg.name + '.min.js';
var cssFilename = pkg.name + '.css';
var target = 'dist';
var bundlePath = path.join(target, jsFilename);
var cssBundlePath = path.join(target, cssFilename);

var del = require('del');

// TODO support production argument to disable debug

gulp.task('serve', ['setWatch', 'browserify'], function() {
    browserSync({
        startPath: '/examples/index.html',
        injectChanges: true,
        server: {
            middleware: function (req, res, next) {
                var appsPattern = /apps\/.+\/locales\/(.+)/;
                var libsPattern = /libs\/.+\/locales\/(.+)/;

                var appsMatches = appsPattern.exec(req.originalUrl);
                var libsMatches = libsPattern.exec(req.originalUrl);

                if (!appsMatches && !libsMatches) {
                    next();
                    return;
                }

                var newLocationOfFile = null;

                if (appsMatches) {
                    newLocationOfFile = './examples/locales/json/messages/' + appsMatches[1];
                }else if (libsMatches) {
                    newLocationOfFile = './locales/' + libsMatches[1];
                }

                console.log("Overwriting the location", req.originalUrl, newLocationOfFile);

                fs.exists(newLocationOfFile, function(exists) {
                  if(!exists) {
                    console.log('Locale does not exist: ' + newLocationOfFile);
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.write('404 Not Found\n');
                    res.end();
                    return;
                  }

                  var readStream = fs.createReadStream(newLocationOfFile);

                  // We replaced all the event handlers with a simple call to readStream.pipe()
                  readStream.pipe(res);
                });

            },
            baseDir : './',
            directory : true
        },
        files: [
            bundlePath, cssBundlePath, 'examples/*.html'
        ]
    });

    // not the best place to put this but we can refactor into separate tasks later
    if(global.isWatching) {
        gulp.watch('locales/**', ['copy-resources-to-dist']);
    }
});

gulp.task('setWatch', function() {
    global.isWatching = true;
});

