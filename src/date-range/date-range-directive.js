var angular = require('angular');

module.exports = function(translate, uuid, $log, $timeout, drService) {

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
      //notify child scope if listen this event
      scope.$broadcast('dateRangeChanged', {
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
    this.rangeStart.selectedValue = this.rangeEnd.selectedValue = '';
    this.rangeSelected = false;

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

    drService.setStartMinMax(this.rangeStart, d);
    //drService.setEndMinMax(this.rangeEnd, d); //may not needed

    this.toggle = function(e) {
      preventOtherEvents(e);
      this.opened = !this.opened;
    };

    this.clearStartDate = function(e) {
      preventOtherEvents(e);
      this.rangeStart.selectedValue = '';
      this.rangeSelected = false;
    };

    this.clearEndDate = function(e) {
      preventOtherEvents(e);
      this.rangeEnd.selectedValue = '';
      this.rangeSelected = false;
    };

    function preventOtherEvents(e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      var startDate = '',
        endDate = '',
        cloneDate;

      startDate = angular.isDefined(attr.startDate) && dr.startDate ? dr.startDate : '';
      //dr.rangeStart.dateSelected = startDate !== '';

      endDate = angular.isDefined(attr.endDate) && dr.endDate ? dr.endDate : '';
      //dr.rangeEnd.dateSelected = endDate !== '';

      if (startDate && endDate) {
        //if startDate greater then endDate, swap date value
        if (startDate.getTime() > endDate.getTime()) {
          cloneDate = new Date(endDate);
          endDate = startDate;
          startDate = cloneDate;
        }
        notifyDatesChanged(scope, startDate, endDate);
        scope.setViewValue(drService.getSelectedDateRange(startDate, endDate, dr.format));
      }

      dr.rangeStart.selectedValue = startDate;
      dr.rangeEnd.selectedValue = endDate;

      $timeout(function() {
        initialized = true;
        //interesting, have to wait for $digest completed
        dr.format = dr.format || config.format;
      });
    };
/*
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

      dates = drService.evaluateStartDateChange(newVal, oldVal, dr.rangeStart, dr.rangeEnd);

      if (dates && dates.length === 2) {
        notifyDatesChanged(scope, dates[0], dates[1]);
        dateRange = drService.getSelectedDateRange(dates[0], dates[1], dr.format);
        scope.setViewValue(dateRange);
      }

      if (initialized) {
        dr.opened = true;
        dr.rangeStart.dateSelected = newVal !== '';
      }
    });

    scope.$watch('dr.rangeEnd.value', function(newVal, oldVal) {
      var dateRange, dates;

      if (!initialized) {
        return;
      }

      dates = drService.evaluateEndDateChange(newVal, oldVal, dr.rangeStart, dr.rangeEnd);

      if (dates && dates.length === 2) {
        notifyDatesChanged(scope, dates[0], dates[1]);
        dateRange = drService.getSelectedDateRange(dates[0], dates[1], dr.format);
        scope.setViewValue(dateRange);
      }

      if (initialized) {
        dr.opened = true;
        dr.rangeEnd.dateSelected = newVal !== '';
      }
    });
*/
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

module.exports.$inject = ['translate', 'uuid', '$log', '$timeout', 'dateRangeService'];
