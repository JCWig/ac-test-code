'use strict';

angular.module('navigationExampleApp', ['akamai.components.navigation'])
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
    template: '<h2>Activity Content Panel - from template</h2>'
    //templateUrl: 'health/activity.html'
  }).state('health.nutrition', {
    url: 'nutrition',
    controller: 'NutritionController',
    controllerAs: 'nutrition',
    templateUrl: 'health/nutrition.html'
  }).state('health.nutrition.carbs', {
    url: '/carbs',
    template: '<h2>Nutrition - Carbs Content Panel</h2>'
  }).state('health.nutrition.fat', {
    url: '/fat',
    template: '<h2>Nutrition - Fat Content Panel</h2>'
  }).state('health.nutrition.protein', {
    url: '/protein',
    template: '<h2>Nutrition - Protein Content Panel</h2>'
  }).state('health.sleep', {
    url:         'sleep',
    templateUrl: 'health/sleep.html'
  });

}

configFunction.$inject = ['$stateProvider', '$urlRouterProvider'];