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

  function notifyNewRange(scope, startValue, endValue, id) {
    $timeout(function() {
      scope.$broadcast('initialDateRange', {
        startDate: startValue,
        endDate: endValue,
        id: id
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
    this.id = 'akam-date-range-' + $scope.$id + '-' + uuid.guid();

    if ($attr.placeholder) {
      this.rangeStart.placeholder = this.rangeEnd.placeholder = $attr.placeholder;
    } else {
      translate.async('components.date-range.placeholder').then(function(value) {
        $scope.dr.rangeStart.placeholder = $scope.dr.rangeEnd.placeholder = value;
      });
    }

    drService.setMinMaxDate(this.rangeStart, d);

    this.toggle = function(e) {
      preventOtherEvents(e);
      if (!this.isDisabled) {
        this.opened = !this.opened;
      }
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
      var start = '',
        end = '',
        clone;

      if (initialized) {
        return;
      }

      start = angular.isDefined(attr.startDate) && angular.isDate(dr.startDate) ? dr.startDate : '';
      end = angular.isDefined(attr.endDate) && angular.isDate(dr.endDate) ? dr.endDate : '';

      if (start && end) {
        //if startDate greater then endDate, swap date value
        if (start > end) {
          clone = new Date(end);
          end = start;
          start = clone;
        }

        dr.rangeStart.selectedValue = dateFilter(start, dr.format);
        dr.rangeEnd.selectedValue = dateFilter(end, dr.format);
        scope.setViewValue(drService.getSelectedDateRange(start, end, dr.format), start, end);
      }

      notifyNewRange(scope, start, end, dr.id);

      $timeout(function() {
        //interesting, have to wait for $digest completed
        dr.format = dr.format || config.format;
        initialized = true;
      });
    };

    scope.$watch('dr.format', function() {
      var start = dr.rangeStart.selectedValue,
        end = dr.rangeEnd.selectedValue;

      if (!initialized) {
        return;
      }
      if (start) {
        dr.rangeStart.selectedValue = dateFilter(new Date(start), dr.format);
      }
      if (end) {
        dr.rangeEnd.selectedValue = dateFilter(new Date(end), dr.format);
      }
    });

    //it needs to listen unique id for identify correct instance
    $rootScope.$on('rangeSelected', setRangeValues);
    scope.$on('$destroy', setRangeValues);

    scope.setViewValue = function(value, start, end) {
      //ngModel.$setViewValue(value);

      if (angular.isFunction(dr.onSelect) && attr.onSelect) {
        dr.onSelect({
          selectedDateRange: value,
          startDate: start,
          endDate: end
        });
      }
    };

    function setRangeValues(e, info) {
      var start = info.selectedStart,
        end = info.selectedEnd,
        range = drService.getSelectedDateRange(start, end, dr.format);

      //if it is not for you, don't handle it
      if (info.id && info.id !== dr.id) {
        return;
      }

      if (info.rangeSelected) {
        dr.rangeStart.selectedValue = dateFilter(start, dr.format);
        dr.rangeEnd.selectedValue = dateFilter(end, dr.format);
        scope.setViewValue(range, start, end);
        $timeout(function() {
          dr.opened = false;
        }, 1500);
      } else { //assuming only start date has value, calendar stay open
        dr.rangeStart.selectedValue = dateFilter(start, dr.format);
        dr.rangeEnd.selectedValue = end;
        $timeout(function() {
          dr.opened = true;
        }, 50);
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
