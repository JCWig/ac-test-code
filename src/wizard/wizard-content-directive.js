'use strict';

/* @ngInject */
module.exports = function($compile, $http, $templateCache, $q) {

  return {
    restrict: 'E',
    transclude: true,
    template: '<div class="modal-body" ng-transclude></div>'

  };
};
