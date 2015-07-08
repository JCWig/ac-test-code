/**
 * @ngdoc object
 * @name utils.flatten
 * @param {Object[]} array The context data that we need to flatten
 * @param {String} key the lookup key
 * @param {Object[]} [flattened] current data
 * @returns {Object[]} The flattened object tree
 * @description Flattens the inputted array of objects to pull apart sub arrays defined by a key
 */
function flatten(array, key, flattened) {
  flattened = flattened || [];
  array.forEach(function(obj) {
    flattened.push(obj);
    if (obj[key] && obj[key] instanceof Array) {
      flatten(obj[key], key, flattened);
    }
  });
  return flattened;
}

module.exports = flatten;
