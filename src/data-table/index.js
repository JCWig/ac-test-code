'use strict';

require('angular-sanitize');

var angular = require('angular');

    /**
    * @ngdoc overview
    *
    * @name akamai.components.data-table
    *
    * @description Provides a directive that creates a Luna- and
    * Pulsar-compatible data table.
    *
    */
    module.exports = angular.module('akamai.components.data-table', [
        'ngSanitize',
        require('../uuid').name,
        require('../highlight').name,
        require('../indeterminate-progress').name,
        require('../pagination').name,
        require('../menu-button').name,
        require('../i18n').name,
        require('../utils').name
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

    /**
     * @ngdoc directive
     *
     * @name akamai.components.data-table.directive:akamDataTable
     *
     * @description Creates a data table control.
     *
     * @restrict E
     *
     * @param {Array|Promise} data The array of data to display within
     * the
     * {@link akamai.components.list-box `listBox`}.
     * If `data` is a promise, the
     * {@link akamai.components.indeterminate-progress indeterminate progress}
     * control displays in place of the contents until the promise is
     * resolved or rejected.
     *
     * @param {Array} columns An array of columns that describes the
     * schema to the data table layout and formatting.
     *
     */
.directive("akamDataTable", require('./data-table-directive'));
