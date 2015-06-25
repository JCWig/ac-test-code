'use strict';

var angular = require('angular'),
  cookies = require('angular-cookies'),
  contextProvider = require('./context-provider');

/**
 * @ngdoc overview
 * @name akamai.components.context
 * @description a module that handles the various context switching methods in the portal.
 * For this version, we only handle group context switching.
 */
/* @ngInject */
module.exports = angular.module('akamai.components.context', [
  cookies
])
  .provider('context', contextProvider)
  .run(function($cookies, context) {

    if (!context.isStandaloneContext()) {
      context.setAccountCookie();
      context.setContextIdFromUrl();
    }

  });