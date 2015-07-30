var Handlebars = require('hbsfy/runtime'),
  highlightText = require('./highlightText');

/**
 * @name helpers.highlightFirstMatch
 * @requires helpers.highlightText
 * @param {RegExp} regex The regex to search against the input string
 * @param {String} leadingText Text to prepend to the output
 * @param {String[]} input The input to search
 * @description
 * Adds a `<strong>` tag around all occurrences of `regex` in the first entry of `input` with a
 * match.
 * @returns {Handlebars.SafeString} Safe string indicating what should be highlighted.
 */
function highlightFirstMatch(regex, leadingText, input) {
  var text = '',
    leading = '<span class="extra-text">' + leadingText + '&#58;</span>',
    i;

  if (input instanceof Array) {
    for (i = 0; i < input.length; i++) {
      text = input[i];
      if (regex.test(text)) {
        break;
      }
    }
  }

  if (text !== '') {
    return new Handlebars.SafeString(leading + highlightText(regex, text));
  }

}

module.exports = highlightFirstMatch;
