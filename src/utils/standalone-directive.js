'use strict';
var angular = require('angular');

/* @ngInject */
module.exports = function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      var wrapperDiv;
      var regex = /^akam-/;

      angular.forEach(element[0].classList, function(className) {
        //Needed for directives with replace = true
        if (className.match(regex)) {
          wrapperDiv = element[0];
        }
      });
      if (!wrapperDiv) {
        wrapperDiv = element[0].querySelector('[class^="akam-"]');
      }
      angular.element(wrapperDiv).addClass('standalone');
    }
  };
};