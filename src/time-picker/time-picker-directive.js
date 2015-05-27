'use strict';

var angular = require('angular');

var timepikerConfig = {
  MINUTE_STEP: 15,
  HOUR_STEP: 1
}

/* @ngInject */
module.exports = function($document) {
  var directive = {
    restrict: 'E',
    transclude: false,
    template: require('./templates/time-picker.tpl.html'),
    link: link,
    scope: {
      inputTime: '=ngModel',
      showMeridian: "=",
      placeholder: '@?'
    }
  };

  return directive;

  function link(scope, elem, attr) {

    scope.disabled = scope.$eval(attr.disabled) === true || attr.disabled === 'disabled';

    //not exposed as APIs
    scope.minuteStep = timepikerConfig.MINUTE_STEP;
    scope.hourStep = timepikerConfig.HOUR_STEP;
    scope.isOpen = false;

    elem.bind('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    $document.on('click', clickHandler);

    scope.$on('$destroy', function() {
      $document.off('click', clickHandler);
    });

    function clickHandler() {
      scope.$apply(function() {
        scope.isOpen = false;
      });
    }
  };

}
