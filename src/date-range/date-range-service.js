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
   * @param  {Date} startDate start date object
   * @param  {Date} endDate end date object
   * @param  {String} format date format
   * @return {String} appended string
   */
  function selectedRange(startDate, endDate, format) {
    var d1 = this.filterDate(startDate, format),
      d2 = this.filterDate(endDate, format);

    return this.append2DateString(d1, d2);
  }

  function evaluateDates(startDate, endDate, rangeStart, rangeEnd, changeFrom) {
    var stSelected = rangeStart.dateSelected,
      edSelected = rangeEnd.dateSelected,
      stValue = rangeStart.value,
      edValue = rangeEnd.value,
      dates;

    if (changeFrom === "firstPane") {
      if (stSelected) {
        if (newVal.getTime() > oldVal.getTime()) {
          dates = [oldVal, newVal];
        } else {
          dates = [newVal, oldVal];
        }
      } else if (edSelected) { //rangeStart.dateSelected is true now
        dates = [newVal, new Date(edValue)];
      }
    } else {
      if (edSelected) {
        if (newVal.getTime() > oldVal.getTime()) {
          dates = [oldVal, newVal];
        } else {
          dates = [newVal, oldVal];
        }
      } else if (stSelected) { //rangeStart.dateSelected is true now
        dates = [newVal, new Date(stValue)];
      }
    }
    return dates;
  }

  function evaluateStartDateChange(newVal, oldVal, startObj, endObj) {
    var sel1 = startObj.dateSelected,
      sel2 = endObj.dateSelected;

    return evaluateDates(newVal, oldVal, newVal, new Date(endObj.value), sel1, sel2);
  }

  function evaluateEndDateChange(newVal, oldVal, startObj, endObj) {
    var sel1 = endObj.dateSelected,
      sel2 = startObj.dateSelected;

    return evaluateDates(newVal, oldVal, new Date(startObj.value), newVal, sel1, sel2);
  }

  function evaluateDates(v1, v2, v3, v4, sel1, sel2) {
    var dates;

    if (sel1) {
      if (v1.getTime() > v2.getTime()) {
        dates = [v2, v1];
      } else {
        dates = [v1, v2];
      }
    } else if (sel2) { //rangeStart.dateSelected is true now
      dates = [v3, v4];
    }
    return dates;
  }

  return {
    filterDate: filterDate,
    append2DateString: appendDates,
    setStartMinMax: setStartMinMax,
    setEndMinMax: setEndMinMax,
    getSelectedDateRange: selectedRange,
    evaluateEndDateChange: evaluateEndDateChange,
    evaluateStartDateChange: evaluateStartDateChange
  };

};

module.exports.$inject = ['$filter'];
