angular.module('navigationExampleApp')
  .controller('NutritionController', NutritionController);

function NutritionController() {

  this.tabData   = [
    {
      heading: 'Carbs',
      route:   'health.nutrition.carbs'
    },
    {
      heading: 'Fat',
      route:   'health.nutrition.fat',
    },
    {
      heading: 'Protein',
      route:   'health.nutrition.protein',
      disabled: true
    }
  ];

}
