import angular from 'angular';

class DateRangeService {
  constructor(dateFilter) {
    this.dateFilter = dateFilter;
  }

  /**
   * isFirstDateExceedMinDate service method to compare range first date to min date
   * @param {Date} d first date
   * @param {Date} min predefined min date
   * @return {Boolean} true if first date is greater then min date, false is otherwise
   */
  isFirstDateExceedMinDate(d, min) {
    let firstActiveDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1),
      firstMinDayOfMonth = new Date(min.getFullYear(), min.getMonth(), 1);

    return firstActiveDayOfMonth > firstMinDayOfMonth;
  }

  /**
   * isLastDateNotOverMaxDate service method to compare range lase date to max date
   * @param {Date} d first date
   * @param {Date} max predefined max date
   * @return {Boolean} true if last date is less then max date, false is otherwise
   */
  isLastDateNotOverMaxDate(d, max) {
    let lastActiveDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0),
      lastMaxDayOfMonth = new Date(max.getFullYear(), max.getMonth(), 0);

    return lastActiveDayOfMonth < lastMaxDayOfMonth;
  }

  /**
   * areDatesEqual service method to compare two days whether they are same
   * @param  {Date} d1 Date one
   * @param  {Date} d2 Date two
   * @return {Boolean} true if they are same, otherwise they are not.
   */
  areDatesEqual(d1, d2) {
    if (angular.isDate(d1) && angular.isDate(d2)) {
      d2.setHours(d1.getHours());
      return d1.getTime() === d2.getTime();
    }
    return false;
  }

  /**
   * inRangeCheck service method to check if
   * a date is fall into the range od first date and last date
   * @param  {Date} currentDate Current date
   * @param  {Date} start a date object
   * @param  {Date} end a date object
   * @return {Boolean} true if date is in range, otherwise it is not
   */
  isDateInDateRange(currentDate, start, end) {
    return currentDate >= start && currentDate <= end;
  }

  /**
   * setMinMaxDate set date picker min-date and max-date values
   * By defaults: min-date is 2 years before and first day of month,
   * max-date is 2 years after and last of of the month
   * @param {object} dateRange date object
   * @param {Number} [backforwarYears=2] configuable number set for back or forward years
   */
  setMinMaxDate(dateRange, backforwarYears = 2) {
    let date = new Date(),
      minYr = date.getFullYear() - backforwarYears,
      maxYr = date.getFullYear() + backforwarYears,
      minMo = date.getMonth(),
      maxMo = date.getMonth();

    if (dateRange.minDate) {
      date = new Date(dateRange.minDate);
      if (angular.isDate(date)) {
        minYr = date.getFullYear();
        minMo = date.getMonth();
      }
    }
    if (dateRange.maxDate) {
      date = new Date(dateRange.maxDate);
      if (angular.isDate(date)) {
        maxYr = date.getFullYear();
        maxMo = date.getMonth();
      }
    }
    dateRange.minDate = new Date(minYr, minMo, 1);
    dateRange.maxDate = new Date(maxYr, maxMo + 1, 0);
  }

  /**
   * selectedRange set selected date range string
   * @param  {Date} startDate start date object
   * @param  {Date} endDate end date object
   * @param  {String} format date format
   * @return {String} appended string
   */
  getSelectedDateRange(startDate, endDate, format) {
    let d1 = angular.isDate(startDate) ? this.dateFilter(startDate, format) : '',
      d2 = angular.isDate(endDate) ? this.dateFilter(endDate, format) : '';

    if (!d1 || !d2) {
      return '';
    }
    return this.appendDates(d1, d2);
  }

  /**
   * appendDates (private function) append 2 dates string
   * @param  {String} d1 date string
   * @param  {String} d2 date string
   * @return {String} appended 2 string
   */
  appendDates(d1, d2) {
    return [d1, d2].join(' - ');
  }
}

function rangeServiceFactory(dateFilter) {
  return new DateRangeService(dateFilter);
}

rangeServiceFactory.$inject = ['dateFilter'];
export default rangeServiceFactory;
