angular.module('navRoutingApp')
  .controller('NutritionController', NutritionController);

function NutritionController($log) {
  $log.log('In NutritionController');
}
NutritionController.$inject = ['$log'];
