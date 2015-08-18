// gratuitously borrowed from https://remysharp.com/2010/07/21/throttling-function-calls

/**
 * @name utils.throttle
 * @param {Function} fn The function to throttle
 * @param {Integer} threshold Amount of time, in ms, used to limit the function from being called.
 * @returns {Function} A function that will only be called once every `delay` milliseconds.
 * @description Throttles a function call. Will fire the first and last message if multiple
 * function calls are made during the threshold window.
 */
function throttle(fn, threshold) {
  var last,
    deferTimer;

  return function() {
    var context = this,
      now = (new Date()).valueOf(),
      args = arguments;

    if (last && now < last + threshold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, threshold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

module.exports = throttle;
