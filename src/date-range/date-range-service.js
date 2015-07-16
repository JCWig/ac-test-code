var angular = require('angular');

module.exports = function($filter) {

  /**
   * filterDate filter any date with given format
   * @param  {Date} value Date value
   * @param  {String} format display format
   * @return {String} return a formatted string or empty string
   * if value is empty or not Date type
   */
  function filterDate(value, format) {
    if (value && angular.isDate(value)) {
      return $filter('date')(new Date(value), format);
    }
    return '';
  }

  /**
   * appendDates append 2 dates string
   * @param  {String} d1 date string
   * @param  {String} d2 date string
   * @return {String} appended 2 string
   */
  function appendDates(d1, d2) {
    //may need to do some checking on date string values
    return [d1, d2].join(' - ');
  }

  /**
   * setStartMinMax set start date min and max values
   * @param {object} rangeStart start date object
   * @param {Date} date Date value
   */
  function setStartMinMax(rangeStart, date) {
    var y = date.getFullYear(),
      m = date.getMonth();

    rangeStart.minDate = new Date(y, m, 1);
    rangeStart.maxDate = new Date(y + 1, m, 1);
  }

  /**
   * setEndMinMax set end date min and max values
   * @param {object} rangeEnd end date object
   * @param {Date} date Date value
   */
  function setEndMinMax(rangeEnd, date) {
    var y = date.getFullYear(),
      m = date.getMonth();

    rangeEnd.minDate = new Date(y, m + 1, 1);
    rangeEnd.maxDate = new Date(y + 1, m + 1, 1);
    rangeEnd.initDate = rangeEnd.minDate;
  }

  /**
   * selectedRange set selected date range string
   * @param  {object} rangeStart start date object
   * @param  {object} rangeEnd end date object
   * @param  {String} format date format
   * @return {String} appended string
   */
  function selectedRange(rangeStart, rangeEnd, format) {
    var d1 = this.filterDate(rangeStart.value, format),
      d2 = this.filterDate(rangeEnd.value, format);

    return this.append2DateString(d1, d2);
  }

  return {
    filterDate: filterDate,
    append2DateString: appendDates,
    setStartMinMax: setStartMinMax,
    setEndMinMax: setEndMinMax,
    getSelectedDateRange: selectedRange
  };

};

module.exports.$inject = ['$filter'];
