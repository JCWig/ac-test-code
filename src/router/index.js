'use strict';

var angular = require('angular');
var router = require('angular-new-router');

function dashCase(str) {
  return str.replace(/([A-Z])/g, function($1) {
    return '-' + $1.toLowerCase();
  });
}

/** @ngAnnotate */
module.exports = angular.module('akamai.components.router', [
  router
])
  .config(function($componentLoaderProvider) {
    $componentLoaderProvider.setTemplateMapping(function(name) {
      var dashName = dashCase(name);

      return './' + dashName + '/' + dashName + '.html';
    });
  });
