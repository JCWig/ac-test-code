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
   * setStartMinMax set start date min and max values
   * @param {object} rangeStart start date object
   * @param {Date} date Date value
   */
  function setStartMinMax(rangeStart, date) {
    var y = date.getFullYear(),
      m = date.getMonth();

    rangeStart.minDate = new Date(y, m-1, 1);
    rangeStart.maxDate = new Date(y + 1, m+1, 0);
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
   * @param  {Date} startDate start date object
   * @param  {Date} endDate end date object
   * @param  {String} format date format
   * @return {String} appended string
   */
  function selectedRange(startDate, endDate, format) {
    var d1 = angular.isDate(startDate) ? this.filterDate(startDate, format) : '',
      d2 = angular.isDate(endDate) ? this.filterDate(endDate, format) : '';

    if (!d1 || !d2) {
      return '';
    }
    return appendDates(d1, d2);
  }

  /**
   * evaluateEndDateChange re-arrange parameters for rangeStart,
   * and call to return dates array
   * @param  {Date} newVal new date value
   * @param  {Date} oldVal old date value
   * @param  {Object} rangeStart [description]
   * @param  {Object} rangeEnd [description]
   * @return {function} function will return dates array bck to caller
   */
  function evaluateStartDateChange(newVal, oldVal, rangeStart, rangeEnd) {
    var sel1 = rangeStart.dateSelected,
      sel2 = rangeEnd.dateSelected;

    return evaluateDates(newVal, oldVal, newVal, new Date(rangeEnd.selectedValue), sel1, sel2);
  }

  /**
   * evaluateEndDateChange re-arrange parameters for rangeEnd,
   * and call to return dates array
   * @param  {Date} newVal new date value
   * @param  {Date} oldVal old date value
   * @param  {Object} rangeStart   [description]
   * @param  {Object} rangeEnd [description]
   * @return {function} function will return dates array bck to caller
   */
  function evaluateEndDateChange(newVal, oldVal, rangeStart, rangeEnd) {
    var sel1 = rangeEnd.dateSelected,
      sel2 = rangeStart.dateSelected;

    return evaluateDates(newVal, oldVal, new Date(rangeStart.value), newVal, sel1, sel2);
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

  /**
   * evaluateDates (private function) checking the dates value,
   * and create array, insert them in theright order
   * @param  {Date} d1 new date value
   * @param  {Date} d2 old date value
   * @param  {Date} d3 arbituray date value
   * @param  {Date} d4 arbituray date value
   * @param  {Boolean} sel1 is rangeStart date selected
   * @param  {Boolean} sel2 is rangeEnd date selected
   * @return {Array}  array with 2 date value if any, otherwise undefined
   */
  function evaluateDates(d1, d2, d3, d4, sel1, sel2) {
    var dates;

    //new value is empty, due to user unselects
    if (!d1) {
      return [undefined, undefined];
    }

    if (sel1) {
      if (d1.getTime() > d2.getTime()) {
        dates = [d2, d1];
      } else {
        dates = [d1, d2];
      }
    } else if (sel2) {
      dates = [d3, d4];
    }
    return dates;
  }

  return {
    filterDate: filterDate,
    setStartMinMax: setStartMinMax,
    setEndMinMax: setEndMinMax,
    getSelectedDateRange: selectedRange,
    evaluateEndDateChange: evaluateEndDateChange,
    evaluateStartDateChange: evaluateStartDateChange
  };

};

module.exports.$inject = ['$filter'];
