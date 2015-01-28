/**
 *
 *  Akamai Components
 *  Copyright 2015 Akamai Technologies Inc. All rights reserved.
 * 
 *  The baseline for this gulpfile was patterned off of the fantastic Google Web Starter Kit starting point:
 *  SEE: https://github.com/google/web-starter-kit/blob/master/gulpfile.js
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');
var del = require('del');
var minimist = require('minimist');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var watchify = require('watchify');
var plato = require('plato');
var rsync = require('rsyncwrapper').rsync;
var reload = browserSync.reload;

var karma = require('karma');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var bundleLogger = require('./gulp/util/bundle-logger');
var _ = require('lodash');

var packageObject = require('./package.json');

var outputDirectory = "dist";
var bundledFileName = packageObject.name + ".js";
var outputLocation = path.join(outputDirectory, bundledFileName);

var jsSources = 'src/**/*.js';

// Lint JavaScript
gulp.task('lint', function() {
    return gulp.src(jsSources)
        .pipe(reload({stream: true, once: true}))
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.jshint('./src/.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('lint-tests', function() {
    return gulp.src(['./tests/**/*.js'])
        .pipe(reload({stream: true, once: true}))
        .pipe($.plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.jshint('./test/.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('js', ['clean', 'lint'], function() {

    var bundler = browserify(_.extend(watchify.args, {
        entries: ['./src'],
        debug: true
    }));
    
    function bundle() {
        // create both a regular and a minified/uglified concatenated output that has a separate sourcemaps file
        bundleLogger.start(outputLocation);    
        var jsBundle = bundler.bundle()
            .pipe(source(bundledFileName))
            .pipe(buffer())
            .pipe($.ngAnnotate())
            .pipe(gulp.dest(outputDirectory))
            .pipe($.rename({extname: '.min.js'}))
            .pipe($.sourcemaps.init({loadMaps: true}))
            .pipe($.uglify())
            .pipe($.sourcemaps.write("./"))
            .pipe(gulp.dest(outputDirectory))
            .on('end', function() {
                bundleLogger.end(outputLocation);
            });
            
        return jsBundle;
    }

    if (global.isWatching) {
        bundler = watchify(bundler, { delay: 1000 });
        bundler.on('update', bundler);
    }

    return bundle();
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist/*', '!dist/.git', 'reports'], {dot: true}));

gulp.task('docs', ['js'], function() {
    return gulp.src(jsSources)
        .pipe($.ngdocs.process({
            title: "Akamai Components",
            html5Mode: false,
            scripts:
            [
                outputLocation
            ],
            styles: [
                "./node_modules/pulsar-common-css/dist/styles.css"
            ],
        }))
        .pipe(gulp.dest('./docs'));
});

gulp.task('deploy', function(){
    $.git.revParse({args:'--abbrev-ref HEAD'}, function (err, branchName) {
        $.util.log('current git branch: '+ branchName);
        //clean up branch name:
        var cleanBranchName = branchName.replace('feature/', '').replace(' ', '_');
        $.util.log('clean branch name: '+ cleanBranchName);
        
        var longFolderName = '315289/dev/jenkins/' + cleanBranchName;
        
        $.util.log('rsync destination: '+ longFolderName);
        
        //TODO: Handle scenarios where the folder needs to be generated on the server side
        rsync({
          ssh: true,
          src: ['./dist', './docs', 'node_modules/pulsar-common-css/dist'],
          dest: 'sshacs@lunahome.upload.akamai.com:' + longFolderName,
          recursive: true,
          args: ["--verbose", "--compress"]
        }, function(error, stdout, stderr, cmd) {
            $.util.log(stdout);
        });
    });
});

gulp.task('prepublish', function(cb){
    var knownOptions = {
      boolean: 'deploy',
      default: false
    };

    var options = minimist(process.argv.slice(2), knownOptions);
    
    if (options.deploy) {
        $.util.log('You have selected to generate the docs and publish the contents to netstorage');
        runSequence('docs','deploy', cb);
    }else{
        $.util.log('You have selected to only generate the docs');
        runSequence('docs', cb);
    }
});

gulp.task('test', function () {
  return karma.server.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  });
});

gulp.task('jscs', function() {
    gulp.src(jsSources)
        .pipe($.jscs());
});

gulp.task('plato', function(callback){
    var outputDir = './reports/plato';
    plato.inspect(jsSources, outputDir, {
      title: 'Akamai Components - Plato Report'
    }, function(report){
        callback();
    });
});

// Watch Files For Changes & Reload
gulp.task('serve', function () {
    browserSync({
      notify: false,
      // Customize the BrowserSync console logging prefix
      logPrefix: 'AKAM',
      // Run as an https by uncommenting 'https: true'
      // Note: this uses an unsigned certificate which on first access
      //       will present a certificate warning in the browser.
      // https: true,
      server: './'
    });
  
    var knownOptions = {
      boolean: ['docs', 'skipTests'], //option to watch and rebuild docs, it's a longer process - so use sparingly
      default: false
    };
    
    var options = minimist(process.argv.slice(2), knownOptions);
    
    if (options.docs) {
        $.util.log('Starting serve for API and Docs Gen');
    }else{
        $.util.log('Starting watch/serve for API and Docs Gen');
    }

    gulp.watch(['modules/*/*.tpl.html'], ['js', reload]);
    gulp.watch(['node_modules/pulsar-common-css/dist/**'], reload);
    // if the docs option was used, regenerate the docs and js, otherwise do the js alone
    gulp.watch(['modules/*/*.js', '!./modules/*/*.spec.js'], [options.docs ? 'docs' : 'js', reload]);
    
    if (!options.skipTests) {
        gulp.watch(['./modules/**/*.spec.js'], ['lint', 'test']);
    }
});

// TODO: See if this can be done away with since the 'serve' browserSync task is already doing similar things.
gulp.task('setWatch', function() {
    global.isWatching = true;
});


// Build Production Files, the Default Task
gulp.task('default', ['clean', 'docs', 'serve']);
