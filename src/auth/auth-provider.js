'use strict';

/* @ngInject */
module.exports = function() {
  var usePulsarAuth = true;

  this.usePulsarAuth = function(value) {
    usePulsarAuth = !!value;
  };

  this.$get = function() {
    return {
      isUsingPulsarAuth: function() {
        return usePulsarAuth;
      }
    };
  };
};