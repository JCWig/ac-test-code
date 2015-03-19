'use strict';

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    config.set({
        browserNoActivityTimeout : 30000,
        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-translate/dist/angular-translate.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/pulsar-common-css/dist/styles.css',
            {pattern: 'node_modules/pulsar-common-css/dist/images/*', included: false, served: true},
            {pattern: 'node_modules/bootstrap/dist/fonts/*', included: false, served: true},
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/moment/moment.js',
            'test/*.js',
            'test/**/*.js',
            'node_modules/jasmine-utils/src/jasmine-utils.js'
        ],
        frameworks: ['browserify', 'jasmine'],
        preprocessors: {
            'test/**/*.js': ['browserify']
        },
        browsers: ['PhantomJS'],
        reporters: ['spec', 'junit', 'coverage'],
        browserify: {
            debug: true,
            transform: [
                istanbul({
                    ignore: ['**/*.html', 'test/**/*.js']
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
