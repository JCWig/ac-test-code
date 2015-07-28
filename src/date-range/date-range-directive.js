var angular = require('angular');

module.exports = function(translate, uuid, $log, $timeout, $rootScope, dateFilter, drService) {

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

      if (initialized) {
        return;
      }

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

      dr.rangeStart.selectedValue = dateFilter(startDate, dr.format);
      dr.rangeEnd.selectedValue = dateFilter(endDate, dr.format);

      $timeout(function() {
        initialized = true;
        //interesting, have to wait for $digest completed
        dr.format = dr.format || config.format;
      });
    };

    $rootScope.$on('rangeSelected', setAndNotifySelection);
    scope.$on('$destroy', setAndNotifySelection);

    scope.setViewValue = function(value, start, end) {
      //ngModel.$setViewValue(value);

      if (angular.isFunction(dr.onSelect) && attr.onSelect) {
        dr.onSelect({
          selectedDateRange: value
        });
      }
    };

    function setAndNotifySelection(e, info) {
      var start = info.selectedStart,
        end = info.selectedEnd,
        range = drService.getSelectedDateRange(start, end, dr.format);

      if (info.rangeSelected) {
        dr.rangeStart.selectedValue = dateFilter(start, dr.format);
        dr.rangeEnd.selectedValue = dateFilter(end, dr.format);
        scope.setViewValue(range, start, end);
        dr.opened = false;
      } else { //assuming only start date has value, calendar stay open
        dr.rangeStart.selectedValue = dateFilter(start, dr.format);
        dr.rangeEnd.selectedValue = end;
        $timeout(function() {
          scope.$apply('dr.opened = true');
        });
      }
    }
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

module.exports.$inject = ['translate', 'uuid', '$log', '$timeout', '$rootScope', 'dateFilter',
  'dateRangeService'
];
