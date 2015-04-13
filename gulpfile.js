/**
 *
 *  Akamai Components
 *  Copyright 2015 Akamai Technologies Inc. All rights reserved.
 */

'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var es = require('event-stream');
var watchify = require('watchify');
var karma = require('karma');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var _ = require('lodash');
var pretty = require('pretty-hrtime');
var pkg = require('./package.json');
var path = require('path');
var fs = require('fs');
var rsync = require('rsyncwrapper').rsync;
var globby = require('globby');
var moment = require('moment');
var runSequence = require('run-sequence');
var mkdirp = require('mkdirp');

var filename = pkg.name + '.js';
var target = 'dist';
var bundlePath = path.join(target, filename);
var del = require('del');

gulp.task('lint', function() {
    gulp.src('src/**/*.js')
        .pipe(plugins.jshint('src/.jshintrc'))
        .pipe(plugins.jshint.reporter('jshint-junit-reporter', { outputFile : './reports/unit/jshint.xml'}))
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
});

// TODO support production argument to disable debug
gulp.task('browserify', function() {
    var bundler = browserify(_.extend(watchify.args, {
        entries: ['./src'],
        fullPaths: false,
        debug: true
    }));
    var startTime;

    function bundle() {
        startTime = process.hrtime();
        var unminified = bundler.bundle()
            .pipe(source(filename))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(plugins.ngAnnotate())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(target));

        var minified = bundler.bundle()
            .pipe(source(pkg.name + '.min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(plugins.ngAnnotate())
            .pipe(plugins.uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(target))
            .on('end', function() {
                var endTime = process.hrtime(startTime);
                plugins.util.log('Bundled',
                                 plugins.util.colors.green(bundlePath), 'in',
                                 plugins.util.colors.magenta(pretty(endTime)));
            });

        return es.concat(unminified, minified);
    }

    if (global.isWatching) {
        bundler = watchify(bundler, { delay: 1000 });
        bundler.on('update', bundle);
    }

    return bundle();
});

gulp.task('build', function(){
    runSequence('test', 'browserify', 'copy-resources-to-dist');
});

gulp.task('docs', ['browserify'], function() {
    return gulp.src('src/**/*.js')
        .pipe(plugins.ngdocs.process({
            title: 'Akamai Components',
            html5Mode: false,
            scripts: [
                bundlePath,
                bundlePath + '.map'
            ],
            styles: [
                'node_modules/pulsar-common-css/dist/styles.css',
                'node_modules/pulsar-common-css/dist/styles.css.map'
            ]
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('serve-docs', ['docs'], function() {
    browserSync({
        server: {
            baseDir: './docs'
        }
    });
});

gulp.task('test', ['clean', 'lint'], function () {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });
});

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
                    console.log('Locale does not exist: ' + filename);
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
            bundlePath, 'node_modules/pulsar-common-css/dist/*.css', 'examples/*.html'
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

gulp.task('deploy', function(){
    plugins.git.revParse({args:'--abbrev-ref HEAD'}, function (err, branchName) {
        plugins.util.log('current git branch: '+ branchName);
        //clean up branch name:
        var cleanBranchName = branchName.replace('feature/', '').replace(' ', '_');
        plugins.util.log('clean branch name: '+ cleanBranchName);

        var longFolderName = '/315289/website/branches/' + cleanBranchName;

        plugins.util.log('rsync destination: '+ longFolderName);

        //TODO: Handle scenarios where the folder needs to be generated on the server side
        rsync({
          ssh: true,
          src: ['./dist', './examples', './node_modules'],
          dest: 'sshacs@lunahome.upload.akamai.com:' + longFolderName,
          exclude: globby.sync(["node_modules/.*", "node_modules/angular-*", "node_modules/!(angular|pulsar-common-css)/", "node_modules/pulsar-common-css/!(dist)", "node_modules/pulsar-common-css/.*"]),
          recursive: true,
          args: ["--copy-dirlinks", "--verbose", "--compress"]
          //dryRun: true
        }, function(error, stdout, stderr, cmd) {
            if (error) {
                plugins.util.log(error, stdout);
            }else{
                plugins.util.log(cmd);
                plugins.util.log(stdout);
            }
        });
    });
});

gulp.task('copy-resources-to-dist', function() {
  return gulp.src('locales/**', { base: '.' } )
      .pipe(gulp.dest('dist'));
});

// Clean Output Directory
gulp.task('clean', function(){
    mkdirp('./reports/coverage');
    mkdirp('./reports/unit');
    del(['dist', 'reports/unit/*', 'reports/coverage/*'], {dot: true});
});
