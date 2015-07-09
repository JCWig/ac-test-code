var i18n = require('../helpers/i18n').i18n;

/**
 * @ngdoc object
 * @name helpers.dateFormat
 * @param {String} date Epoch date string
 * @description
 * Formats date for display in the format MMM DD, YYYY hh:mm A. Used for message center widget
 * @returns {String} New date string formatted appropriately
 */
function dateFormat(date) {
  var hours, minutes, ampm, strTime;

  date = new Date(date);
  hours = date.getHours();
  minutes = date.getMinutes();
  ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0' + hours : hours; // 0 pad the number of hours...
  minutes = minutes < 10 ? '0' + minutes : minutes; // ...and the number of minutes as well
  strTime = hours + ':' + minutes + ' ' + ampm;

  return i18n('shortMonths.' + date.getMonth()) + ' ' + date.getDate() + ', ' + date.getFullYear() +
    '  ' + strTime;
}

module.exports = dateFormat;
