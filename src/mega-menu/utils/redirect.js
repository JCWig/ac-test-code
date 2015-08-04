/* eslint-disable no-underscore-dangle, no-console */

/**
 * @name utils.redirect
 * @param {String} url The URL to redirect to
 * @description Tiny wrapper around `window.location` to allow us to stub out tests properly.
 */
function redirect(url) {
  // HACK: this depends on the karma implementation and is subject to breakage.
  // Attempts to use proxyquireify have been unsuccessful in karma's watch mode
  if (!window.__karma__) {
    window.location.href = url;
  } else {
    console.log('R:' + url); // used so we can stub console.log in karma testing and verify output
  }
}

module.exports = redirect;
