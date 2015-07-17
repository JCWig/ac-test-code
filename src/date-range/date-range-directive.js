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

  function notifyDatesChanged(scope, startValue, endValue) {
    $timeout(function() {
      scope.$broadcast('rangeDateChanged', {
        startDate: startValue,
        endDate: endValue
      });
    });
  }

  function DateRangeController($scope, $element, $attr) {
    var d = new Date();

    this.opened = false;
    this.rangeStart = {};
    this.rangeEnd = {};
    this.rangeStart.dateSelected = this.rangeEnd.dateSelected = false;

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
      var startValue = '',
        endValue = '';

      startValue =
        angular.isDefined(attr.startDate) && dr.startDate ? dr.startDate : '';
      dr.rangeStart.dateSelected = startValue !== '';

      endValue =
        angular.isDefined(attr.endDate) && dr.endDate ? dr.endDate : '';
      dr.rangeEnd.dateSelected = endValue !== '';

      if (startValue && endValue) {
        notifyDatesChanged(scope, startValue, endValue);
        scope.setViewValue(
          dateRangeService.getSelectedDateRange(startValue, endValue, dr.format));
      }

      dr.rangeStart.value = startValue;
      dr.rangeEnd.value = endValue;

      $timeout(function() {
        initialized = true;
        //interesting, have to wait for completed to here
        dr.format = dr.format || config.format;
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

      if (!initialized) {
        return;
      }

      dates = dateRangeService.evaluateStartDateChange(
        newVal, oldVal, dr.rangeStart, dr.rangeEnd);

      if (dates && dates.length === 2) {
        notifyDatesChanged(scope, dates[0], dates[1]);
        dateRange =
          dateRangeService.getSelectedDateRange(dates[0], dates[1], dr.format);
        scope.setViewValue(dateRange);
      }

      if (initialized) {
        dr.opened = true;
        dr.rangeStart.dateSelected = true;
      }
    });

    scope.$watch('dr.rangeEnd.value', function(newVal, oldVal) {
      var dateRange, dates;

      if (!initialized) {
        return;
      }

      dates = dateRangeService.evaluateEndDateChange(
        newVal, oldVal, dr.rangeStart, dr.rangeEnd);

      if (dates && dates.length === 2) {
        notifyDatesChanged(scope, dates[0], dates[1]);
        dateRange =
          dateRangeService.getSelectedDateRange(dates[0], dates[1], dr.format);
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
      startDate: '=?',
      endDate: '=?',
      isDisabled: '=?',
      format: '@?'
    },
    scope: {},
    link: linkFn,
    template: require('./templates/date-range.tpl.html')
  };
};

module.exports.$inject = ['translate', 'uuid', '$log', '$filter', '$timeout', 'dateRangeService'];
