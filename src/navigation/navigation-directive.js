'use strict';

/* @ngInject */
module.exports = function($log) {

  return {
    restrict: 'E',

    template: require('./templates/navigation.tpl.html'),

    link: function(scope, elem, attrs) {

      $log.log('navigation controller');
    }
  };
};