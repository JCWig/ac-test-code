/* globals angular */
'use strict';

angular.module('akamai.components.examples.table', [
  'akamai.components.table',
  'akamai.components.i18n'
])
  .controller('ExampleController', ExampleController);

function ExampleController($http, $log) {
  var vm = this;

  // Example 1
  // -------------------------------------------------

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

  // Example 2
  // -------------------------------------------------

  this.emptyRows = [];

  // Example 3
  // -------------------------------------------------

  this.rejectedPromise = $http.get('not-a-real-file');

  // Example 4 and 5
  // -------------------------------------------------

  this.arrayData = [
    {id: 1, firstName: 'Norma', lastName: 'White', email: 'nwhite0@japanpost.jp', country: 'China', ipAddress: '131.46.59.162', boolean: true, color: 'Yellow'},
    {id: 2, firstName: 'Amanda', lastName: 'Martin', email: 'amartin1@unesco.org', country: 'Haiti', ipAddress: '249.90.111.115', boolean: false, color: 'Blue'},
    {id: 3, firstName: 'Gloria', lastName: 'Allen', email: 'gallen2@reuters.com', country: 'Micronesia', ipAddress: '233.173.83.45', boolean: false, color: 'Yellow'},
    {id: 4, firstName: 'Bobby', lastName: 'Montgomery', email: 'bmontgomery3@msn.com', country: 'Gabon', ipAddress: '16.173.58.169', boolean: true, color: 'Blue'},
    {id: 5, firstName: 'Charles', lastName: 'Reyes', email: 'creyes4@cbsnews.com', country: 'Spain', ipAddress: '136.197.92.192', boolean: true, color: 'Red'},
    {id: 6, firstName: 'Joshua', lastName: 'Thompson', email: 'jthompson5@yale.edu', country: 'Russia', ipAddress: '61.57.205.127', boolean: true, color: 'Yellow'},
    {id: 7, firstName: 'Sarah', lastName: 'West', email: 'swest6@shop-pro.jp', country: 'China', ipAddress: '55.80.171.169', boolean: false, color: 'Green'},
    {id: 8, firstName: 'Amy', lastName: 'Stone', email: 'astone7@buzzfeed.com', country: 'China', ipAddress: '183.243.240.125', boolean: true, color: 'Blue'},
    {id: 9, firstName: 'Jeffrey', lastName: 'Webb', email: 'jwebb8@cloudflare.com', country: 'China', ipAddress: '216.7.198.28', boolean: false, color: 'Yellow'},
    {id:10, firstName: 'Andrea', lastName: 'Wagner', email: 'awagner9@wisc.edu', country: 'Sweden', ipAddress: '20.158.247.82', boolean: false, color: 'Yellow'}
  ];

}
ExampleController.$inject = ['$http', '$log'];