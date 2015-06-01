'use strict';

var timepikerConfig = {
  MINUTE_STEP: 15,
  HOUR_STEP: 1,
  MERIDIAN_ON: 'hh:mm a',
  MERIDIAN_OFF: 'HH:mm'
};

/* @ngInject */
module.exports = function($document) {
  var directive = {
    restrict: 'E',
    transclude: false,
    template: require('./templates/time-picker.tpl.html'),
    link: link,
    scope: {
      inputTime: '=ngModel',
      showMeridian: '=?',
      disabled: '=?'
    }
  };

  return directive;

  function link(scope, elem, attr) {

    var notShowMeridian = false, defaultPlaceholder = '';

    scope.disabled = scope.disabled === true || attr.disabled === 'disabled';

    //not to expose minute steps nd hour syeps as APIs
    scope.minuteStep = timepikerConfig.MINUTE_STEP;
    scope.hourStep = timepikerConfig.HOUR_STEP;

    notShowMeridian = scope.showMeridian === false ||
      scope.$eval(attr.showMeridian) === false;
    scope.showMeridian = !notShowMeridian;

    defaultPlaceholder = scope.showMeridian ?
      timepikerConfig.MERIDIAN_ON : timepikerConfig.MERIDIAN_OFF;
    scope.placeholder = attr.placeholder ? attr.placeholder : defaultPlaceholder;

    scope.isOpen = false;

    scope.isDisabled = function() {
      return scope.disabled === true || scope.$eval(scope.disabled) === true;
    };

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
  }
};
