'use strict';

var istanbul = require('browserify-istanbul');
var args = require('yargs').argv;
var jenkins = !!args.jenkins;

module.exports = function(config) {

  var baseFileList = ['node_modules/angular/angular.js',
    'node_modules/angular-mocks/angular-mocks.js',
    'dist/akamai-core.min.css',
    {pattern: 'dist/images/*', included: false, served: true},
    'node_modules/moment/moment.js'];

  var allSourceFiles = [
    {pattern: 'spec/!(mega-menu)/**/*.js', watched: false},

    // load the mega menu tests last because they seem to not clean up the environment
    // properly and several message-box and modal-window tests end up failing
    {pattern: 'spec/mega-menu/**/*.js', watched : false}
  ];

  var filesToTest = filesToTest = baseFileList.concat(
    args.testDir ? [{pattern: 'spec/'+ args.testDir+'/**/*.js', watched: false}] : allSourceFiles
  );

  config.set({
    colors: !jenkins,
    browserNoActivityTimeout: 60000,
    files: filesToTest,
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
