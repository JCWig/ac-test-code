'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function($log, $q, $timeout, uuid, $filter, translate) {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      data: '=',
      schema: '=',
      filterPlaceholder: '@',
      noFilterResultsMessage: '@',
      noDataMessage: '=?',
      noneSelectedMessage: '@',
      // the ? marks the property as optional.
      selectedItems: '=?',
      onChange: '&?'
    },

    /* @ngInject */
    controller: function($scope) {
      this.loadMoreData = function() {
        var current = $scope.page * 10;
        var end = $scope.page * 10 + 10;
        var i;

        for (i = current; i < end; i++) {
          if (!$scope.dataTable || !$scope.dataTable[i]) {
            break;
          }
          $scope.dataSource.push($scope.dataTable[i]);
        }
        $scope.page++;
      };
    },

    template: require('./templates/list-box.tpl.html'),

    link: function(scope) {
      var orderBy = $filter('orderBy'),
        filter = $filter('filter'),
        messages = {
          filterPlaceholder: scope.filterPlaceholder,
          noFilterResultsMessage: scope.noFilterResultsMessage,
          noDataMessage: scope.noDataMessage,
          noneSelectedMessage: scope.noneSelectedMessage
        },
        fullDataSet;

      scope.loading = true;
      scope.tableId = uuid.guid();
      scope.selectedItems = scope.selectedItems || [];
      scope.state = getDefaults();
      scope.getColumnClasses = getColumnClasses;
      scope.dataTable = [];
      scope.dataSource = [];
      scope.page = 1;

      scope.$watch('dataTable', function(newData) {
        var sourceData = [], i;

        scope.page = 1;
        for (i = 0; i < 10; i++) {
          if (!newData || !newData[i]) {
            break;
          }
          sourceData.push(newData[i]);
        }
        scope.dataSource = sourceData;
      });

      // batch all translate calls so it, in theory, should only cause 1 digest
      $q.all([
        translate.async('components.list-box.placeholder.filter'),
        translate.async('components.list-box.text.selected'),
        translate.async('components.list-box.text.noFilterResults'),
        translate.async('components.list-box.text.noDataMessage'),
        translate.async('components.list-box.text.viewSelectedOnly')
      ]).then(function(values) {

        messages.filterPlaceholder = messages.filterPlaceholder || values[0];
        messages.selectedText = values[1];
        messages.noFilterResultsMessage = messages.noFilterResultsMessage || values[2];
        messages.noDataMessage = messages.noDataMessage || values[3];
        messages.noneSelectedMessage = messages.noneSelectedMessage || values[4];

        scope.messages = messages;
      });

      /**
       * Method to update scope.state.search. This sets the 'expression' field that is used in the
       * filter filter in the template. In particular, this one searches on each row's 'searchTitle'
       * field and can optionally filter based on whether or not the field is selected
       * (to support the 'Show Selected Only' checkbox)
       */
      scope.updateSearchFilter = function() {
        if (scope.state.viewSelectedOnly === true) {
          scope.state.search = {
            selected: true,
            searchTitle: scope.state.filter
          };
        } else {
          scope.state.search = {
            searchTitle: scope.state.filter
          };
        }

        scope.dataTable = filter(fullDataSet, scope.state.search);
      };

      scope.processDataTable = function() {
        var dataTableOutput, newItem, allText, autoSortableColumns;

        // we can only really process the data if both fields are set
        if (scope.columns == null || scope.internalData == null) {
          return;
        }

        // TODO: to our future selves: this assumes that the
        // selected items actually exist in the data array so we should
        // consider that when redoing this module
        dataTableOutput = scope.internalData.map(function(dataItem) {
          newItem = {
            id: uuid.guid(),
            selected: isSelected(scope.selectedItems, dataItem),
            cells: scope.columns.map(
              function(column) {
                return {
                  id: uuid.guid(),
                  content: getColumnContent(column, dataItem, column.defaultValue)
                };
              }
            ),
            titles: scope.columns.map(
              function(column) {
                return getColumnTitles(column, dataItem, '');
              }
            ),
            item: dataItem
          };

          // adds a key to search on just the text elements in the row. We accomplish this by
          // wrapping the content in a span element and using `angular.element` to get the
          // inner text. This does make the digest cycle a little longer (as we're creating
          // and destroying one DOM element per row. If this directive is updated to only
          // take in text, then this can be simplified
          allText = newItem.cells.map(function(cell) {
            return cell.content;
          }).join(' ');
          newItem.searchTitle = angular.element('<span>' + allText + '</span>').text();

          return newItem;
        });

        autoSortableColumns = scope.columns.filter(
          function(col) {
            return col.sort !== false && col.autoSort !== false;
          }
        );

        fullDataSet = dataTableOutput;

        scope.totalCount = fullDataSet.length;

        scope.dataTable = dataTableOutput;
        if (autoSortableColumns.length > 0) {
          scope.sortColumn(autoSortableColumns[0]);
        }
        scope.loading = false;
      };

      scope.$watch('data', function() {
        var dataArrayErrorMessage = 'Data must be an array';

        scope.loading = true;
        scope.failed = false;
        $q.when(scope.data).then(function(data) {
          //handle $http get promise responses.
          if (angular.isObject(data) && angular.isDefined(data.data)) {
            data = data.data;
          }

          if (!angular.isArray(data)) {
            throw dataArrayErrorMessage;
          }

          scope.state = getDefaults();
          scope.updateSearchFilter();
          scope.internalData = data;

          $timeout(function() {
            scope.processDataTable();
          }, 0);

        }).catch(function() {
          scope.failed = true;
        });
      });

      scope.$watch('schema', function(newValue) {
        var schemaArrayErrorMessage = 'Schema must be an array';

        if (!angular.isArray(newValue)) {
          throw schemaArrayErrorMessage;
        }

        scope.columns = angular.copy(newValue).map(function(value, index) {
          value.index = index;
          return value;
        });
        scope.processDataTable();
      });

      scope.selectAll = function() {
        var newValue;

        if (!scope.dataTable || scope.dataTable.length === 0) {
          return;
        }

        newValue = scope.state.allSelected;

        scope.dataTable.forEach(function(currentValue) {
          currentValue.selected = newValue;
          scope.updateChanged(currentValue);
        });

      };

      scope.updateChanged = function(item) {
        var i = scope.selectedItems.indexOf(item.item);

        if (item.selected) {
          if (i === -1) {
            scope.selectedItems.push(item.item);
          }
        } else {
          scope.selectedItems.splice(i, 1);
          if (scope.state.viewSelectedOnly) {
            scope.dataTable = scope.dataTable.filter(function(rowItem) {
              return rowItem !== item;
            });
          }
        }

        if (typeof scope.onChange === 'function') {
          scope.onChange({value: scope.selectedItems});
        }
      };

      scope.sortColumn = function(column) {
        var columnUndefinedErrorMessage = 'Column may not be null/undefined';
        var sortInfo, isSameColumnFromLastSort, isReversed, predicate;

        if (column == null) {
          throw columnUndefinedErrorMessage;
        }

        // make sure we have a valid dataset to sort & ensure at least 2 elements
        if (!angular.isArray(scope.dataTable) || scope.dataTable.length < 2) {
          return;
        }

        sortInfo = scope.state.sortInfo;

        // first check if the column we're sorting is the same column from the last sort
        isSameColumnFromLastSort = sortInfo.sortedColumn === column;

        isReversed = false;

        if (isSameColumnFromLastSort) {
          // if we're sorting the same column, just flip the order and go
          isReversed = !sortInfo.reverseSort;
        } else {
          // otherwise, start the sort from the user defined override or default value
          isReversed = !!column.reversed;
        }

        predicate = getColumnPredicate(column);

        scope.state.sortInfo = {
          sortedColumn: column,
          predicate: predicate,
          reverseSort: isReversed
        };

        scope.dataTable = orderBy(scope.dataTable,
          scope.state.sortInfo.predicate,
          scope.state.sortInfo.reverseSort);

        scope.internalData = [];
        angular.forEach(scope.dataTable, function(dataObj) {
          scope.internalData.push(dataObj.item);
        });
      };
    }

  };
};

function getDefaults() {
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

// below is a set of utility functions that don't need any information specific
// to a directive

function isSelected(selectedItems, itemToCheck) {
  return selectedItems.filter(function(item) {
      return item === itemToCheck;
    }).length > 0;
}

function convertToString(value) {
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

function getColumnContent(column, item, defaultValue) {
  var columnContent = column.content;
  var columnUnknownTypeErrorMessage = 'The column content field is using an unknown type.' +
    ' Content field may only be String or Function type';

  if (angular.isString(columnContent)) {
    if (columnContent in item) {
      // retrieve the property for the item with the same name
      return convertToString(item[columnContent] || defaultValue);
    } else {
      // this means that the property is undefined in the object
      return defaultValue;
    }
  } else if (angular.isFunction(columnContent)) {
    // return the content based on the result of the function call
    return convertToString(column.content.call(item) || defaultValue);
  }

  throw columnUnknownTypeErrorMessage;
}

function getColumnTitles(column, item, defaultValue) {
  var title;

  if (angular.isFunction(column.title)) {
    title = column.title.call(item);
  }
  return title || defaultValue;
}

function isSortable(column) {
  return column.sort !== false;
}

function getColumnPredicate(column) {
  var predicate;

  if (column.sort === false) {
    return null;
  }

  if (column.sort != null && column.sort !== true) {
    predicate = angular.isString(column.sort) ? '+item.' + column.sort : function(obj) {
      return column.sort.call(obj.item);
    };
  } else {
    predicate = angular.isString(column.content) ? '+item.' + column.content : function(obj) {
      return column.content.call(obj.item);
    };
  }

  return predicate;
}

function getColumnClasses(column, isHeader, state) {
  var output = '',
    sortedColumn = state.sortInfo.sortedColumn,
    reverseSort = state.sortInfo.reverseSort;

  if (isHeader && isSortable(column)) {
    output = getColumnSortClass(column, sortedColumn, reverseSort) + ' ';
  }

  output += column.className ? column.className : 'column';
  return output;
}

function getColumnSortClass(column, sortedColumn, reverseSort) {
  if (column !== sortedColumn) {
    return 'column-sortable';
  }

  return 'column-sortable column-sorted ' + (reverseSort ? 'desc' : 'asc');
}