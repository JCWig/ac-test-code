import angular from 'angular';
import template from './templates/date-range.tpl.html';

const config = {
  options: {
    startingDay: 0,
    showWeeks: false,
    autoclose: true,
    minMode: 'day',
    maxMode: 'day'
  },
  FORMAT: 'EEE, MMM dd, yyyy',
  DELAY_CLOSING: 600
};
const REGEX = /^"(.+)"$/;

class DateRangeController {
  constructor(scope, $log, $timeout, dateFilter, $rootScope, $translate, uuid, dateRangeService) {
    this.dateRangeService = dateRangeService;
    this.uuid = uuid;
    this.scope = scope;
    this.$log = $log;
    this.$timeout = $timeout;
    this.dateFilter = dateFilter;
    this.$rootScope = $rootScope;
    this.$translate = $translate;

    this.opened = false;
    this.rangeSelected = false;
    this.options = config.options;
    this.rangeSelectedEvent = undefined;
    this.invalidDateRange = false;
    this.initialized = false;

    this.id = `akam-date-range-${scope.$id}-${this.uuid.guid()}`;

    this.$translate(this.placeholder || 'components.date-range.placeholder').then((value) => {
      this.placeholder = value;
    });

    //this event is sent from date picker directive when range is selected
    this.rangeSelectedEvent = this.$rootScope.$on('dateRange.rangeSelected',
      angular.bind(this, this.setRangeValues));
    this.scope.$on('$destroy', () => this.rangeSelectedEvent());

    this.scope.$watch('dateRange.max', (newValue) => {
      if (!newValue) {
        return;
      }
      newValue = newValue.replace(REGEX, '$1');
      if (angular.isDate(new Date(newValue))) {
        scope.$broadcast('dateRange.updateMaxDate', {
          maxValue: new Date(newValue)
        });
      }
    });

    this.scope.$watch('dateRange.min', (newValue) => {
      if (!newValue) {
        return;
      }
      newValue = newValue.replace(REGEX, '$1');
      if (angular.isDate(new Date(newValue))) {
        scope.$broadcast('dateRange.updateMinDate', {
          minValue: new Date(newValue)
        });
      }
    });
  }

  initialize(attr, ngModel) {
    let start = '',
      end = '',
      clone;

    this.attr = attr;
    this.ngModel = ngModel;

    this.$timeout(() => {
      //interesting, have to wait for $digest completed
      this.format = this.format || config.FORMAT;

      start = this.dateRange.startDate;
      end = this.dateRange.endDate;

      if (start && end) {
        //if startDate greater then endDate, swap date value
        if (start > end) {
          clone = new Date(end);
          end = start;
          start = clone;
        }
        this.rangeSelected = true;
      }

      let range = this.dateRangeService.getSelectedDateRange(start, end, this.format);
      this.selectedValue = range;
      this.setViewValue(range, start, end);

      //send the event to child directive to handle with range values
      //use timeout to make sure the children directives are ready
      this.scope.$broadcast('dateRange.updateSelected', {
        startDate: start,
        endDate: end,
        id: this.id
      });

      this.initialized = true;
    });

    //this event is sent from date picker directive when range is selected
    this.scope.$watch('dateRange.format', () => {
      let startDate = this.dateRange.startDate,
        endDate = this.dateRange.endDate;

      if (!this.initialized) {
        return;
      }

      this.selectedValue =
        this.dateRangeService.getSelectedDateRange(startDate, endDate, this.format);
    });
  }

  setViewValue(value, start, end) {
    this.dateRange.startDate = start;
    this.dateRange.endDate = end;

    this.invalidDateRange = angular.isDate(start) && !angular.isDate(end);

    if (angular.isFunction(this.onSelect) && this.attr.onSelect) {
      this.onSelect({
        selectedDateRange: value,
        startDate: start,
        endDate: end
      });
    }
    this.ngModel.$setViewValue({
      startDate: start,
      endDate: end
    });
    this.ngModel.$setValidity('dateRange', !this.invalidDateRange);
  }

  setRangeValues(e, info) {
    let start, end, range;

    //if it is not for you, don't handle it
    if (!info || !info.id || info.id !== this.id) {
      e.stopPropagation();
      return;
    }

    start = info.selectedStart;
    end = info.selectedEnd;

    this.dateRange.startDate = start;
    this.dateRange.endDate = end;
    this.rangeSelected = info.rangeSelected;

    if (info.rangeSelected) {
      range = this.dateRangeService.getSelectedDateRange(start, end, this.format);
      this.$timeout(() => {
        this.opened = false;
      }, config.DELAY_CLOSING);

    } else {
      range = this.dateFilter(start, this.format);
      this.$timeout(() => {
        if (start) {
          //assuming only start date has value, calendar stay open - forced
          this.opened = true;
        }
      });
    }
    this.selectedValue = range;
    this.setViewValue(range, start, end);
    e.stopPropagation();
  }

  toggle() {
    if (!this.isDisabled && !this.isReadonly) {
      this.opened = !this.opened;
    }
  }

  preventOtherEvents(e) {
    e.preventDefault();
    e.stopPropagation();
  }
}

DateRangeController.$inject = ['$scope', '$log', '$timeout',
  'dateFilter', '$rootScope', '$translate', 'uuid', 'dateRangeService'
];

function linkFn(scope, elem, attr, ngModel) {
  let ctrl = scope.dateRange;

  if (!ctrl.dateRange && !angular.isObject(ctrl.dateRange)) {
    ctrl.$log.error('ng-model is required for date range component directive.');
    return;
  }
  ctrl.initialize(attr, ngModel);
}

export default () => {
  return {
    restrict: 'E',
    require: '^ngModel',
    controller: DateRangeController,
    controllerAs: 'dateRange',
    bindToController: {
      dateRange: '=ngModel',
      onSelect: '&',
      placeholder: '@?',
      isDisabled: '=?',
      isReadonly: '=?',
      format: '@?',
      min: '@?',
      max: '@?'
    },
    scope: {},
    link: linkFn,
    template: template
  };
};
