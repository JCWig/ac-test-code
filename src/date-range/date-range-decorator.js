var angular = require('angular');

module.exports = function($provide) {

  function firstTimeSelect(dt, scope) {
    if (dt.getMonth() + 1 === scope.pairingMonth) {
      scope.selectedEnd = dt;
      scope.selectedStart = null;
    } else {
      scope.selectedStart = dt;
      scope.selectedEnd = null;
    }
    scope.rangeSelected = false;
  }

  function secondTimeSelect(dt, scope) {
    var cloneDate = new Date();

    if (angular.isDate(scope.selectedStart)) {
      scope.selectedEnd = dt;
    } else if (angular.isDate(scope.selectedEnd)) {
      scope.selectedStart = dt;
    }
    if (scope.selectedStart.getTime() > scope.selectedEnd.getTime()) {
      cloneDate = angular.copy(scope.selectedStart);
      scope.selectedStart = scope.selectedEnd;
      scope.selectedEnd = cloneDate;
    }
    scope.rangeSelected = true;
  }

  function setRangeAndNotify(dt, scope, $rootScope) {
    //if has range, break the range, but select starting date
    if (scope.rangeSelected) {
      firstTimeSelect(dt, scope);
    } else if (!angular.isDate(scope.selectedStart) && !angular.isDate(scope.selectedEnd)) {
      firstTimeSelect(dt, scope);
    } else {
      secondTimeSelect(dt, scope);
    }

    //send event back to parent dirctive with range values
    $rootScope.$emit('rangeSelected', {
      selectedStart: scope.selectedStart,
      selectedEnd: scope.selectedEnd,
      rangeSelected: scope.rangeSelected,
      id: scope.callerId
    });
  }

  //folowing functions copied from datepicker.js
  function fixTimeZone(date) {
    var hours = date.getHours();

    date.setHours(hours === 23 ? hours + 2 : 0);
  }

  function getDates(startDate, n) {
    var dates = new Array(n),
      current = new Date(startDate),
      i = 0,
      date;

    while (i < n) {
      date = new Date(current);
      fixTimeZone(date);
      dates[i++] = date;
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  function datePickerDirective($delegate, $timeout, $rootScope, dateFilter, dateRangeService) {
    var link;

    // since: directives could potentially share names, the provider returns an array
    // therefore: get the first item as we know we only have one.
    var directive = $delegate[0];

    // override the default template for daypicker (template is evaluated before templateUrl)
    directive.template = require('./templates/date-picker-day-popup.tpl.html');
    directive.templateUrl = undefined;

    // reference the original link function
    link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrl) {
        var initialDateRange, moveRangePoint, monthMovingTracking = 0;

        link.apply(this, arguments);
        scope.rangeSelected = false;

        //show/hide nav previous button depend on the minDate
        scope.showNavPrev = function() {
          return dateRangeService.isFirstDateExceedMinDate(ctrl.activeDate, ctrl.minDate);
        };

        //show/hide nav next button depend on the maxDate
        scope.showNavNext = function() {
          return dateRangeService.isLastDateNotOverMaxDate(ctrl.activeDate, ctrl.maxDate);
        };

        scope.$watch('rows', function() {
          //timeout may not be needed, use for making sure the rows have been constructed
          $timeout(function() {
            createPairingRows();
          });
        });

        //this event is sent from date range drective(parent) to tell date the range values.
        //values can be empty or initial range values. it also saves unique id per directive,
        //so it can be identified to whom is interested in receiving events
        initialDateRange = scope.$on('initialDateRange', function(event, info) {
          scope.selectedStart = info.startDate;
          scope.selectedEnd = info.endDate;
          scope.callerId = info.id;
          if (angular.isDate(info.startDate) && angular.isDate(info.endDate)) {
            scope.rangeSelected = true;
          } else {
            scope.rangeSelected = false;
          }
        });

        moveRangePoint = scope.$on('moveRangePoint', function(event, info) {
          if (info.id !== scope.callerId) {
            return;
          }
          if (monthMovingTracking > 0 && info.direction === 'prev') {
            scope.move(-monthMovingTracking);
            monthMovingTracking = -monthMovingTracking;
          }

          if (monthMovingTracking < 0 && info.direction === 'next') {
            scope.move(-monthMovingTracking);
            monthMovingTracking = -monthMovingTracking;
          }
        });

        scope.$on('$destroy', function() {
          initialDateRange();
          moveRangePoint();
        });

        scope.isInRange = function(currentDate) {
          //if the date fall in the first date or the last date, consider it not in the range
          if (!scope.rangeSelected && scope.isStart(currentDate) || scope.isEnd(currentDate)) {
            return false;
          }

          if (angular.isDate(scope.selectedStart) && angular.isDate(scope.selectedEnd)) {
            return dateRangeService.isDateInDateRange(
              currentDate, scope.selectedStart, scope.selectedEnd);
          }
          return false;
        };

        scope.isStart = function(currentDate) {
          if (scope.selectedStart) {
            return dateRangeService.areDatesEqual(currentDate, scope.selectedStart);
          }
          return false;
        };

        scope.isEnd = function(currentDate) {
          if (scope.selectedEnd) {
            return dateRangeService.areDatesEqual(currentDate, scope.selectedEnd);
          }
          return false;
        };

        scope.dateSelect = function(currentDate) {
          setRangeAndNotify(currentDate, scope, $rootScope);
        };

        scope.movePrev = function(n) {
          monthMovingTracking = monthMovingTracking + n;
          return scope.move(n);
        };

        scope.moveNext = function(n) {
          monthMovingTracking = monthMovingTracking + n;
          return scope.move(n);
        };

        //copied from datepicker.js
        function createPairingRows() {
          var year = ctrl.activeDate.getFullYear(),
            month = ctrl.activeDate.getMonth() + 1,
            firstDayOfMonth = new Date(year, month, 1),
            difference = ctrl.startingDay - firstDayOfMonth.getDay(),
            numDisplayedFromPreviousMonth = difference > 0 ? 7 - difference : -difference,
            firstDate = new Date(firstDayOfMonth),
            days, m, i;

          if (numDisplayedFromPreviousMonth > 0) {
            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
          }

          // 42 is the number of days on a six-month calendar
          days = getDates(firstDate, 42);

          for (i = 0; i < 42; i++) {
            m = days[i].getMonth();
            if (m === 0) { //01/2016 will 0 month value, not sure why
              m = 12;
            }
            days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
              secondary: m !== month,
              uid: scope.uniqueId + '-' + i
            });
          }
          scope.pairTitle = dateFilter(firstDayOfMonth, ctrl.formatDayTitle);
          scope.pairRows = ctrl.split(days, 7);
          scope.pairingMonth = month + 1;
          scope.currentMonth = month;
        }
      };
    };
    return $delegate;
  }

  datePickerDirective.$inject = ['$delegate', '$timeout', '$rootScope', 'dateFilter',
    'dateRangeService'
  ];
  $provide.decorator('daypickerDirective', datePickerDirective);
};

module.exports.$inject = ['$provide'];
