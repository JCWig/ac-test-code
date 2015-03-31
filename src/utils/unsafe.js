'use strict';

/**
 * @ngdoc filter
 * @name akamai.components.utils.filter:unsafe
 * @description Trusts the input as HTML.
 * @param {String} text The text to trust as HTML
 */

/* @ngInject */
module.exports = function($sce) {

  function unsafe(text) {
    return $sce.trustAsHtml(text);
  }

  return unsafe;
};
