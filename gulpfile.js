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

var filename = pkg.name + '.js';
var target = 'dist';
var bundlePath = path.join(target, filename);

gulp.task('lint', function() {
    gulp.src('src/**/*.js')
        .pipe(plugins.jshint('src/.jshintrc'))
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

gulp.task('build', ['lint', 'test', 'browserify']);

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

gulp.task('test', ['lint'], function () {
    karma.server.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    });
});

gulp.task('serve', ['setWatch', 'browserify'], function() {
    browserSync({
        server: {
            baseDir: [
                'examples',
                'dist',
                'node_modules/pulsar-common-css/dist',
                'node_modules/angular'
            ]
        }
    });

    gulp.watch([bundlePath, 'examples/*.html'], function() {
        browserSync.reload();
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

