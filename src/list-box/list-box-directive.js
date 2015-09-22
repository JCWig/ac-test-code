import angular from 'angular';
import template from './templates/list-box.tpl.html';

function listBox($log, $q, $timeout, uuid, $filter, $translate) {

  class ListBoxController {

    constructor($scope) {
      this.orderBy = $filter('orderBy');
      this.staticMessages = {
        filterPlaceholder: this.filterPlaceholder,
        noFilterResultsMessage: this.noFilterResultsMessage,
        noneSelectedMessage: this.noneSelectedMessage
      };

      this.loading = true;
      this.tableId = uuid.guid();
      this.selectedItems = this.selectedItems || [];
      this.state = ListBoxController.getDefaults();
      this.dataTable = [];
      this.dataSource = [];
      this.page = 1;

      this.loadMoreData = function() {
        for (let i = this.page * 10; i < this.page * 10 + 10; i++) {
          if (!this.dataTable || !this.dataTable[i]) {
            break;
          }
          this.dataSource.push(this.dataTable[i]);
        }
        this.page++;
      };

      $scope.$watch('listBox.dataTable', (newData) => {
        let sourceData = [];

        this.page = 1;
        for (let i = 0; i < 10; i++) {
          if (!newData || !newData[i]) {
            break;
          }
          sourceData.push(newData[i]);
        }
        this.dataSource = sourceData;
      });

      $scope.$watch('listBox.data', () => {

        this.loading = true;
        this.failed = false;
        $q.when(this.data).then((data) => {
          //handle $http get promise responses.
          if (angular.isObject(data) && angular.isDefined(data.data)) {
            data = data.data;
          }

          if (!angular.isArray(data)) {
            throw new Error('Data must be an array');
          }

          this.state = ListBoxController.getDefaults();
          this.updateSearchFilter();
          this.internalData = data;

          $timeout(() => this.processDataTable(), 0);
        }).catch(() => this.failed = true);
      });

      $scope.$watch('listBox.schema', (newValue) => {
        if (!angular.isArray(newValue)) {
          throw new Error('Schema must be an array');
        }

        this.columns = angular.copy(newValue).map((value, index) => {
          value.index = index;
          return value;
        });

        this.processDataTable();
      });

    }

    /**
     * Method to update scope.state.search. This sets the 'expression' field that is used in the
     * filter filter in the template. In particular, this one searches on each row's 'searchTitle'
     * field and can optionally filter based on whether or not the field is selected
     * (to support the 'Show Selected Only' checkbox)
     */
    updateSearchFilter() {
      if (this.state.viewSelectedOnly === true) {
        this.state.search = {
          selected: true,
          searchTitle: this.state.filter
        };
      } else {
        this.state.search = {
          searchTitle: this.state.filter
        };
      }

      this.dataTable = this.orderBy($filter('filter')(this.fullDataSet, this.state.search),
        this.state.sortInfo.predicate,
        this.state.sortInfo.reverseSort);
      this.manageStates();
    }

    manageStates() {
      if (this.dataTable) {
        let selectedItems = this.getSelectedItems();

        this.state.allSelected =
          this.dataTable.length && selectedItems.length === this.dataTable.length;
        if (!selectedItems.length && this.state.viewSelectedOnly) {
          this.state.viewSelectedOnly = false;
          this.updateSearchFilter();
        }
      }
    }

    processDataTable() {
      var newItem, autoSortableColumns;

      // we can only really process the data if both fields are set
      if (this.columns == null || this.internalData == null) {
        return;
      }

      // TODO: to our future selves: this assumes that the
      // selected items actually exist in the data array so we should
      // consider that when redoing this module
      let dataTableOutput = this.internalData.map((dataItem) => {
        newItem = {
          id: uuid.guid(),
          selected: ListBoxController.isSelected(this.selectedItems, dataItem),
          cells: this.columns.map(
            function(column) {
              return {
                id: uuid.guid(),
                content: ListBoxController.getColumnContent(column, dataItem, column.defaultValue)
              };
            }
          ),
          titles: this.columns.map((column) => {
            return ListBoxController.getColumnTitles(column, dataItem, '');
          }),

          item: dataItem
        };

        // adds a key to search on just the text elements in the row. We accomplish this by
        // wrapping the content in a span element and using `angular.element` to get the
        // inner text. This does make the digest cycle a little longer (as we're creating
        // and destroying one DOM element per row. If this directive is updated to only
        // take in text, then this can be simplified
        let allText = newItem.cells.map(cell => cell.content).join(' ');

        newItem.searchTitle = angular.element('<span>' + allText + '</span>').text();

        return newItem;
      });

      autoSortableColumns = this.columns.filter(
        col => col.sort !== false && col.autoSort !== false
      );

      this.fullDataSet = dataTableOutput;

      this.totalCount = this.fullDataSet.length;

      this.dataTable = dataTableOutput;
      if (autoSortableColumns.length > 0) {
        this.sortColumn(autoSortableColumns[0]);
      }
      this.loading = false;
      this.manageStates();
    }

    selectAll() {
      if (!this.dataTable || this.dataTable.length === 0) {
        return;
      }

      let newValue = this.state.allSelected;

      this.dataTable.forEach((currentValue) => {
        currentValue.selected = newValue;
        this.updateChanged(currentValue);
      });

      if (!this.state.allSelected && this.state.viewSelectedOnly) {
        this.state.viewSelectedOnly = false;
        this.updateSearchFilter();
      }
    }

    updateChanged(item) {
      let i = this.selectedItems.indexOf(item.item);

      if (item.selected) {
        if (i === -1) {
          this.selectedItems.push(item.item);
        }
      } else {
        this.selectedItems.splice(i, 1);
        if (this.state.allSelected) {
          this.state.allSelected = false;
        }
        if (this.state.viewSelectedOnly) {
          this.dataTable = this.dataTable.filter(rowItem => rowItem !== item);
        }
      }

      this.manageStates();
      if (angular.isFunction(this.onChange)) {
        this.onChange({
          value: this.selectedItems
        });
      }
    }

    sortColumn(column) {
      if (column == null) {
        throw new Error('Column may not be null/undefined');
      }

      // make sure we have a valid dataset to sort & ensure at least 2 elements
      if (!angular.isArray(this.dataTable) || this.dataTable.length < 2) {
        return;
      }

      let isReversed = false;

      if (this.state.sortInfo.sortedColumn === column) {
        // if we're sorting the same column, just flip the order and go
        isReversed = !this.state.sortInfo.reverseSort;
      } else {
        // otherwise, start the sort from the user defined override or default value
        isReversed = !!column.reversed;
      }

      this.state.sortInfo = {
        sortedColumn: column,
        predicate: ListBoxController.getColumnPredicate(column),
        reverseSort: isReversed
      };

      this.dataTable = this.orderBy(this.dataTable,
        this.state.sortInfo.predicate,
        this.state.sortInfo.reverseSort);

      this.internalData = [];

      angular.forEach(this.dataTable, dataObj => this.internalData.push(dataObj.item));
    }

    getSelectedItems() {
      return this.dataTable ? this.dataTable.filter(item => item.selected) : [];
    }

    hasSelectedItems() {
      return this.getSelectedItems().length > 0;
    }

    getColumnClasses(column, isHeader, state) {
      let output = '',
        sortedColumn = state.sortInfo.sortedColumn,
        reverseSort = state.sortInfo.reverseSort;

      if (isHeader && ListBoxController.isSortable(column)) {
        output = ListBoxController.getColumnSortClass(column, sortedColumn, reverseSort) + ' ';
      }

      output += column.className ? column.className : 'column';
      return output;
    }

    /**
     * translateMessages method for translate all messages that includes
     * values attributes from noDataMessageValues, noFilterResultsMessageValues,
     * noneSelectedMessageValues for varaible replacements
     * @param  {Object} attr Directive node attribute
     */
    translateMessages(attr) {
      let filterplaceholderMessage = this.staticMessages.filterPlaceholder ||
        'components.list-box.placeholder.filter',

        noDataMessage = this.noDataMessage ||
        'components.list-box.text.noDataMessage',

        noFilterResultsMessage = this.staticMessages.noFilterResultsMessage ||
        'components.list-box.text.noFilterResults',

        noneSelectedMessage = this.staticMessages.noneSelectedMessage ||
        'components.list-box.text.viewSelectedOnly',

        selectedText = this.staticMessages.selectedText ||
        'components.list-box.text.selected';

      $translate(filterplaceholderMessage)
        .then(value => this.staticMessages.filterPlaceholder = value);

      $translate(noDataMessage, angular.fromJson(attr.noDataMessageValues))
        .then(value => this.noDataMessage = value);

      $translate(noFilterResultsMessage, angular.fromJson(attr.noFilterResultsMessageValues))
        .then(value => this.staticMessages.noFilterResultsMessage = value);

      $translate(noneSelectedMessage, angular.fromJson(attr.noneSelectedMessageValues))
        .then(value => this.staticMessages.noneSelectedMessage = value);

      $translate(selectedText)
        .then(value => {
          this.staticMessages.selectedText = value;
          // set messages equal to staticMessages after all staticMessage.* have been translated
          // otherwise translation key will be displayed
          this.messages = this.staticMessages;
        });
    }

    static getDefaults() {
      return {
        sortInfo: {
          sortedColumn: null,
          predicate: null,
          reverseSort: false
        },
        viewSelectedOnly: false,
        allSelected: false,
        filter: '',
        search: {
          searchTitle: ''
        }
      };
    }

    static isSelected(selectedItems, itemToCheck) {
      return selectedItems.filter(item => item === itemToCheck).length > 0;
    }

    static getColumnContent(column, item, defaultValue) {

      if (angular.isString(column.content)) {
        if (column.content in item) {
          // retrieve the property for the item with the same name
          return ListBoxController.convertToString(item[column.content] || defaultValue);
        } else {
          // this means that the property is undefined in the object
          return defaultValue;
        }
      } else if (angular.isFunction(column.content)) {
        // return the content based on the result of the function call
        return ListBoxController.convertToString(column.content.call(item) || defaultValue);
      }

      throw 'The column content field is using an unknown type.' +
      ' Content field may only be String or Function type';
    }

    static convertToString(value) {
      if (value == null) {
        return '';
      }

      if (angular.isArray(value)) {
        return value.join('<br />');
      }

      if (angular.isNumber(value) || angular.isDate(value) ||
        value === true || value === false) {
        return value.toString();
      }

      return value;
    }

    static getColumnTitles(column, item, defaultValue) {
      let title;

      if (angular.isFunction(column.title)) {
        title = column.title.call(item);
      }
      return title || defaultValue;
    }

    static isSortable(column) {
      return column.sort !== false;
    }

    static getColumnPredicate(column) {
      let predicate;

      if (column.sort === false) {
        return null;
      }

      if (column.sort != null && column.sort !== true) {
        predicate = angular.isString(column.sort) ?
          '+item.' + column.sort : obj => column.sort.call(obj.item);
      } else {
        predicate = angular.isString(column.content) ?
          '+item.' + column.content : obj => column.content.call(obj.item);
      }

      return predicate;
    }

    static getColumnSortClass(column, sortedColumn, reverseSort) {
      return column !== sortedColumn ?
        'column-sortable' : 'column-sortable column-sorted ' + (reverseSort ? 'desc' : 'asc');
    }

  }

  ListBoxController.$inject = ['$scope'];

  return {
    replace: true,
    restrict: 'E',
    scope: {},
    bindToController: {
      data: '=',
      schema: '=',
      filterPlaceholder: '@',
      noFilterResultsMessage: '@',
      noDataMessage: '@?',
      noneSelectedMessage: '@',
      selectedItems: '=?',
      onChange: '&?'
    },
    controller: ListBoxController,
    controllerAs: 'listBox',
    template: template,
    link: (scope, elem, attr) => {
      scope.listBox.translateMessages(attr);
    }
  };
}
listBox.$inject = ['$log', '$q', '$timeout', 'uuid', '$filter', '$translate'];

export default listBox;
