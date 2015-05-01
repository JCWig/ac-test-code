'use strict';

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    config.set({
        browserNoActivityTimeout : 60000,
        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-translate/dist/angular-translate.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'dist/akamai-core.css',
            {pattern: 'dist/images/*', included: false, served: true},
            'node_modules/moment/moment.js',
            'spec/**/*.js'
        ],
        frameworks: ['browserify', 'jasmine'],
        preprocessors: {
            'spec/**/*.js': ['browserify']
        },
        browsers: ['PhantomJS2'],
        reporters: ['spec', 'junit', 'coverage'],
        browserify: {
            debug: true,
            transform: [
                istanbul({
                    ignore: ['**/*.html', '**/spec/**']
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
