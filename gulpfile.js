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
        debug: true
    }));
    var startTime;

    function bundle() {
        startTime = process.hrtime();
        return bundler.bundle()
            .pipe(source(filename))
            .pipe(buffer())
            .pipe(plugins.ngAnnotate())
            .pipe(gulp.dest(target))
            .pipe(plugins.rename({ extname: '.min.js' }))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(target))
            .on('end', function() {
                var endTime = process.hrtime(startTime);
                plugins.util.log('Bundled',
                                 plugins.util.colors.green(bundlePath), 'in',
                                 plugins.util.colors.magenta(pretty(endTime)));
            });
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
            ],
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
        server: {
            baseDir: './',
            directory: true
        },
        startPath: '/examples/index.html',
        injectChanges: true,
        files: [
            bundlePath, 'node_modules/pulsar-common-css/dist/*.css', 'examples/*.html'
        ]
    });
});

gulp.task('setWatch', function() {
    global.isWatching = true;
});

gulp.task('linkCss', function(){
    var commonCssPath = '../pulsar-common-css';

    if( !fs.existsSync(commonCssPath) ){
        plugins.util.log('common css project does not exist at the expected path: ' + commonCssPath);
        return;
    }

    plugins.util.log('creating global npm link for common css project');

    plugins.shell.task(['cd ../pulsar-common-css/', 'npm link', 'cd ../akamai-components/', 'npm link pulsar-common-css'])();
});

gulp.task('unlinkCss', function(){
    var commonCssPath = '../pulsar-common-css';

    if( !fs.existsSync(commonCssPath) ){
        plugins.util.log('common css project does not exist at the expected path: ' + commonCssPath);
        return;
    }

    plugins.util.log('npm unlinking this project to the common css project');

    plugins.shell.task(['npm unlink pulsar-common-css', 'cd ../pulsar-common-css/', 'npm unlink', 'cd ../akamai-components/'])();
});

gulp.task('deploy', function(){
    plugins.git.revParse({args:'--abbrev-ref HEAD'}, function (err, branchName) {
        plugins.util.log('current git branch: '+ branchName);
        //clean up branch name:
        var cleanBranchName = branchName.replace('feature/', '').replace(' ', '_');
        plugins.util.log('clean branch name: '+ cleanBranchName);
        
        var longFolderName = '315289/dev/jenkins/' + cleanBranchName;
        
        plugins.util.log('rsync destination: '+ longFolderName);
        
        //TODO: Handle scenarios where the folder needs to be generated on the server side
        rsync({
          ssh: true,
          src: ['./dist', './examples', './node_modules'],
          dest: 'sshacs@lunahome.upload.akamai.com:' + longFolderName,
          exclude: globby.sync(["node_modules/.*", "node_modules/angular-*", "node_modules/!(angular|pulsar-common-css)/", "node_modules/pulsar-common-css/!(dist)", "node_modules/pulsar-common-css/.*"]),
          recursive: true,
          args: ["--copy-dirlinks", "--verbose", "--compress"],
          //dryRun: true
        }, function(error, stdout, stderr, cmd) {
            plugins.util.log(error, stdout);
        });
    });
});

gulp.task('copy-resources-to-dist', function() {
  return gulp.src('locales/**', { base: '.' } )
      .pipe(gulp.dest('dist'));
});

gulp.task('update-package-version', function(callback){
    var firstDashInVersion = pkg.version.indexOf('-');
    
    if (firstDashInVersion > -1) {
        plugins.util.log('update it to new dev version');
        
        var coreVersion = pkg.version.substr(0, firstDashInVersion);

        plugins.git.revParse({args:'HEAD'}, function (err, commitId) {
            var shortCommitId = commitId.substr(0, 6);
            var prereleaseVersion = coreVersion + "-" + moment().format("YYYYMMDDTHHmmss") + "-" + shortCommitId;
            
            plugins.util.log('new version: '+ prereleaseVersion);
            
            pkg.version = prereleaseVersion;
            
            fs.writeFile('package.json', JSON.stringify(pkg, null, 4), function(err) {
                if(err) {
                    plugins.util.log('error occurred', err);
                } else {
                    plugins.util.log('package.json version updated');
                }
                
                callback();
            }); 
        });
    }else{
        plugins.util.log('leave version as is');
        callback();
    }
});

gulp.task('prepare-release', function(){
    runSequence('build', 'update-package-version');
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['dist', 'reports'], {dot: true}));
