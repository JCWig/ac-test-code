function authProvider() {
  let blackListedUris = [];

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
    if (Array.isArray(uris)) {
      blackListedUris = uris;
    } else if (typeof uris === 'string' ||
        Object.prototype.toString.call(uris) === '[object RegExp]') {
      blackListedUris = [uris];
    }
  };
}

export default authProvider;