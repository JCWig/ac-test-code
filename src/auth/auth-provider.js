var angular = require('angular');
var isRegExp = function(re) {
  return Object.prototype.toString.call(re) === '[object RegExp]';
};

module.exports = function() {
  var blackListedUris = [];

  this.$get = function() {
    return {

      // intentionally didn't add the @ngdoc declaration because wasn't sure if this should be
      // documented
      /**
       * @name auth#getBlacklistedUris
       * @return {String[] | RegExp[]} The list of blacklisted URIs, as either strings or regexes
       */
      getBlacklistedUris: function() {
        return blackListedUris;
      }
    };
  };

  /**
   * @ngdoc method
   * @name authProvider#setBlacklistedUris
   * @param {String[] | String | RegExp | RegExp[]} uris Strings or RegEX patterns to ignore
   * when deciding whether or not to send requests for a JSON Web Token.
   */
  this.setBlacklistedUris = function(uris) {
    if (angular.isArray(uris)) {
      blackListedUris = uris;
    } else if (angular.isString(uris) || isRegExp(uris)) {
      blackListedUris = [uris];
    }
  };
};