'use strict';

/* @ngInject */
module.exports = function($log, $q, uuid, $filter, translate) {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            data: '=',
            schema: '=',
            filterPlaceholder: "@",
<<<<<<< HEAD
            selectedItems: '=?',
            noFilterResultsMessage :"@",
            noDataMessage : "@",
            noneSelectedMessage :"@",
=======
            selectedItems: '=?',  // the ? marks the property as optional.
>>>>>>> develop
            onChange: "&?"
        },
        template: require('./templates/list-box.tpl.html'),
        link: function(scope, element, attrs) {
            var orderBy = $filter('orderBy');
            scope.loading = true;
            scope.tableId = uuid.guid();
            if (!scope.filterPlaceholder) {
                translate.async("components.list-box.placeholder.filter").then(function(value) {
                    scope.filterPlaceholder = value;
                });
            }

            translate.async("components.list-box.text.selected").then(function(value) {
                scope.selectedText = value;
            });
            if (!scope.noFilterResultsMessage) {
                translate.async("components.list-box.text.noFilterResults").then(function(value) {
                    scope.noFilterResultsMessage = value;
                });
            }
            if (!scope.noDataMessage) {
                translate.async("components.list-box.text.noDataMessage").then(function(value) {
                    scope.noDataMessage = value;
                });
            }
            if (!scope.noneSelectedMessage) {
                translate.async("components.list-box.text.viewSelectedOnly").then(function(value) {
                    scope.noneSelectedMessage = value;
                });
            }

            scope.selectedItems = scope.selectedItems || [];
            scope.internalSelectedItems = angular.copy(scope.selectedItems);
            function setDefaults(){
                scope.state = {
                    sortInfo: {
                        sortedColumn: null,
                        predicate: null,
                        reverseSort: false
                    },
                    viewSelectedOnly: false,
                    allSelected: false,
                    filter: "",
                    search: {
                        'cells': ''
                    }
                };
            }
            setDefaults();
            scope.updateSearchFilter = function() {
                if (scope.state.viewSelectedOnly === true) {
                    scope.state.search = {
                        'selected': true,
                        'cells': scope.state.filter
                    };
                } else {
                    scope.state.search = {
                        'cells': scope.state.filter
                    };
                }
            };

            scope.getColumnContent = function(column, item, defaultValue) {
                var columnContent = column.content;

                if (angular.isString(columnContent)) {
                    if (columnContent in item) {
                        // retrieve the property for the item with the same name
                        return item[columnContent] || defaultValue;
                    } else {
                        // this means that the property is undefined in the object
                        return defaultValue;
                    }
                } else if (angular.isFunction(columnContent)) {
                    // return the content based on the result of the function call
                    return angular.bind(item, column.content)() || defaultValue;
                }

                throw "The column content field is using an unknown type.  Content field may only be String or Function type";
            };

            scope.processDataTable = function(skipSort) {
                // we can only really process the data if both fields are set
                if (scope.columns == null || scope.internalData == null) {
                    return;
                }
                // do the same process as ng-repeat, except we do this only once to cache the output
                var dataTableOutput = new Array(scope.internalData.length);
                angular.forEach(scope.internalData, function(dataItem, key) {
                    dataTableOutput[key] = {
                        selected: scope.internalSelectedItems.filter(function(item) { return item === dataItem; }).length > 0,
                        cells: scope.columns.map(
                            function(column) {
                                return scope.getColumnContent(column, dataItem, column.defaultValue);
                            }
                        ),
                        item: dataItem
                    };
                });
                var autoSortableColumns = scope.columns.filter(
                    function(col) {
                        return col.sort !== false && col.autoSort !== false;
                    }
                );
                scope.dataTable = dataTableOutput;
                if (!skipSort && autoSortableColumns.length > 0) {
                    scope.sortColumn(autoSortableColumns[0]);
                }

                scope.loading = false;
            };

            scope.$watch('selectedItems', function(items) {
                if(angular.isArray(items)) {
                    scope.internalSelectedItems = items;
                    scope.processDataTable(true);
                }
            });

            scope.$watch('data', function(newValue) {
                scope.loading = true;
                $q.when(scope.data).then(function(data) {
                    //handle $http get promise responses.
                    if (angular.isObject(data) && angular.isDefined(data.data)) {
                        data = data.data;
                    }

                    if (!angular.isArray(data)) {
                        throw "Data must be an array";
                    }
                    
                    if(!!scope.internalData){
                        scope.selectedItems = [];
                    }

                    setDefaults();
                    scope.updateSearchFilter();
                    scope.internalData = data;
                    scope.processDataTable();
                });
            });

            scope.$watch('schema', function(newValue) {
                if (!angular.isArray(newValue)) {
                    throw "Schema must be an array";
                }
                scope.columns = angular.copy(newValue).map(function(value, index) {
                    value.index = index;
                    return value;
                });
                scope.processDataTable();
            });

            scope.showCheckboxes = attrs.showCheckboxes !== 'false';

            scope.$watch('state.allSelected', function(newValue) {
                if (!scope.dataTable) {
                    return;
                }

                scope.dataTable.forEach(function(currentValue, index) {
                    currentValue.selected = newValue;
                });

                scope.updateChanged();
            });

            scope.updateChanged = function() {
                var selectedItemsList = [];

                angular.forEach(scope.dataTable, function(tableItem) {
                    if (tableItem.selected) {
                        selectedItemsList.push(tableItem.item);
                    }
                });

                scope.selectedItems = selectedItemsList;

                if(angular.isFunction(scope.onChange)) {
                  scope.onChange({
                      value: selectedItemsList
                  });
                }
            };

            scope.sortColumn = function(column) {
                if (column == null) {
                    throw "Column may not be null/undefined";
                }

                // make sure we have a valid dataset to sort & ensure at least 2 elements
                if (!angular.isArray(scope.dataTable) || scope.dataTable.length < 2) {
                    return;
                }

                var sortInfo = scope.state.sortInfo;

                // first check if the column we're sorting is the same column from the last sort
                var isSameColumnFromLastSort = sortInfo.sortedColumn === column;

                var isReversed = false;

                if (isSameColumnFromLastSort) {
                    // if we're sorting the same column, just flip the order and go
                    isReversed = !sortInfo.reverseSort;
                } else {
                    // otherwise, start the sort from the user defined override or default value
                    isReversed = !!column.reversed;
                }

                var predicate = scope.getColumnPredicate(column);

                scope.state.sortInfo = {
                    sortedColumn: column,
                    predicate: predicate,
                    reverseSort: isReversed
                };

                scope.dataTable = orderBy(scope.dataTable, scope.state.sortInfo.predicate, scope.state.sortInfo.reverseSort);
                scope.internalData = [];
                angular.forEach(scope.dataTable, function(dataObj){
                    scope.internalData.push(dataObj.item);
                });
            };

            scope.getColumnPredicate = function(column) {
                var predicate;

                if (column.sort === false) {
                    return null;
                }

                if (column.sort != null && column.sort !== true) {
                    predicate = angular.isString(column.sort) ? ('+item.' + column.sort) : function(obj) {
                        return angular.bind(obj.item, column.sort)();
                    };
                } else {
                    predicate = angular.isString(column.content) ? ('+item.' + column.content) : function(obj) {
                        return angular.bind(obj.item, column.content)();
                    };
                }

                return predicate;
            };

            scope.isSortable = function(column) {
                return (column.sort !== false);
            };

            scope.getColumnClasses = function(column, isHeader) {
                var output = '';

                if (isHeader && scope.isSortable(column)) {
                    output = scope.getColumnSortClass(column) + ' ';
                }

                output += column.className ? column.className : 'column';
                return output;
            };

            scope.getColumnSortClass = function(column) {
                var sortInfo = scope.state.sortInfo;
                if (column !== sortInfo.sortedColumn) {
                    return 'column-sortable';
                }

                return 'column-sortable column-sorted ' + (sortInfo.reverseSort ? 'desc' : 'asc');
            };
            scope.getEmptyStatusMessage = function(){
                if(scope.dataTable.length === 0 && scope.state.filter){
                    return scope.noFilterResultsMessage;
                }
                else if(scope.dataTable.length === 0 && !scope.state.filter && !scope.state.viewSelectedOnly){
                    return scope.noDataMessage;
                }
                else if(scope.dataTable.length === 0 && !scope.state.filter && scope.state.viewSelectedOnly){
                    return scope.noneSelectedMessage;
                }
            };
        }
    };
};
