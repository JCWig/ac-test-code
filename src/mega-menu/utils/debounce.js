// gratuitously borrowed from https://remysharp.com/2010/07/21/throttling-function-calls

/**
 * @ngdoc object
 * @name utils.debounce
 * @param {Function} fn The function to debounce
 * @param {Integer} delay Amount of time, in ms, to delay before calling the function.
 * @returns {Function} A function that will only be called after `delay` milliseconds have passed
 * without calling the function.
 * @description Debounces a function call
 */
function debounce(fn, delay) {
  var timer = null;

  return function() {
    var context = this,
      args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

module.exports = debounce;
