'use strict';

var istanbul = require('browserify-istanbul');
var ngannotate = require('browserify-ngannotate');

module.exports = function(config) {
    config.set({
        browserNoActivityTimeout : 60000,
        files: [
            'node_modules/angular/angular.min.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'dist/akamai-core.min.css',
            {pattern: 'dist/images/*', included: false, served: true},
            'node_modules/moment/moment.js',
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
                ngannotate,
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
                //{ type: 'html' },
                { type: 'cobertura' },
                { type: 'text-summary' }
            ]
        }
    });
};
