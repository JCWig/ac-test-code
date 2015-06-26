'use strict';
var debounce = require('lodash/function/debounce');
var angular = require('angular');

/* @ngInject */
module.exports = function($timeout) {
  return {
    restrict: 'A',
    scope: {
      akamTextOverflow: '='
    },
    link: function(scope, element) {
      function giveTitles() {
        $timeout(function() {
          var scrollWidth = element[0].scrollWidth;
          var width = element[0].offsetWidth;

          if (scrollWidth > width) {
            element.prop('title', scope.akamTextOverflow.trim());
          } else {
            element.removeAttr('title');
          }
        }, 100);
      }
      angular.element(window).on('resize', debounce(giveTitles, 200));
      scope.$watch('akamTextOverflow', function() {
        giveTitles();
      });
      giveTitles();
    }
  };
};