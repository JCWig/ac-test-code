var angular = require('angular');

module.exports = function(dateFilter) {

  function isFirstDateExceedMinDate(d, min) {
    var firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);

    return min && firstDayOfMonth >= min;
  }

  function isLastDateNotOverMaxDate(d, max) {
    var lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    return max && lastDayOfMonth < max;
  }

  function compareDates(d1, d2) {
    if (angular.isDate(d1) && angular.isDate(d2)) {
      d2.setHours(d1.getHours());
      return d1.getTime() === d2.getTime();
    }
    return false;
  }

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

    rangeStart.minDate = new Date(y, m - 1, 1);
    rangeStart.maxDate = new Date(y + 1, m + 1, 0);
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
