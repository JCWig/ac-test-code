angular.module('navRoutingApp')
  .controller('HealthController', HealthController);

function HealthController($log) {
  $log.log('HealthController');
}
HealthController.$inject = ['$log'];
