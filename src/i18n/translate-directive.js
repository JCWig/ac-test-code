'use strict';

/* @ngInject */
module.exports = function(translate) {
  return {
    restrict: 'A',
    link: function(scope, elem, attr) {
      var key = attr.akamTranslate;
      translate.async(key).then(function(value) {
        elem.text(value);
      });
    }
  };
};
