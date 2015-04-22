/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.

   See browserify.bundleConfigs in gulp/config.js
*/

var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundle-logger');
var gulp         = require('gulp');
var gulpif       = require('gulp-if');
var handleErrors = require('../util/handle-errors');
var source       = require('vinyl-source-stream');
var config       = require('../config');
var _            = require('lodash');

var sourcemaps   = require('gulp-sourcemaps');
var ngAnnotate   = require('gulp-ng-annotate');
var buffer       = require('vinyl-buffer');

var browserifyTask = function(devMode) {

  var browserifyThis = function(bundleConfig) {

    if(devMode) {
      // Add watchify args and debug (sourcemaps) option
      _.extend(bundleConfig, watchify.args, { debug: true });
      // A watchify require/external bug that prevents proper recompiling,
      // so (for now) we'll ignore these options during development. Running
      // `gulp browserify` directly will properly require and externalize.
      bundleConfig = _.omit(bundleConfig, ['external', 'require']);
    }

    var b = browserify(bundleConfig);

    var bundle = function() {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);

      return b
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specify the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        .pipe(buffer())
        
        .pipe(gulpif(bundleConfig.debug, sourcemaps.init({loadMaps: true})))
        .pipe(ngAnnotate())
        .pipe(gulpif(bundleConfig.debug, sourcemaps.write('./')))

        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .pipe(browserSync.reload({
          stream: true
        }));
    };

    if(devMode) {
      // Wrap with watchify and rebundle on changes
      b = watchify(b);
      // Rebundle on update
      b.on('update', bundle);
      bundleLogger.watch(bundleConfig.outputName);
    } else {
      // Sort out shared dependencies.
      // b.require exposes modules externally
      if(bundleConfig.require) {
        b.require(bundleConfig.require);
      }
      // b.external excludes modules from the bundle, and expects
      // they'll be available externally
      if(bundleConfig.external) {
        b.external(bundleConfig.external);
      }
    }

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  return browserifyThis(config.browserify);

};

gulp.task('browserify', function() {
  return browserifyTask();
});

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;
