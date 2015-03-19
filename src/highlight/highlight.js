'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($sce) {

  return highlight;

  function highlight(text, phrase) {
    phrase = phrase.trim();

    var asDom = convertToDOM(text),
        regexp = new RegExp('(' + phrase + ')', 'gi');

    if (phrase && asDom.length === 0) {
      text = text.replace(regexp, '<span class="highlighted">$1</span>');
    }

    return $sce.trustAsHtml(text);
  }

  function convertToDOM(text) {
    var asDom;
    try {
      asDom = angular.element(text);
    } catch(e) {
      // the inputted text has some characters that jqlite don't recognize as a DOM string (or the input simply isn't wrapped)
      asDom = angular.element('<span>' + text + '</span>');
    }

    return asDom;
  }

};
