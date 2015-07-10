angular.module('navigationExampleApp')
  .controller('HealthController', HealthController);

function HealthController() {

  this.tabData   = [
    {
      heading: 'Activity',
      route:   'health.activity'
    },
    {
      heading: 'Nutrition',
      route:   'health.nutrition'
    },
    {
      heading: 'Sleep',
      route:   'health.sleep'
    }
  ];

}
