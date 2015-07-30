/* eslint-disable */

/**
 * v0.0.2
 * @author Jonas Girnatis <dermusterknabe@gmail.com>
 * @licence May be freely distributed under the MIT license.
 */

// taken from https://github.com/musterknabe/translate.js. Modified to support common JS exports
// Note: This shouldn't be used directly by the application. Instead, see i18n-loader.js

var isNumeric = function(obj) { return !isNaN(parseFloat(obj)) && isFinite(obj); };
var isObject = function(obj) { return typeof obj === 'object' && obj !== null; };
var isString = function(obj) { return Object.prototype.toString.call(obj) === '[object String]'; };

var log = function(debug) {
  if (debug) {
    console.warn(Array.prototype.slice.call(arguments, 1).join(' '));
  }
};

/**
 * @name utils.translate
 * @see https://github.com/musterknabe/translate.js
 * @description
 * Tiny i18n library. Supports only up to one level of nesting. See  https://github.com/musterknabe/translate.js.
 * <pre>
 * var messages = {
 *   translationKey: 'translationValue',
 *   moduleA: {
 *       translationKey: 'value123'
 *   }
 * }
 *
 * var options = {
 *     debug: true, //[Boolean]: Logs missing translations to console. Defaults to false.
 *     namespaceSplitter: '::' //[String|RegExp]: You can customize the part which splits namespace and translationKeys. Defaults to '::'.
 * }
 *
 * var t = libTranslate.getTranslationFunction(messages, [options])
 *
 * t('translationKey')
 * t('translationKey', count)
 * t('translationKey', {replaceKey: 'replacevalue'})
 * t('translationKey', count, {replaceKey: 'replacevalue'})
 * t('translationKey', {replaceKey: 'replacevalue'}, count)
 * t('moduleA::translationKey')
 * </pre>
 */
var libTranslate = {

  /**
   * @name utils.translate.getTranslationFunction
   * @param {Object} messageObject translation data
   * @param {Object} [options] Options for this translate module
   * @param {Boolean} [options.debug] Whether or not to log errors. Default `false`
   * @param {String|RegExp} [options.namespaceSplitter] Value to use to split on namespace keys. Default `"::"`
   * @returns {Function} A function that can be used to translate keys. Refer to usage above.
   */
  getTranslationFunction: function(messageObject, options) {
    options = isObject(options) ? options : {};

    var debug = options.debug;
    var namespaceSplitter = options.namespaceSplitter || '::';

    function getTranslationValue(translationKey) {
      if (!messageObject) {
        return null;  // if the translation object doesn't exist, don't cause a JS error
      }

      if (messageObject[translationKey]) {
        return messageObject[translationKey];
      }

      var components = translationKey.split(namespaceSplitter); //TODO: make this more robust. maybe support more levels?
      var namespace = components[0];
      var key = components[1];

      if (messageObject[namespace] && messageObject[namespace][key]) {
        return messageObject[namespace][key];
      }

      return null;
    }

    function getPluralValue(translation, count) {
      if (isObject(translation)) {
        if (Object.keys(translation).length === 0) {
          log(debug, '[Translation] No plural forms found.');
          return null;
        }

        if (translation[count]) {
          translation = translation[count];
        } else if (translation.n) {
          translation = translation.n;
        } else {
          log(debug, '[Translation] No plural forms found for count:"' + count + '" in', translation);
          translation = translation[Object.keys(translation).reverse()[0]];
        }
      }

      return translation;
    }

    function replacePlaceholders(translation, replacements) {
      if (isString(translation)) {
        return translation.replace(/\{(\w*)}/g, function(match, key) {
          if (!replacements.hasOwnProperty(key)) {
            log(debug, 'Could not find replacement "' + key + '" in provided replacements object:', replacements);
            return '{' + key + '}';
          }

          return replacements.hasOwnProperty(key) ? replacements[key] : key;
        });
      }

      return translation;
    }

    return function(translationKey) {
      var replacements = isObject(arguments[1]) ? arguments[1] : (isObject(arguments[2]) ? arguments[2] : {});
      var count = isNumeric(arguments[1]) ? arguments[1] : (isNumeric(arguments[2]) ? arguments[2] : null);

      var translation = getTranslationValue(translationKey);

      if (count !== null) {
        replacements.n = replacements.n ? replacements.n : count;

        //get appropriate plural translation string
        translation = getPluralValue(translation, count);
      }

      //replace {placeholders}
      translation = replacePlaceholders(translation, replacements);

      if (translation === null) {
        log(debug, 'Translation for "' + translationKey + '" not found.');
        return '@@' + translationKey + '@@';
      }

      return translation;
    };
  }
};

module.exports = libTranslate;
