'use strict';

var browserSync = require('browser-sync');
var fs = require('fs');
var gulp = require('gulp');
var log = require('gulp-util').log;

gulp.task('browser-sync', ['build'], function() {
  browserSync({
    startPath: '/examples/index.html',
    injectChanges: true,
    server: {
      middleware: function(req, res, next) {
        var readStream, newLocationOfFile;
        var appsPattern = /apps\/.+\/locales\/(.+)/;
        var libsPattern = /libs\/.+\/locales\/(.+)/;

        var appsMatches = appsPattern.exec(req.originalUrl);
        var libsMatches = libsPattern.exec(req.originalUrl);

        if (!appsMatches && !libsMatches) {
          next();
          return;
        }

        newLocationOfFile = null;

        if (appsMatches) {
          newLocationOfFile = './examples/locales/json/messages/' + appsMatches[1];
        } else if (libsMatches) {
          newLocationOfFile = './assets/locales/' + libsMatches[1];
        }

        log('Overwriting the location', req.originalUrl, newLocationOfFile);

        fs.exists(newLocationOfFile, function(exists) {
          if (!exists) {
            log('Locale does not exist: ' + newLocationOfFile);
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
            return;
          }

          readStream = fs.createReadStream(newLocationOfFile);

          // We replaced all the event handlers with a simple call to readStream.pipe()
          readStream.pipe(res);
        });

      },
      baseDir: './',
      directory: true
    },
    files: [
      'dist/*', 'examples/*.html'
    ]
  });
});
