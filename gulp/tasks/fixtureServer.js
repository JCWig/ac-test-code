'use strict';

var gulp = require('gulp'),
  fixtureServer = require('portal-fixture-server/server');

var config = {
  staticPaths: {
    '/': '.',
    '/libs/akamai-core/:version/': 'node_modules/akamai-core/dist',
    '/libs/akamai-core/:version/locales/': 'assets/locales'
  },
  proxy: {
    enabled: false,
    host: 'qa'
  },
  port: 3000
};

gulp.task('fixtureServer', ['build'], function(done) {
  fixtureServer.start(config);
  done();
});
