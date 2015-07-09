var angular = require('angular');

module.exports = function($filter, translate) {
  var PICKER_TYPES = {
    day: 'day',
    month: 'month'
  };

  return {
    replace: true,
    restrict: 'E',
    require: 'ngModel',
    scope: {
      placeholder: '@',
      mode: '@',
      min: '@',
      max: '@',
      format: '@'
    },
    template: require('./templates/date-picker.tpl.html'),
    link: {
      pre: function(scope) {
        var format;

        scope.opened = false;
        scope.mode = scope.mode in PICKER_TYPES ?
          scope.mode : PICKER_TYPES.day;

        if (scope.mode === PICKER_TYPES.day) {
          format = scope.format || 'EEE, MMM dd, yyyy';
          scope.newFormat = format;
          if (!scope.placeholder) {
            translate.async('components.date-picker.placeholder.date').then(function(value) {
              scope.placeholder = value;
            });
          }
          scope.dateOptions = {
            startingDay: 0,
            showWeeks: false,
            autoclose: true,
            minMode: 'day',
            maxMode: 'day'
          };
        } else {
          format = scope.format || 'MMM yyyy';
          scope.newFormat = format;
          if (!scope.placeholder) {
            translate.async('components.date-picker.placeholder.month').then(function(value) {
              scope.placeholder = value;
            });
          }
          scope.dateOptions = {
            startingDay: 0,
            minMode: 'month',
            maxMode: 'month',
            showWeeks: false,
            datepickerMode: 'month',
            autoclose: true,
            formatMonth: 'MMM'
          };
        }
      },
      post: function(scope, element, attrs, ngModel) {
        var noClear = angular.isDefined(attrs.noClear) ? true : false;

        if (!ngModel) {
          return;
        }
        ngModel.$render = function() {
          scope.value =
            $filter('date')(ngModel.$modelValue, scope.format);
        };

        scope.change = function() {
          ngModel.$setViewValue(scope.value);
          ngModel.$setTouched();
        };

        scope.toggle = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          scope.opened = !scope.opened;
        };

        scope.showClear = function() {
          return scope.value && !noClear;
        };

        scope.clearDate = function() {
          scope.value = null;
          ngModel.$setViewValue(null);
        };

        scope.$watch('opened', function(newValue) {
          element.toggleClass('opened', newValue);
        });
      }
    }
  };
};

module.exports.$inject = ['$filter', 'translate'];
