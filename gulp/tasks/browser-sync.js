var browserSync = require('browser-sync');
var fs          = require('fs');
var gulp        = require('gulp');
var config      = require('../config').browserSync;

gulp.task('browser-sync', function() {
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
            'dist/*', 'examples/*.html'
        ]
    });
});
