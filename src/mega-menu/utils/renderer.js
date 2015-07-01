'use strict';

/**
 * @ngdoc object
 * @name utils.renderer
 * @requires utils.ajax
 * @description
 * Collection of convenience methods for rendering.
 */
var ajax = require('./ajax');

/**
 * @ngdoc function
 * @name utils.renderer.render
 * @methodOf utils.renderer
 * @param {String} selector DOM selector used
 * @param {Function|exports} template The Handlebars template function
 * @param {Object} data Data that should be passed to the template
 * @description
 * Consistent way to render templates. Allows us to add selector engine later if necessary.
 * Example usage
 * <pre>
 * var render = require('./utils/render');
 * render('.my-selector', myHandlebarsFunction(), templateData)
 * </pre>
 */
function render(selector, template, data) {
  var elem = document.querySelector(selector);

  // ideally, elem should always exist, but it seems to be causing issue in the test environment
  // so we do a conditional check and don't render anything if there is no element to receive the
  // html
  if (elem) {
    elem.innerHTML = template(data);
  }
}

/**
 * @ngdoc function
 * @name util.renderer.fetchAndRender
 * @methodOf utils.renderer
 * @param {String} url The url to fetch
 * @param {String} selector DOM selector used
 * @param {Function} template The Handlebars template function
 * @param {Function} [callback] optional callback to be invoked upon completion. Will be passed a
 * boolean indicating if the render was successful.
 * @description Fetches a url and then calls the template function and places the content in the
 * DOM node defined by selector. The data in its entirety will be passed. If supplied, a callback
 * will be invoked after completion with a boolean flag indicating success.
 */
function fetchAndRender(url, selector, template, callback) {

  ajax.get(url, function(err, data) {
    if (!err) {
      render(selector, template, data);
    }

    if (typeof callback === 'function') {
      callback(!err);
    }
  });
}

module.exports = {
  render: render,
  fetchAndRender: fetchAndRender
};
