var angular = require('angular');

module.exports = function($provide) {

  function datePickerDirective($delegate, $timeout, dateFilter) {
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
        link.apply(this, arguments);

        var changeEventOff = scope.$on('dateRangeChanged', function(event, info) {
          scope.newEndDate = info.endDate;
          scope.newStartDate = info.startDate;
        });

        scope.$on('$destroy', changeEventOff);

        //show/hide nav previous button depend on the minDate
        scope.showNavPrev = function() {
          var firstDayOfMonth,
            currentDate = ctrl.activeDate;

          firstDayOfMonth = new Date(currentDate.getFullYear(),currentDate.getMonth(), 1);
          return ctrl.minDate && firstDayOfMonth.getTime() >= ctrl.minDate.getTime();
        };

        //show/hide nav next button depend on the maxDate
        scope.showNavNext = function() {
          var lastDayOfMonth,
            currentDate = ctrl.activeDate;

          lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          return ctrl.maxDate && lastDayOfMonth.getTime() < ctrl.maxDate.getTime();
        };

        scope.isInRange = function(dt) {
          var sd = scope.newStartDate,
            ed = scope.newEndDate;

          if (angular.isDate(sd) && angular.isDate(ed)) {
            return dt.date.getTime() >= sd.getTime() && dt.date.getTime() <= ed.getTime();
          }
          return false;
        };

        //folowing functions copied from datepicker.js
        function fixTimeZone(date) {
          var hours = date.getHours();
          date.setHours(hours === 23 ? hours + 2 : 0);
        };

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

        function createSiblingRows() {
          var year = ctrl.activeDate.getFullYear(),
            month = ctrl.activeDate.getMonth() + 1,
            firstDayOfMonth = new Date(year, month, 1),
            difference = ctrl.startingDay - firstDayOfMonth.getDay(),
            numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference,
            firstDate = new Date(firstDayOfMonth);

          if (numDisplayedFromPreviousMonth > 0) {
            firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
          }

          // 42 is the number of days on a six-month calendar
          var days = getDates(firstDate, 42);
          for (var i = 0; i < 42; i++) {
            days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
              secondary: days[i].getMonth() !== month,
              uid: scope.uniqueId + '-' + i
            });
          }
          scope.siblingTitle = dateFilter(firstDayOfMonth, ctrl.formatDayTitle);
          scope.siblingRows = ctrl.split(days, 7);
        }

        scope.$watch('rows', function() {
          //timeout may not be needed, use for making sure the rows have been constructed
          $timeout(function() {
            createSiblingRows();
          });
        });
      };
    };

    return $delegate;
  }

  datePickerDirective.$inject = ['$delegate', '$timeout', 'dateFilter'];

  $provide.decorator('daypickerDirective', datePickerDirective);
};

module.exports.$inject = ['$provide'];
