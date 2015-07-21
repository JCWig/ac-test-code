'use strict';

var istanbul = require('browserify-istanbul');
var jenkins = !!require('yargs').argv.jenkins;

module.exports = function(config) {
  config.set({
    colors: !jenkins,
    browserNoActivityTimeout: 60000,
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'dist/akamai-core.min.css',
      {pattern: 'dist/images/*', included: false, served: true},
      'node_modules/moment/moment.js',

      'spec/!(mega-menu)/**/*.js',

      // load the mega menu tests last because they seem to not clean up the environment
      // properly and several message-box and modal-window tests end up failing
      'spec/mega-menu/**/*.js'
    ],
    logLevel: config.LOG_ERROR,
    frameworks: ['browserify', 'jasmine', 'jquery-2.1.0', 'sinon'],
    preprocessors: {
      'spec/**/*.js': ['browserify']
    },
    browsers: ['PhantomJS'],
    reporters: ['spec', 'junit', 'coverage'],
    browserify: {
      transform: [
        'babelify',
        istanbul({
          ignore: ['**/*.html', '**/spec/**', '**/*.hbs']
        })
      ]
    },
    junitReporter: {
      outputFile: 'reports/unit/unit.xml'
    },
    coverageReporter: {
      dir: 'reports/coverage/',
      reporters: [
        { type: 'html' },
        { type: 'cobertura' },
        { type: 'text-summary' }
      ]
    }
  });
};
