'use strict';

var angular = require('angular'),
  cookies = require('angular-cookies'),
  contextModule = require('../context'),
  dataService = require('./mega-menu-data-service'),
  header = require('./mega-menu-header-directive'),
  footer = require('./mega-menu-footer-directive');

// This includes the account name and the account ID, concatenated with the contract name,
// separated by a double tilde "~~". The whole string is base64 encoded.
var ACCOUNT_COOKIE = 'AKALASTMANAGEDACCOUNT';

// infamous GA include
require('./utils/ga');

/**
 * @ngdoc overview
 * @name akamai.components.mega-menu
 * @requires ngCookies
 * @requires akamai.components.context
 * @description a module for the old mega menu.
 */
/* @ngInject */
module.exports = angular.module('akamai.components.mega-menu', [
  cookies,
  contextModule.name
])
  /**
   * @ngdoc service
   * @name akamai.components.mega-menu.service:megaMenuData
   * @description Private service. Used to fetch data needed to render the mega menu
   * @private
   */
  .service('megaMenuData', dataService)

  /**
   * @ngdoc directive
   * @name akamai.components.mega-menu.directive:akamMenuHeader
   * @restrict E
   * @description Renders the mega menu header
   */
  .directive('akamMenuHeader', header)

  /**
   * @ngdoc directive
   * @name akamai.components.mega-menu.directive:akamMenuFooter
   * @restrict E
   * @description Renders the mega menu footer
   */
  .directive('akamMenuFooter', footer)

  /**
   * Tries to read the AKALASTMANAGEDACCOUNT cookie and set it as the current account. Also throws
   * an error if this application is group aware but doesn't provide a GID in the route params.
   */
  .run(function($window, $location, $cookies, context, LUNA_GROUP_QUERY_PARAM) {
    var cookie = $cookies.get(ACCOUNT_COOKIE),
      qs = $location.search(),
      base64EncodedCookie, id = null, name = '';

    // splits out the contract identifier from the account name. Uses substring because we want
    // to cause a -1 index to return the whole string. Slice doesn't do that.
    if (cookie) {
      base64EncodedCookie = $window.atob($cookies.get(ACCOUNT_COOKIE)).split('~~');
      id = base64EncodedCookie[1];
      name = base64EncodedCookie[0].substring(1, base64EncodedCookie[0].lastIndexOf('_'));
    }

    context.account = {
      id: id,
      name: name
    };

    if (context.isGroupContext()) {
      if (!qs[LUNA_GROUP_QUERY_PARAM]) {
        throw Error('Required query param "' + LUNA_GROUP_QUERY_PARAM + '" missing from URL');
      } else {
        context.group = $window.parseInt(qs[LUNA_GROUP_QUERY_PARAM], 10);
      }
    }

  });
