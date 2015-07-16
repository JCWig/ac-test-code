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
      var nextMonth = new Date();

      nextMonth.setMonth(nextMonth.getMonth() + 1);

      dr.rangeStart.value = attr.startDate
        ? dateRangeService.filterDate(attr.startDate, dr.dateFormat)
        : '';
      dr.rangeEnd.value = attr.endDate
        ? dateRangeService.filterDate(attr.endDate, dr.dateFormat)
        : '';
      scope.setViewValue(
        dateRangeService.append2DateString(dr.rangeStart.value, dr.rangeEnd.value));

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

    //those $watches can have chance to do some validation....
    scope.$watch('dr.rangeStart.value', function(newVal, oldVal) {
      var dateRange;

      if (dr.rangeEnd.value) {
        $timeout(function() {
          scope.$broadcast('startDateChanged', {
            startDate: newVal,
            endDate: new Date(dr.rangeEnd.value)
          });
        });
      }

      dateRange =
        dateRangeService.getSelectedDateRange(dr.rangeStart, dr.rangeEnd, dr.dateFormat);
      scope.setViewValue(dateRange);

      if (initialized) {
        dr.opened = true;
      }
    });

    scope.$watch('dr.rangeEnd.value', function(newVal, oldVal) {
      var dateRange;

      if (dr.rangeStart.value) {
        $timeout(function() {
          scope.$broadcast('endDateChanged', {
            endDate: newVal,
            startDate: new Date(dr.rangeStart.value)
          });
        });
      }

      dateRange =
        dateRangeService.getSelectedDateRange(dr.rangeStart, dr.rangeEnd, dr.dateFormat);
      scope.setViewValue(dateRange);

      if (initialized) {
        dr.opened = true;
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
