/**
 * @name helpers.withItem
 * @param {Object} object Object to inspect
 * @param {Object} options Handlebars block options.
 * @param {String} options.hash.key Variable key into object that we should return.
 * @description Fetches `object[key]` and executes the block function with that value.
 * @returns {Function} a fn that handlebars will execute to get a value
 */
function withItem(object, options) {
  return options.fn(object[options.hash.key]);
}

module.exports = withItem;
