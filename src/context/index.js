'use strict';

var angular = require('angular'),
  cookies = require('angular-cookies'),
  contextProvider = require('./context-provider');

/**
 * @ngdoc overview
 * @name akamai.components.context
 * @requires ngCookies
 * @description a module that handles the various context switching methods in the portal.
 * For this version, we only handle group context switching.
 */
/* @ngInject */
module.exports = angular.module('akamai.components.context', [
  cookies
])

  /**
   * @ngdoc service
   * @name akamai.components.context.service:LUNA_GROUP_QUERY_PARAM
   * @description Constant value representing the query parameter that should be sent to set the
   * group ID.
   */
  .constant('LUNA_GROUP_QUERY_PARAM', 'gid')

  /**
   * @ngdoc service
   * @name akamai.components.context.service:LUNA_ASSET_QUERY_PARAM
   * @description Constant value representing the query parameter that should be sent to set the
   * asset (property) ID.
   */
  .constant('LUNA_ASSET_QUERY_PARAM', 'aid')

  /**
   * @ngdoc service
   * @name akamai.components.context.service:contextProvider
   * @description TODO: how does this work again?
   */
  .provider('context', contextProvider);