var Handlebars = require('hbsfy/runtime');

/**
 * @name helpers.highlightText
 * @param {RegExp} regex The regex to search against the input string
 * @param {String} text The input to highlight
 * @description
 * Adds a `<strong>` tag around all occurrences of `regex` in `text`
 * @returns {Handlebars.SafeString} Safe string indicating what should be highlighted.
 */
function highlightText(regex, text) {
  text = Handlebars.Utils.escapeExpression(text);
  return new Handlebars.SafeString(text.replace(regex, '<strong>$&</strong>'));
}

module.exports = highlightText;
