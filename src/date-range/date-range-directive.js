var angular = require('angular');

module.exports = function(translate, uuid, $log, $timeout, dateFilter, $rootScope, drService) {

  var config = {
    options: {
      startingDay: 0,
      showWeeks: false,
      autoclose: true,
      minMode: 'day',
      maxMode: 'day'
    },
    FORMAT: 'EEE, MMM dd, yyyy',
    DELAY_CLOSING: 5000
  };

  function showRangePoint(scope, id, numberToSkip) {
    scope.$broadcast('moveRangePoint', {
      id: id,
      moveValue: numberToSkip
    });
  }

  function DateRangeController($scope, $element, $attr) {
    var d = new Date();

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
        this.openFromRangeEnd = false;
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

    this.clearDateRange = function(e) {
      preventOtherEvents(e);
      this.rangeStart.selectedValue = '';
      this.rangeEnd.selectedValue = '';
      this.rangeSelected = false;
      this.lastCloseOnRangeStart = true;

      //tell date picker to clear up the range values
      $scope.$broadcast('initialDateRange', {
          startDate: '',
          endDate: '',
          id: this.id
        });
    };

    this.showClearIcon = function() {
      return (this.rangeStart.selectedValue || this.rangeEnd.selectedValue) && !this.isDisabled;
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
        dr.rangeSelected = true;
        scope.setViewValue(drService.getSelectedDateRange(start, end, dr.format), start, end);
      }

      $timeout(function() {
        //interesting, have to wait for $digest completed
        dr.format = dr.format || config.FORMAT;

        //send the event to child directive to handle with range values
        //use timeout to make sure the children directives are ready
        scope.$broadcast('initialDateRange', {
          startDate: start,
          endDate: end,
          id: dr.id
        });

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

    //this event is sent from date picker directive when range is selected
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
        dr.rangeSelected = info.rangeSelected;
        dr.closingRange = true;

        $timeout(function() {
          dr.opened = false;
          dr.closingRange = false;
        }, config.DELAY_CLOSING);

      } else { //assuming only start date has value, calendar stay open
        dr.rangeStart.selectedValue = dateFilter(start, dr.format);
        dr.rangeEnd.selectedValue = end;

        $timeout(function() {
          dr.opened = true;
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

module.exports.$inject = ['translate', 'uuid', '$log', '$timeout', 'dateFilter', '$rootScope',
'dateRangeService'];
