'use strict';

var angular = require('angular'),
  tableDirectiveTemplate = require('./templates/table.tpl.html');

var toolbarSelector = 'akam-table-toolbar',
  rowSelector = 'akam-table-row',
  sortedClass = 'column-sorted',
  SORT_DIRECTIONS = {
    asc: 'asc',
    desc: 'desc'
  },
  defaultSortDirection = SORT_DIRECTIONS.asc;

/* @ngInject */
module.exports = function($log, uuid, $q, akamTableTemplate, $compile, $parse, translate,
                          filterFilter, orderByFilter, limitToFilter) {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      items: '=',
      idProperty: '@',
      filterPlaceholder: '@',
      noFilterResultsMessage: '@',
      noItemsMessage: '=?',
      selectedItems: '=?', // selected items from the outside
      onSelect: '&?',
      onChange: '&?'
    },
    controller: TableController,
    controllerAs: 'table',

    // this method finds the akam-table-toolbar and the akam-table-row and saves them away. Then,
    //it will show or hide elements in the template HTML file based on options that are
    // passed in
    template: function(element, attributes) {
      var tpl = angular.element(tableDirectiveTemplate),
        selector, toolbarElem, tableRowElem;

      toolbarElem = element.find(toolbarSelector);
      tableRowElem = element.find(rowSelector);

      if (toolbarElem.length) {
        tpl.find(toolbarSelector + '-placeholder').html(toolbarElem[0].outerHTML);
      }

      if (tableRowElem.length) {
        tpl.find(rowSelector + '-placeholder').html(tableRowElem[0].outerHTML);
      } else {
        $log.debug('No', rowSelector, 'tag found. Nothing will render.');
      }

      // remove filter (and possibly the entire toolbar) if necessary
      if (angular.isDefined(attributes.notFilterable)) {
        if (tpl.find(toolbarSelector).length) {
          selector = 'span.filter';
        } else {
          selector = '.toolbar';
        }
        angular.element(tpl[0].querySelector(selector)).remove();
      }

      // remove pagination if necessary
      if (angular.isDefined(attributes.notPageable)) {
        tpl.find('akam-pagination').remove();
      }

      return tpl[0].outerHTML;
    },

    // this method creates new scopes for the akam-table-toolbar and the akam-table-row. It then
    // uses $compile to compile those templates against the newly created scopes.
    // the scope tied to the table row will have a special variable called `table` that will have
    // information injected by this scope
    link: function(scope, element, attributes) {
      var tableScope = scope.$parent.$new(),
        toolbarScope = scope.$parent.$new(),
        table = element.find(rowSelector + '-placeholder'),
        toolbar = element.find(toolbarSelector + '-placeholder'),
        selectable = !!element.attr('selected-items') || !!element.attr('on-select'),
        tableRowElem = element.find(rowSelector),
        toolbarElem = element.find(toolbarSelector),
        template = akamTableTemplate.template(tableRowElem, attributes, selectable);

      // set scope variables for our <table> element and compile
      tableScope.table = scope.table;
      table.replaceWith($compile(template)(tableScope));

      // compile the toolbar as well, with a new scope
      if (toolbarElem.length) {
        toolbar.replaceWith($compile(toolbarElem[0].outerHTML)(toolbarScope));
      }

      // handle setting sorting and filtering state based on the 'not-sortable'
      //and 'not-filterable' attrs this will potentially modify the scope.table.state object
      angular.forEach(element.find('th'), function(header) {
        addDefaultSort(scope, attributes, header);
        addFilterableColumns(scope, attributes, header);
      });
    }
  };

  // add sortable class and keep track of sortable columns
  function addDefaultSort(scope, attributes, header) {
    if (header.hasAttribute('default-sort')) {
      if (!angular.isDefined(attributes.notSortable) &&
        !header.hasAttribute('not-sortable') &&
        header.hasAttribute('row-property')) {
        scope.table.state.sortColumn = header.getAttribute('row-property');
      } else {
        $log.debug('Tried to set default sort column as', header.getAttribute('row-property'),
          'but it is not sortable');
      }
    }
  }

  // keep track of filterable columns
  function addFilterableColumns(scope, attributes, header) {
    if (!angular.isDefined(attributes.notFilterable) &&
      !header.hasAttribute('not-filterable') &&
      header.hasAttribute('row-property')) {

      scope.table.state.filterableColumns.push(header.getAttribute('row-property'));
    }
  }

  /**
   * Table controller. Used to handle the various interactions for the table.
   * @constructor
   */
  /* @ngInject */
  function TableController($scope) {
    // auto increment table ID. This is used purely for the HTML label and input
    this.id = uuid.uid();

    // this ID is used as a 'track by' clause as well as to keep track of selected rows
    this.idPropertyFn = $parse(this.idProperty || 'id');

    // used to handle filter, sorting and paginating. Can be passed to the resource model
    // to allow them to fetch a new page of data from the server
    this.state = {
      totalItems: 0,
      filter: '',
      filterableColumns: [],
      sortColumn: '',
      sortDirection: defaultSortDirection,
      pageSize: 0,
      pageNumber: 0
    };

    // mapping between row id properties and a boolean indicating whether or not the
    // row is selected
    this.selectedItemsMap = {};
    this.rowSelectedClass = rowSelectedClass;

    this.sortDirectionClass = sortDirectionClass;
    this.sortColumn = sortColumn;

    this.pageChanged = pageChanged;
    this.pageSizeChanged = pageSizeChanged;

    this.applyState = applyState;
    this.filterRows = filterRows;
    this.updateRowData = updateRowData;

    this.toggleSelected = toggleSelected;

    this.messages = messages;
    translateMessages.call(this);

    $scope.$watch('table.items', angular.bind(this, loadingFn));
    $scope.$watch('table.selectedItems', angular.bind(this, setSelectedItems));

    // --- utility methods below ---

    /**
     * Method to load the data table
     * @this TableController
     */
    function loadingFn() {
      this.loading = true;
      $q.when(this.items)
        .then(angular.bind(this, updateRowData))
        .then(angular.bind(this, doneLoading))
        .catch(angular.bind(this, failedLoading));
    }

    /**
     * Rebuilds the internal selected rows map based on the selected items
     * @this TableController
     * @param {Object[]} items the set of selected items
     */
    function setSelectedItems(items) {
      this.selectedItemsMap = {};

      angular.forEach(items, function(item) {
        this.selectedItemsMap[this.idPropertyFn(item)] = true;
      }, this);
    }

    /**
     * Toggles the selected row. Handles updating the selectedItems property.
     * @this TableController
     * @param {Object} row the row that has been selected or de-selected
     */
    function toggleSelected(row) {
      var index;

      if (this.selectedItemsMap[this.idPropertyFn(row)]) {
        this.selectedItems.push(row);
      } else {
        index = this.selectedItems.indexOf(row);
        if (index > -1) {
          this.selectedItems.splice(index, 1);
        }
      }

      if (angular.isFunction(this.onSelect)) {
        this.onSelect({selectedItems: this.selectedItems});
      }
    }

    /**
     * Determines the selection class for a selectable column
     * @this TableController
     * @param {String} id the id of this row
     * @returns {String} class name for the template to know whether this row is selected or not
     */
    function rowSelectedClass(id) {
      if (this.selectedItemsMap[id]) {
        return 'row-selected';
      }

      return '';
    }

    /**
     * Determines the sort classes for a sortable column
     * @this TableController
     * @param {String} columnName the name of the row to apply sorting classes to
     * @returns {String} class names for sort direction
     */
    function sortDirectionClass(columnName) {
      if (columnName === this.state.sortColumn) {
        return sortedClass + ' ' + this.state.sortDirection;
      }
      return '';
    }

    /**
     * Updates the sort state. Flips the sort direction if we are changing columns
     * @this TableController
     * @param {String} columnName the column that we should sort by
     */
    function sortColumn(columnName) {

      // flip sort direction
      if (columnName === this.state.sortColumn) {
        if (this.state.sortDirection === SORT_DIRECTIONS.asc) {
          this.state.sortDirection = SORT_DIRECTIONS.desc;
        } else {
          this.state.sortDirection = SORT_DIRECTIONS.asc;
        }

      // otherwise, set the sort direction to the default and change the sort column
      } else {
        this.state.sortColumn = columnName;
        this.state.sortDirection = defaultSortDirection;
      }

      this.state.pageNumber = 1;
      this.applyState();
    }

    /**
     * Applies the current state to the data. Filters, then sorts, then limits the results to the
     * page size and offset. Assumes client side operations.
     *
     * This is where we would put in a hook to support server side pagination. We would have to
     * set filtered to the server side results and also set totalItems to the total length.
     *
     * @this TableController
     */
    function applyState() {
      var newData;

      newData = filterFilter(this.pristine, angular.bind(this, filterFn));

      newData = orderByFilter(newData, this.state.sortColumn,
        this.state.sortDirection === SORT_DIRECTIONS.desc);

      this.state.totalItems = newData.length;

      // only apply pagination if it is enabled
      if (this.state.pageNumber && this.state.pageSize) {
        newData = limitToFilter(newData, this.state.pageSize,
          (this.state.pageNumber - 1) * this.state.pageSize);
      }

      if (angular.isFunction(this.onChange)) {
        this.onChange({items: newData});
      }

      this.filtered = newData;
    }

    /**
     * @this TableController
     */
    function filterRows() {
      this.state.pageNumber = 1;
      this.applyState();
    }

    /**
     * Filter function that is applied to check filterable columns. Necessary because angular, will
     * use a boolean AND to specify a filter, and we want a boolean OR on the filterable fields.
     * Will apply lower case to the search string. Objects will never be filtered on
     *
     * @param {Object} value The row object that we are filtering on
     * @this TableController
     * @returns {Boolean} true if value matches, false otherwise
     */
    function filterFn(value) {

      // from angular filter filter code
      function hasCustomToString(obj) {
        return angular.isFunction(obj.toString) && obj.toString !== Object.prototype.toString;
      }

      return !this.state.filterableColumns.length ||
        this.state.filterableColumns.some(function(column) {
        var actual = $parse(column)(value),
          expected = this.state.filter.toLowerCase();

        return actual !== null &&
          !angular.isUndefined(actual) &&
          (!angular.isObject(actual) || angular.isObject(actual) && hasCustomToString(actual)) &&
          actual.toString().toLowerCase().indexOf(expected) !== -1;
      }, this);
    }

    /**
     * Sets an object that can be used in `ng-messages` depending on table state
     * @returns {Object} messages to be used in the data table
     */
    function messages() {
      return {
        noData: this.pristine && this.pristine.length === 0 && !this.loading,
        noFiltered: this.filtered && this.filtered.length === 0 && !this.loading
      };
    }

    /**
     * Sets the appropriate values for strings that should appear in this component
     * @this TableController
     */
    function translateMessages() {
      if (!angular.isDefined(this.filterPlaceholder)) {
        translate.async('components.data-table.placeholder.filter')
          .then(angular.bind(this, setTranslatedValue, 'filterPlaceholder'));
      }

      if (!angular.isDefined(this.noFilterResultsMessage)) {
        translate.async('components.data-table.text.noFilterResults')
          .then(angular.bind(this, setTranslatedValue, 'noFilterResultsMessage'));
      }

      if (!angular.isDefined(this.noItemsMessage)) {
        translate.async('components.data-table.text.noDataMessage')
          .then(angular.bind(this, setTranslatedValue, 'noItemsMessage'));
      }
    }

    /**
     * Sets the page number
     * @this TableController
     * @param {Number} page the new page number
     */
    function pageChanged(page) {
      this.state.pageNumber = page;
      this.applyState();
    }

    /**
     * Sets the page size
     * @this TableController
     * @param {Number} size new page size
     */
    function pageSizeChanged(size) {
      this.state.pageSize = size;
      this.applyState();
    }

    /**
     * Sets loading to false
     * @this TableController
     * @param {Object[]} data data
     * @returns {Object[]} data
     */
    function doneLoading(data) {
      this.loading = false;
      return data;
    }

    /**
     * Sets failure state to true
     * @this TableController
     * @param {Object[]} data data
     * @returns {Object[]} data
     */
    function failedLoading(data) {
      this.failed = true;
      return data;
    }

    /**
     * Convenience method that can be used to set a property of "this" to a translated value
     * @this TableController
     * @param {String} key the key
     * @param {String} value the value
     * @returns {String} the value
     */
    function setTranslatedValue(key, value) {
      this[key] = value;
      return value;
    }

    /**
     * Updates the filtered data
     * @this TableController
     * @param {Object[]} data data
     * @param {Object[]} data.data Row data
     * @returns {Object[]} data
     */
    function updateRowData(data) {
      if (data.data) {
        data = data.data;
      }

      this.pristine = data;
      this.state.pageNumber = 1;
      this.applyState();
      return data;
    }

  }
};