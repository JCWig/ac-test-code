'use strict';

angular.module('navRoutingApp', ['akamai.components.tabs'])
  .config(configFunction);

function configFunction($stateProvider, $urlRouterProvider) {

  $urlRouterProvider
    .when('/', '/activity')
    .when('/nutrition', '/nutrition/carbs')
    .otherwise('/');

  $stateProvider.state('health', {
    url:         '/',
    controller: 'HealthController',
    controllerAs: 'health',
    templateUrl: 'health/health.html'
  }).state('health.activity', {
    url:  'activity',
    templateUrl: 'health/activity.html'
  }).state('health.nutrition', {
    url: 'nutrition',
    controller: 'NutritionController',
    controllerAs: 'nutrition',
    templateUrl: 'health/nutrition.html'
  }).state('health.nutrition.carbs', {
    url: '/carbs',
    templateUrl: 'health/carbs.html'
  }).state('health.nutrition.fat', {
    url: '/fat',
    templateUrl: 'health/fat.html'
  }).state('health.nutrition.protein', {
    url: '/protein',
    templateUrl: 'health/protein.html'
  }).state('health.sleep', {
    url:         'sleep',
    templateUrl: 'health/sleep.html'
  });

}

configFunction.$inject = ['$stateProvider', '$urlRouterProvider'];