var angular = require('angular');

module.exports = function(translate, uuid, $log, $timeout, dateFilter,
  $rootScope, dateRangeService) {

  var config = {
    options: {
      startingDay: 0,
      showWeeks: false,
      autoclose: true,
      minMode: 'day',
      maxMode: 'day'
    },
    FORMAT: 'EEE, MMM dd, yyyy',
    DELAY_CLOSING: 1800,
    LABELS: {
      FROM: 'From',
      TO: 'To'
    }
  };

  function showRangePoint(scope, id, numberToSkip) {
    scope.$broadcast('moveRangePoint', {
      id: id,
      moveValue: numberToSkip
    });
  }

  function DateRangeController($scope, $element, $attr) {
    var d = new Date();

    if (!this.dateRange || !$attr.ngModel) {
      $log.error('ng-model is required for date range component directive.');
      return;
    }

    this.opened = false;
    this.rangeStart = {};
    this.rangeEnd = {};
    this.rangeStart.selectedValue = this.rangeEnd.selectedValue = '';
    this.rangeSelected = false;
    this.lastCloseOnRangeStart = true;
    this.openFromRangeStart = false;
    this.openFromRangeEnd = false;

    this.options = config.options;
    this.id = 'akam-date-range-' + $scope.$id + '-' + uuid.guid();

    if ($attr.placeholder) {
      this.rangeStart.placeholder = this.rangeEnd.placeholder = $attr.placeholder;
    } else {
      translate.async('components.date-range.placeholder').then(function(value) {
        $scope.dateRange.rangeStart.placeholder = $scope.dateRange.rangeEnd.placeholder = value;
      });
    }

    //they need to be getting from locale file
    this.labels = {
      from: config.LABELS.FROM,
      to: config.LABELS.TO
    };

    dateRangeService.setMinMaxDate(this.rangeStart, d);

    this.toggle = function(e) {
      preventOtherEvents(e);
      if (!this.isDisabled) {
        this.opened = !this.opened;
      }
    };

    this.rangeStartToggle = function(e) {
      if (this.opened) { //to close
        this.lastCloseOnRangeStart = true;
        this.openFromRangeStart = false;
        this.openFromRangeEnd = false;
      } else {
        if (!this.lastCloseOnRangeStart && this.rangeSelected) {
          //showRangePoint($scope, this.id, -4);
        }
        this.openFromRangeStart = true;
        this.openFromRangeEnd = false;
      }

      this.toggle(e);
    };

    this.rangeEndToggle = function(e) {
      if (this.opened) { //to close
        this.lastCloseOnRangeStart = false;
        this.openFromRangeStart = false;
        this.openFromRangeEnd = false;
      } else { //to open
        if (this.lastCloseOnRangeStart && this.rangeSelected) {
          //showRangePoint($scope, this.id, 4);

        }
        this.openFromRangeEnd = true;
        this.openFromRangeStart = false;
      }
      this.toggle(e);
    };

    function preventOtherEvents(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  DateRangeController.$inject = ['$scope', '$element', '$attrs'];

  function linkFn(scope, elem, attr, controller) {
    var initialized = false,
      range;

    function initialize() {
      var start = '',
        end = '',
        clone;

      if (initialized) {
        return;
      }

      start = controller.dateRange.startDate;
      end = controller.dateRange.endDate;

      if (start && end) {
        //if startDate greater then endDate, swap date value
        if (start > end) {
          clone = new Date(end);
          end = start;
          start = clone;
        }

        controller.rangeStart.selectedValue = dateFilter(start, controller.format);
        controller.rangeEnd.selectedValue = dateFilter(end, controller.format);
        controller.rangeSelected = true;

        range = dateRangeService.getSelectedDateRange(start, end, controller.format);
        scope.setViewValue(range, start, end);
      }

      $timeout(function() {
        //interesting, have to wait for $digest completed
        controller.format = controller.format || config.FORMAT;

        //send the event to child directive to handle with range values
        //use timeout to make sure the children directives are ready
        scope.$broadcast('initialDateRange', {
          startDate: start,
          endDate: end,
          id: controller.id
        });

        initialized = true;
      });
    }

    scope.$watch('dateRange.format', function() {
      var start = controller.rangeStart.selectedValue,
        end = controller.rangeEnd.selectedValue;

      if (!initialized) {
        return;
      }

      if (start) {
        controller.rangeStart.selectedValue = dateFilter(new Date(start), controller.format);
      }

      if (end) {
        controller.rangeEnd.selectedValue = dateFilter(new Date(end), controller.format);
      }
    });

    //this event is sent from date picker directive when range is selected
    $rootScope.$on('rangeSelected', setRangeValues);
    scope.$on('$destroy', setRangeValues);

    scope.setViewValue = function(value, start, end) {
      controller.dateRange.startDate = start;
      controller.dateRange.endDate = end;

      if (angular.isFunction(controller.onSelect) && attr.onSelect) {
        controller.onSelect({
          selectedDateRange: value,
          startDate: start,
          endDate: end
        });
      }
    };

    function setRangeValues(e, info) {
      var start, end;

      //if it is not for you, don't handle it
      if (info.id && info.id !== controller.id) {
        return false;
      }

      start = info.selectedStart;
      end = info.selectedEnd;

      if (info.rangeSelected) {
        controller.rangeStart.selectedValue = dateFilter(start, controller.format);
        controller.rangeEnd.selectedValue = dateFilter(end, controller.format);

        range = dateRangeService.getSelectedDateRange(start, end, controller.format);
        scope.setViewValue(range, start, end);

        controller.rangeSelected = info.rangeSelected;
        controller.closingRange = true;

        $timeout(function() {
          controller.opened = false;
          controller.closingRange = false;
        }, config.DELAY_CLOSING);

      } else {
        controller.rangeStart.selectedValue = dateFilter(start, controller.format);
        controller.rangeEnd.selectedValue = dateFilter(end, controller.format);

        $timeout(function() {
          //assuming only start date has value, calendar stay open
          controller.opened = true;
        });
      }
    }
    initialize();
  }

  return {
    restrict: 'E',
    controller: DateRangeController,
    controllerAs: 'dateRange',
    bindToController: {
      dateRange: '=ngModel',
      onSelect: '&',
      placeholder: '@?',
      isDisabled: '=?',
      format: '@?'
    },
    scope: {},
    link: linkFn,
    template: require('./templates/date-range.tpl.html')
  };
};

module.exports.$inject = ['translate', 'uuid', '$log', '$timeout', 'dateFilter', '$rootScope',
  'dateRangeService'
];
