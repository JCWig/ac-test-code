'use strict';

angular.module('navRoutingApp', ['akamai.components.constants', 'akamai.components.tabs'])
  .config(configFunction);

function configFunction($stateProvider, $urlRouterProvider, $translatePartialLoaderProvider,
                        VERSION, $translateProvider, i18nLocaleProvider) {

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

  // need to overwrite locales path on fee.akamai.com
  if (window.location.host == 'fee.akamai.com') {
    $translatePartialLoaderProvider.addPart('../dist/locales/');
    $translatePartialLoaderProvider.addPart('locales/json/messages/');
  } else {
    $translatePartialLoaderProvider.addPart('/libs/akamai-core/'+VERSION+'/locales/');
    $translatePartialLoaderProvider.addPart('/apps/akamai-core-examples/locales/');
  }

  var locale = docCookies.getItem('AKALOCALE') || 'en_US';

  $translateProvider.preferredLanguage(locale);
  i18nLocaleProvider.setLocale(locale);
}

configFunction.$inject = ['$stateProvider', '$urlRouterProvider', '$translatePartialLoaderProvider',
  'AKAMAI_CORE_VERSION', '$translateProvider', 'i18nLocaleProvider'];