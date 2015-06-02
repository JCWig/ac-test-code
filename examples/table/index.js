/* globals angular */
'use strict';

angular.module('akamai.components.examples.table', [
  'akamai.components.table',
  'akamai.components.i18n'
])
  .config(i18nConfig)
  .controller('ExampleController', ExampleController);

function ExampleController($http, $log) {
  var vm = this;

  // Load data from a json file to test out HTTP GET functionality
  this.rows = $http.get('../json/component_mockdata.json');

  // pre-select the first two rows
  this.rows.then(function(data) {
    vm.selectedItems = [data.data[0], data.data[1]];
    return data;
  });

  // custom callback to handle whenever any item changes
  this.myRowSelectionCallback = function(selectedRows) {
    $log.log(selectedRows);
  };

  // custom bound markup to appear in a row template
  this.testText = 'HI EVERYONE';

  // callback method when our custom toolbar button is clicked
  this.pdfClicked = function(row) {
    $log.log('PDF button clicked', row);
  };

}
ExampleController.$inject = ['$http', '$log'];

function i18nConfig($translateProvider) {
  $translateProvider.useMissingTranslationHandler(angular.noop);
}
i18nConfig.$inject = ['$translateProvider'];