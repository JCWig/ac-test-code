var angular = require('angular');

module.exports = function($provide) {

  function setRangeAndNotify(dt, scope, $rootScope) {
    var cloneDate = new Date();

    if (scope.rangeSelected) {
      if (scope.selectedStart === scope.selectedEnd) {
        if (scope.selectedStart.getTime() > dt.getTime()) {
          cloneDate = angular.copy(scope.selectedStart);
          scope.selectedStart = dt;
          scope.selectedEnd = cloneDate;
        } else if (scope.selectedStart.getTime() < dt.getTime()) {
          scope.selectedEnd = dt;
        }
      } else {
        scope.selectedStart = dt;
        scope.selectedEnd = dt;
      }
    } else { //first select will forming a range and start === end
      //scope.rangeSelected = true;
      scope.selectedStart = dt;
      //scope.selectedEnd = dt;
    }

    $rootScope.$emit('rangeSelected', {
      selectedStart: scope.selectedStart,
      selectedEnd: scope.selectedEnd,
      rangeSelected: scope.rangeSelected
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
        var initialDateRange;

        link.apply(this, arguments);

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

        //this event is received from initial data set from app, only once.
        initialDateRange = scope.$on('initialDateRange', function(event, info) {
          scope.selectedStart = info.startDate;
          scope.selectedEnd = info.endDate;
          scope.rangeSelected = true;
        });

        scope.$on('$destroy', initialDateRange);

        scope.isInRange = function(currentDate) {
          //if the date fall in the first date or the last date, consider it not in the range
          if (scope.isStart(currentDate) || scope.isEnd(currentDate)) {
            return false;
          }

          if (angular.isDate(scope.selectedStart) && angular.isDate(scope.selectedEnd)) {
            return dateRangeService.isDateInDateRange(
              currentDate, scope.selectedStart, scope.selectedEnd);
          }
          return false;
        };

        scope.isStart = function(currentDate) {
          return dateRangeService.areDatesEqual(currentDate, scope.selectedStart);
        };

        scope.isEnd = function(currentDate) {
          return dateRangeService.areDatesEqual(currentDate, scope.selectedEnd);
        };

        scope.activeSelect = function(currentDate) {
          setRangeAndNotify(currentDate, scope, $rootScope);
          return scope.select(currentDate);
        };

        scope.pairSelect = function(currentDate) {
          setRangeAndNotify(currentDate, scope, $rootScope);
          //not to call scope.select(dt), it will make active as ...
          //and let range directive to determine
        };

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
        }
      };
    };
    return $delegate;
  }

  datePickerDirective.$inject = ['$delegate', '$timeout', '$rootScope', 'dateFilter',
  'dateRangeService'];
  $provide.decorator('daypickerDirective', datePickerDirective);
};

module.exports.$inject = ['$provide'];
