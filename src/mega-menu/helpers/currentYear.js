/**
 * @ngdoc object
 * @name helpers.currentYear
 * @description
 * Returns the current year.
 * @returns {Number} The current year
 */
function currentYear() {
  return (new Date()).getFullYear();
}

module.exports = currentYear;
