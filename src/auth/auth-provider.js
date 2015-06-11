'use strict';

/* @ngInject */
module.exports = function() {
  var usePulsarAuth = true;

  Object.defineProperty(this, 'usePulsarAuth', {
    get: function() {
      return usePulsarAuth;
    },
    set: function(value) {
      usePulsarAuth = !!value;
    }
  });

  this.$get = function() {
    return {
      isUsingPulsarAuth: function() {
        return usePulsarAuth;
      }
    };
  };
};