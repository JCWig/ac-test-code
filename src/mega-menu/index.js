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
 * @description a module for the old mega menu.
 */
/* @ngInject */
module.exports = angular.module('akamai.components.mega-menu', [
  cookies,
  contextModule.name
])
  .service('megaMenuData', dataService)
  .directive('akamMenuHeader', header)
  .directive('akamMenuFooter', footer)
  .run(function($window, $location, $cookies, context, LUNA_GROUP_QUERY_PARAM) {
    var cookie = $cookies.get(ACCOUNT_COOKIE),
      qs = $location.search(),
      base64EncodedCookie;

    if (cookie) {
      base64EncodedCookie = $window.atob($cookies.get(ACCOUNT_COOKIE)).split('~~');
      // splits out the contract identifier from the account name. Uses substring because we want
      // to cause a -1 index to return the whole string. Slice doesn't do that.
      context.account = {
        id: base64EncodedCookie[1].substring(1, base64EncodedCookie[1].lastIndexOf('_')),
        name: base64EncodedCookie[0]
      };
    }

    if (context.isGroupContext()) {
      if (!qs[LUNA_GROUP_QUERY_PARAM]) {
        throw Error('Required query param "' + LUNA_GROUP_QUERY_PARAM + '" missing from URL');
      } else {
        context.group = $window.parseInt(qs[LUNA_GROUP_QUERY_PARAM], 10);
      }
    }

  });
