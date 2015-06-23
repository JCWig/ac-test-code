'use strict';

/**
 * @ngdoc object
 * @name helpers.textTrue
 * @param {String} flag The text to check
 * @param {Object} options Handlebars block options. Includes `fn` and `inverse`
 * @returns {Boolean} true if the input is the text value `true`
 */
function textTrue(flag, options) {
  if (flag === 'true') {
    return options.fn(this);
  }
  return options.inverse(this);
}

module.exports = textTrue;
