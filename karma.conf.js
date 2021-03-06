'use strict';

var istanbul = require('browserify-istanbul');
var args = require('yargs').argv;
var jenkins = !!args.jenkins;

module.exports = function(config) {

  var baseFileList = [
    {pattern: 'node_modules/angular/angular.js', watched: false },
    {pattern: 'node_modules/angular-mocks/angular-mocks.js', watched: false },
    {pattern: 'dist/akamai-core.min.css', watched: false },
    {pattern: 'dist/images/*', included: false, served: true},
    {pattern: 'node_modules/moment/moment.js', watched: false }
  ];

  var preprocessorPattern = args.testDir ? 'test/' + args.testDir + '/**/*.js' : 'test/**/*.js';

  var filesToTest = baseFileList.concat(
    args.testDir ? [
      {
        pattern: preprocessorPattern,
        watched: false
      }
    ] : 'test/**/*.js'
  );

  var preProcessors = {};

  preProcessors[preprocessorPattern] = ['browserify'];

  config.set({
    colors: !jenkins,
    browserNoActivityTimeout: 60000,
    files: filesToTest,
    logLevel: config.LOG_ERROR,
    frameworks: ['browserify', 'jasmine', 'jquery-2.1.0', 'sinon'],
    preprocessors: preProcessors,
    browsers: ['PhantomJS'],
    reporters: ['spec', 'junit', 'coverage'],
    browserify: {
      fast: true,
      transform: [
        'babelify',
        istanbul({
          ignore: ['**/*.html', '**/test/**', '**/*.hbs']
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
    },
    plugins: [
      // Karma will only require() these plugins
      'karma-browserify',
      'karma-jasmine',
      'karma-jquery',
      'karma-sinon',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-phantomjs-launcher',
      'karma-spec-reporter'
    ]
  });
};
