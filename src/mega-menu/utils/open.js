/* eslint-disable no-underscore-dangle */

/**
 * @ngdoc object
 * @name utils.open
 * @description Tiny wrapper around `window.open` to allow us to stub out tests properly.
 */
function open() {
  // HACK: this depends on the karma implementation and is subject to breakage.
  // Attempts to use proxyquireify have been unsuccessful in karma's watch mode
  if (!window.__karma__) {
    window.open.apply(this, arguments);
  }
}

module.exports = open;
