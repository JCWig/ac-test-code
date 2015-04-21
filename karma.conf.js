'use strict';

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    config.set({
        browserNoActivityTimeout : 60000,
        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-translate/dist/angular-translate.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/pulsar-common-css/dist/styles.css',
            {pattern: 'node_modules/pulsar-common-css/dist/images/*', included: false, served: true},
            {pattern: 'node_modules/bootstrap/dist/fonts/*', included: false, served: true},
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/moment/moment.js',
            'spec/*.js',
            'spec/**/*.js'
        ],
        frameworks: ['browserify', 'jasmine'],
        preprocessors: {
            'spec/**/*.js': ['browserify']
        },
        browsers: ['PhantomJS'],
        reporters: ['spec', 'junit', 'coverage'],
        browserify: {
            debug: true,
            transform: [
                istanbul({
                    ignore: ['**/*.html', 'spec/**/*.js']
                })
            ]
        },
        junitReporter: {
            outputFile: 'target/reports/unit/unit.xml'
        },
        coverageReporter: {
            dir: 'target/reports/coverage/',
            reporters: [
                { type: 'html' },
                { type: 'cobertura' },
                { type: 'text-summary' }
            ]
        }
    });
};
