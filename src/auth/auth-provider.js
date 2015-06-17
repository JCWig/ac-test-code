'use strict';

var angular = require('angular');
var isRegExp = require('lodash/lang/isregexp');

/* @ngInject */
module.exports = function() {
  var blackListedUris = [];

  this.$get = function() {
    return {
      getBlacklistedUris: function() {
        return blackListedUris;
      }
    };
  };

  this.setBlacklistedUris = function(uris) {
    if ( angular.isArray(uris) ) {
      blackListedUris = uris;
    }else if (angular.isString(uris) || isRegExp(uris) ) {
      blackListedUris = [uris];
    }
  };
};