'use strict';

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.data-table
    *
    * @description Provides a directive that creates Luna- and
    * Pulsar-compatible data table.
    *
    */
    module.exports = angular.module('akamai.components.data-table', [
        require('../uuid').name,
        require('../indeterminate-progress').name,
        require('../pagination').name,
        require('../menu-button').name
    ])

    
    .filter('offset', function() {
      return function(input, start) {

        if (input == null) {
            return [];
        }

        start = parseInt(start, 10);
        return input.slice(start);
      };
    })

    /* @ngInject */    
    .filter('highlight', function($sce) {
        return function(text, phrase) {
            if (!angular.isString(text)) {
                text = String(text);
            }
            
            phrase = String(phrase).trim();
            
            if (phrase){
                text = text.replace(new RegExp('('+phrase+')', 'gi'), '<span class="highlighted">$1</span>');
            }

            return $sce.trustAsHtml(text);
        };
    })
    
    /**
     * @ngdoc directive
     *
     * @name akamai.components.data-table.directive:akamDataTable
     *
     * @description Creates a data table control.
     *
     * @restrict E
     *
     * @param {Array | Promise} data The array of data to show in the listbox.  If data is a promise, the
     *  indeterminate progress control will show in place of the contents until the promise is resolved/rejected.
     * @param {Array} columns The aray of columns that describes the schema to the data table layout and formatting
     *
     */
.directive("akamDataTable", require('./data-table-directive'));