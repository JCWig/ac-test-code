'use strict';

angular.module('navigationExampleApp', ['akamai.components.navigation'])
  .config(configFunction);

function configFunction($stateProvider, $urlRouterProvider) {

  $stateProvider.state('health', {
    url:         '/',
    controller: 'HealthController',
    controllerAs: 'health',
    templateUrl: 'health/health.html'
  }).state('health.activity', {
    url:  'activity',
    templateUrl: 'health/activity.html'
  }).state('health.nutrition', {
    url:         'nutrition',
    templateUrl: 'health/nutrition.html'
  }).state('health.sleep', {
    url:         'sleep',
    templateUrl: 'health/sleep.html'
  });

  $urlRouterProvider.when('', '/activity');
}

configFunction.$inject = ['$stateProvider', '$urlRouterProvider'];