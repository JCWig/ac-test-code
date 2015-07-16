var angular = require('angular');

module.exports = function(translate, uuid, $log, $filter, $timeout, dateRangeService) {

  var config = {
    options: {
      startingDay: 0,
      showWeeks: false,
      autoclose: true,
      minMode: 'day',
      maxMode: 'day'
    },
    format: 'EEE, MMM dd, yyyy'
  };

  function DateRangeController($scope, $element, $attr) {
    var d = new Date();

    this.opened = false;
    this.rangeStart = {};
    this.rangeEnd = {};
    this.rangeStart.dateSelected = this.rangeEnd.dateSelected = false;

    this.dateFormat = this.format || config.format;
    this.options = config.options;

    if ($attr.placeholder) {
      this.rangeStart.placeholder = this.rangeEnd.placeholder = $attr.placeholder;
    } else {
      translate.async('components.date-range.placeholder').then(function(value) {
        $scope.dr.rangeStart.placeholder = $scope.dr.rangeEnd.placeholder = value;
      });
    }

    this.rangeStart.id = 'akam-date-range-' + $scope.$id + '-' + uuid.guid();
    this.rangeEnd.id = 'akam-date-range-' + $scope.$id + '-' + uuid.guid();

    dateRangeService.setStartMinMax(this.rangeStart, d);
    dateRangeService.setEndMinMax(this.rangeEnd, d);

    this.toggle = function(e) {
      e.preventDefault();
      e.stopPropagation();

      this.opened = !this.opened;
    };
  }

  DateRangeController.$inject = ['$scope', '$element', '$attrs'];

  function linkFn(scope, elem, attr, ctrls) {
    var dr = ctrls[0],
      ngModel = ctrls[1],
      initialized = false;

    if (!ngModel) {
      $log.error('Missing ngModel, it is required to instantiate the date range component.');
      return;
    }

    ngModel.$render = function() {
      dr.rangeStart.value =
        angular.isDefined(attr.startDate) && this.startDate ? this.startDate : '';
      dr.rangeStart.dateSelected = dr.rangeStart.value !== '';

      dr.rangeEnd.value =
        angular.isDefined(attr.endDate) && this.endDate ? this.endDate : '';
      dr.rangeEnd.dateSelected = dr.rangeEnd.value !== '';

      if (dr.rangeStart.value && dr.rangeEnd.value) {
        scope.setViewValue(
          dateRangeService.append2DateString(dr.rangeStart.value, dr.rangeEnd.value));
      }

      $timeout(function() {
        initialized = true;
      });
    };

    scope.setViewValue = function(value) {
      ngModel.$setViewValue(value);

      //call back
      if (angular.isFunction(dr.onSelect) && attr.onSelect) {
        dr.onSelect({
          selectedDateRange: value
        });
      }
    };

    scope.$watch('dr.rangeStart.value', function(newVal, oldVal) {
      var dateRange, dates;

      if (dr.rangeStart.dateSelected) {
        if (newVal.getTime() > oldVal.getTime()) {
          dates = [oldVal, newVal];
        } else {
          dates = [newVal, oldVal];
        }
      } else if (dr.rangeEnd.dateSelected) { //rangeStart.dateSelected is true now
        dates = [newVal, new Date(dr.rangeEnd.value)];
      }

      if (dates && dates.length === 2) {
        $timeout(function() {
          scope.$broadcast('startDateChanged', {
            startDate: dates[0],
            endDate: dates[1]
          });
        });
        dateRange =
          dateRangeService.getSelectedDateRange(dates[0], dates[1], dr.dateFormat);
        scope.setViewValue(dateRange);
      }

      if (initialized) {
        dr.opened = true;
        dr.rangeStart.dateSelected = true;
      }
    });

    scope.$watch('dr.rangeEnd.value', function(newVal, oldVal) {
      var dateRange, dates;

      if (dr.rangeEnd.dateSelected) {
        if (newVal.getTime() > oldVal.getTime()) {
          dates = [oldVal, newVal];
        } else {
          dates = [newVal, oldVal];
        }
      } else if (dr.rangeStart.dateSelected) { //rangeEnd.dateSelected is true now
        dates = [new Date(dr.rangeStart.value), newVal];
      }

      if (dates && dates.length === 2) {
        $timeout(function() {
          scope.$broadcast('endDateChanged', {
            startDate: dates[0],
            endDate: dates[1]
          });
        });
        dateRange =
          dateRangeService.getSelectedDateRange(dates[0], dates[1], dr.dateFormat);
        scope.setViewValue(dateRange);
      }

      if (initialized) {
        dr.opened = true;
        dr.rangeEnd.dateSelected = true;
      }
    });
  }

  return {
    restrict: 'E',
    require: ['akamDateRange', '^ngModel'],
    controller: DateRangeController,
    controllerAs: 'dr',
    bindToController: {
      onSelect: '&',
      placeholder: '@?',
      startDate: '@?',
      endDate: '@?',
      isDisabled: '=?',
      format: '@?'
    },
    scope: {},
    link: linkFn,
    template: require('./templates/date-range.tpl.html')
  };
};

module.exports.$inject = ['translate', 'uuid', '$log', '$filter', '$timeout', 'dateRangeService'];
