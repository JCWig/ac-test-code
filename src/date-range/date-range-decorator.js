import angular from 'angular';
import template from './templates/date-range-day-popup.tpl.html';
import { eventNoopHanlder } from './../date-picker/daypicker-decorator';

function getPlainDate(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function DateRangeDecorator($provide) {
  //first time selection always makes arrow direction to the left\
  //even if slection is from right calendar
  function firstTimeSelect(dt, scope) {
    scope.selectedStart = dt;
    scope.selectedEnd = null;
    scope.rangeSelected = false;
  }

  function secondTimeSelect(dt, scope) {
    let cloneDate = new Date();

    if (angular.isDate(scope.selectedStart)) {
      scope.selectedEnd = dt;
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
    if (scope.rangeSelected || !angular.isDate(scope.selectedStart)
      && !angular.isDate(scope.selectedEnd)) {
      firstTimeSelect(dt, scope);
    } else {
      secondTimeSelect(dt, scope);
    }

    //send event back to parent dirctive with range values
    $rootScope.$emit('dateRange.rangeSelected', {
      selectedStart: scope.selectedStart,
      selectedEnd: scope.selectedEnd,
      rangeSelected: scope.rangeSelected,
      id: scope.callerId
    });
  }

  //folowing functions copied from datepicker.js
  function fixTimeZone(date) {
    let hours = date.getHours();

    date.setHours(hours === 23 ? hours + 2 : 0);
  }

  function getDates(startDate, n) {
    let dates = new Array(n),
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

  function datepickerDirective($delegate, $timeout, $rootScope, dateFilter, dateRangeService) {
    let link;

    // since: directives could potentially share names, the provider returns an array
    // therefore: get the first item as we know we only have one.
    let directive = $delegate[0];

    // override the default template for daterange control
    directive.template = template;
    directive.templateUrl = undefined;

    // reference the original link function
    link = directive.link;

    directive.compile = () => {
      return function(scope, element, attrs, ctrl) {
        let initialDateRange, updateDateRangeMin, updateDateRangeMax,
          updateDatepickerMin, updateDatepickerMax;

        link.apply(this, arguments);
        scope.rangeSelected = false;
        scope.renderDateRange = scope.renderDateRange || false;

        //overrides datepicker.js keydown event
        element.bind('keydown', eventNoopHanlder.arrowKeysEventNoop);
        element.bind('click', eventNoopHanlder.anyEventNoop);

        //show/hide nav previous button depend on the minDate
        scope.showNavPrev = () => {
          return dateRangeService.isFirstDateExceedMinDate(ctrl.activeDate, ctrl.minDate);
        };

        //show/hide nav next button depend on the maxDate
        scope.showNavNext = () => {
          return dateRangeService.isLastDateNotOverMaxDate(ctrl.activeDate, ctrl.maxDate);
        };

        //this event is sent from date range drective(parent) to tell date the range values.
        //values can be empty or initial range values. it also saves unique id per directive,
        //so it can be identified to whom is interested in receiving events
        initialDateRange = scope.$on('dateRange.updateSelected', (event, info) => {
          //using copy is to avoid the info object kept being referenced in the object chain,
          //that way, the value integrity of selectedStart will be maintained
          let dateInfo = angular.copy(info);

          scope.selectedStart = dateInfo.startDate;
          scope.selectedEnd = dateInfo.endDate;
          scope.callerId = dateInfo.id;
          if (angular.isDate(info.startDate) && angular.isDate(info.endDate)) {
            scope.rangeSelected = true;
          } else {
            scope.rangeSelected = false;
          }
          if (angular.isDate(info.startDate)) {
            ctrl.activeDate = info.startDate;
            ctrl.refreshView();
          }

          //watch only occurs if it is for date range
          scope.$watch('rows', () => {
            //timeout may not be needed, use for making sure the rows have been constructed
            $timeout(() => {
              createPairingRows();
            });
          });

          scope.renderDateRange = true;
        });

        updateDateRangeMax = scope.$on('dateRange.updateMaxDate', (e, info) => {
          let maxInfo = angular.copy(info);

          ctrl.maxDate = maxInfo.maxValue;
          if (angular.isDate(scope.selectedEnd)) {
            let maxDate = getPlainDate(maxInfo.maxValue),
              endDate = getPlainDate(scope.selectedEnd);

            if (maxDate.getTime() < endDate.getTime()) {
              setRangeAndNotify(null, scope, $rootScope);
            }
          }
          ctrl.activeDate = new Date();
          ctrl.refreshView();
        });

        updateDateRangeMin = scope.$on('dateRange.updateMinDate', (e, info) => {
          let minInfo = angular.copy(info);

          ctrl.minDate = minInfo.minValue;
          if (angular.isDate(scope.selectedStart)) {
            let minDate = getPlainDate(minInfo.minValue),
              startDate = getPlainDate(scope.selectedStart);

            if (minDate.getTime() > startDate.getTime()) {
              setRangeAndNotify(null, scope, $rootScope);
            }
          }
          ctrl.activeDate = new Date();
          ctrl.refreshView();
        });

        scope.$on('$destroy', () => {
          initialDateRange();
          updateDateRangeMax();
          updateDateRangeMin();
          updateDatepickerMax();
          updateDatepickerMin();
          element.off('keydown');
          element.off('click');
        });

        scope.isInRange = (currentDate) => {
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

        scope.isStart = (currentDate) => {
          if (scope.selectedStart) {
            return dateRangeService.areDatesEqual(currentDate, scope.selectedStart);
          }
          return false;
        };

        scope.isEnd = (currentDate) => {
          if (scope.selectedEnd) {
            return dateRangeService.areDatesEqual(currentDate, scope.selectedEnd);
          }
          return false;
        };

        scope.dateSelect = (currentDate) => {
          setRangeAndNotify(currentDate, scope, $rootScope);
        };

        scope.movePrev = (n) => {
          return scope.move(n);
        };

        scope.moveNext = (n) => {
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
          scope.currentYear = year;
        }

        /* following code are to handle date picker logic */
        //disable navigation according to the range
        scope.daypickerNavPrevDisabled = () => {
          let firstDayOfMonth = new Date(ctrl.activeDate.getFullYear(),
            ctrl.activeDate.getMonth(), 1);

          return ctrl.minDate && firstDayOfMonth <= ctrl.minDate;
        };

        scope.daypickerNavNextDisabled = () => {
          // calculate last day of month by using the 0th day trick:
          // if values are greater/lesser than their logical range,
          // the adjacent value will be adjusted.
          let lastDayOfMonth =
            new Date(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth() + 1, 0);

          return ctrl.maxDate && lastDayOfMonth >= ctrl.maxDate;
        };

        updateDatepickerMax = scope.$on('datepicker.updateMaxDate', (e, info) => {
          ctrl.maxDate = info.maxDate;
          if (info.reset || ctrl.activeDate.getTime() > ctrl.maxDate.getTime()) {
            ctrl.activeDate = info.selectedDate || new Date();
          }
          ctrl.refreshView();
        });

        updateDatepickerMin = scope.$on('datepicker.updateMinDate', (e, info) => {
          ctrl.minDate = info.minDate;
          if (info.reset || ctrl.activeDate.getTime() < ctrl.minDate.getTime()) {
            ctrl.activeDate = info.selectedDate || new Date();
          }
          ctrl.refreshView();
        });
      };
    };
    return $delegate;
  }

  datepickerDirective.$inject = ['$delegate', '$timeout', '$rootScope', 'dateFilter',
    'dateRangeService'
  ];
  $provide.decorator('daypickerDirective', datepickerDirective);
}

DateRangeDecorator.$inject = ['$provide'];
export default DateRangeDecorator;
