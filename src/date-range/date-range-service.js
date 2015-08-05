var angular = require('angular');

module.exports = function(dateFilter) {

  /**
   * isFirstDateExceedMinDate service method to compare range first date to min date
   * @param {Date} d first date
   * @param {Date} min predefined min date
   * @return {Boolean} true if first date is same or greater then min date, false is otherwise
   */
  function isFirstDateExceedMinDate(d, min) {
    var firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);

    return min && firstDayOfMonth >= min;
  }

  /**
   * isLastDateNotOverMaxDate service method to compare range lase date to max date
   * @param {Date} d first date
   * @param {Date} max predefined max date
   * @return {Boolean} true if last date is less then max date, false is otherwise
   */
  function isLastDateNotOverMaxDate(d, max) {
    var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    return max && lastDayOfMonth < max;
  }

  /**
   * compareDates service method to compare two days whether they are same
   * @param  {Date} d1 Date one
   * @param  {Date} d2 Date two
   * @return {Boolean} true if they are same, otherwise they are not.
   */
  function compareDates(d1, d2) {
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
  function inRangeCheck(currentDate, start, end) {
    return currentDate >= start && currentDate <= end;
  }

  /**
   * setStartMinMax set start date min and max values
   * @param {object} rangeStart start date object
   * @param {Date} date Date value
   */
  function setMinMax(rangeStart, date) {
    var y = date.getFullYear(),
      m = date.getMonth();

    rangeStart.minDate = new Date(y - 1, m - 1, 1);
    rangeStart.maxDate = new Date(y + 1 + 1, m + 1, 0);
  }

  /**
   * selectedRange set selected date range string
   * @param  {Date} startDate start date object
   * @param  {Date} endDate end date object
   * @param  {String} format date format
   * @return {String} appended string
   */
  function selectedRange(startDate, endDate, format) {
    var d1 = angular.isDate(startDate) ? dateFilter(startDate, format) : '',
      d2 = angular.isDate(endDate) ? dateFilter(endDate, format) : '';

    if (!d1 || !d2) {
      return '';
    }
    return appendDates(d1, d2);
  }

  /**
   * appendDates (private function) append 2 dates string
   * @param  {String} d1 date string
   * @param  {String} d2 date string
   * @return {String} appended 2 string
   */
  function appendDates(d1, d2) {
    return [d1, d2].join(' - ');
  }

  return {
    setMinMaxDate: setMinMax,
    areDatesEqual: compareDates,
    isDateInDateRange: inRangeCheck,
    getSelectedDateRange: selectedRange,
    isFirstDateExceedMinDate: isFirstDateExceedMinDate,
    isLastDateNotOverMaxDate: isLastDateNotOverMaxDate
  };
};

module.exports.$inject = ['dateFilter'];
