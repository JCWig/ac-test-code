'use strict';

/* @ngInject */
module.exports = function($log, $q, uuid, $filter, $compile, translate) {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            data: '=',
            schema: '=',
            filterPlaceholder : "@",
            noFilterResultsMessage :"@",
            noDataMessage : "=?",
            selectedItems:"=?", // selected items from the outside
            onChange : '&?'
        },
        template: require('./templates/data-table.tpl.html'),
        transclude : true,
        link: function(scope, element, attrs, controller, transclude) {
            scope.hasActionColumn = false;
            transclude(function(clone, $scope) {
                if (clone.children().length > 0) {
                    scope.hasActionColumn = true;
                }
            });

            var orderBy = $filter('orderBy');
            var filter = $filter('filter');

            scope.loading = true;
            scope.tableId = uuid.guid();
            if (!scope.filterPlaceholder) {
                translate.async("components.data-table.placeholder.filter").then(function(value) {
                    scope.filterPlaceholder = value;
                });
            }
            if (!scope.noFilterResultsMessage) {
                translate.async("components.data-table.text.noFilterResults").then(function(value) {
                    scope.noFilterResultsMessage = value;
                });
            }
            if (!scope.noDataMessage) {
                translate.async("components.data-table.text.noDataMessage").then(function(value) {
                    scope.noDataMessage = value;
                });
            }
            scope.selectedItems = angular.isArray(scope.selectedItems) ? scope.selectedItems : [];
            scope.internalSelectedItems = angular.copy(scope.selectedItems);
            scope.showCheckboxes = attrs.showCheckboxes === 'true';
            
            function setDefaults(){
                scope.state = {
                    sortInfo : {
                        sortedColumn : null,
                        predicate : null,
                        reverseSort : false
                    },
                    viewSelectedOnly : false,
                    allSelected : false,
                    filter : "",
                    search : {
                        'cells' : ''
                    }
                };
            }

            setDefaults();

            function update(){
                var output = scope.dataTable;
                output = filter(output, scope.state.search);
                output = orderBy(output, scope.state.sortInfo.predicate, scope.state.sortInfo.reverseSort);

                scope.pager.page = 1;

                scope.filtered = output;
            }

    
            scope.updateSearchFilter = function(){
                if (scope.state.viewSelectedOnly === true) {
                    scope.state.search = {
                        'selected' : true,
                        'cells' : scope.state.filter
                    };
                }else{
                    scope.state.search = {
                        'cells' : scope.state.filter
                    };
                }

                update();
            };

            function getColumnContent(column, item, defaultValue){
                var columnContent = column.content;
                if (angular.isString(columnContent)) {
                    if (columnContent in item) {
                        // retrieve the property for the item with the same name
                        return convertToString(item[columnContent] || defaultValue);
                    }else{
                        // this means that the property is undefined in the object
                        return defaultValue;
                    }
                }else if (angular.isFunction(columnContent)) {
                    // return the content based on the result of the function call
                    return convertToString(angular.bind(item, column.content)() || defaultValue);
                }

                throw "The column content field is using an unknown type.  Content field may only be String or Function type";
            }
            function getColumnTitles(column, item, defaultValue) {
                var title;
                if (angular.isFunction(column.title)) {
                    title = column.title.call(item);
                }
                return title || defaultValue;
            }
            function convertToString(value) {
                if (value == null) {
                    return "";
                }

                if (angular.isArray(value)) {
                    return value.join('<br />');
                }

                if (angular.isNumber(value) || angular.isDate(value) || value === true || value === false) {
                    return String(value);
                }

                return value;
            }

            /**
             * @param {Boolean} skipSort true if we want to skip sorting the columns.
             * Used because we may call this from updating the selected items
             */
            scope.processDataTable = function(skipSort){
                // we can only really process the data if both fields are set
                if (scope.columns == null || scope.internalData == null) {
                    return;
                }

                // do the same process as ng-repeat, except we do this only once to cache the output
                var dataTableOutput = new Array(scope.internalData.length);
                angular.forEach(scope.internalData, function(dataItem, key) {
                    dataTableOutput[key] = {
                        selected : scope.internalSelectedItems.filter(function(item) { return item === dataItem; }).length > 0,
                        cells : scope.columns.map(
                            function (column) {
                                return getColumnContent(column, dataItem, column.defaultValue);
                            }
                        ),
                        titles : scope.columns.map(
                            function (column){
                                return getColumnTitles(column, dataItem, "");
                            }
                        ),
                        item : dataItem
                    };
                });

                var autoSortableColumns = scope.columns.filter(
                    function (col) {
                        return col.sort !== false && col.autoSort !== false;
                    }
                );

                scope.dataTable = dataTableOutput;

                scope.pager = {
                    page : 1,
                    size : 10
                };

                if (!skipSort && scope.dataTable.length > 1 && autoSortableColumns.length > 0) {
                    scope.sortColumn(autoSortableColumns[0]);
                }else{
                    update();
                }

                scope.loading = false;
            };

            scope.$watch('selectedItems', function(items) {
                if(angular.isArray(items)) {
                    scope.internalSelectedItems = items;
                    scope.processDataTable(true);
                } else {
                    scope.internalSelectedItems = [];
                    scope.selectedItems = [];
                    scope.processDataTable(true);
                }
            });

            scope.$watch('data', function(newValue) {
                scope.loading = true;
                $q.when(scope.data).then(function(data){
                    if (angular.isObject(data) && angular.isDefined(data.data)) {
                        data = data.data;
                    }

                    if (!angular.isArray(data)) {
                        throw "Data must be an array";
                    }  

                    setDefaults();
                    if(!!scope.internalData){
                        scope.selectedItems = [];
                    }
                    scope.updateSearchFilter();
                    scope.internalData = data;
                    scope.processDataTable();
                });
            });

            scope.$watch('schema', function(newValue){
                if (!angular.isArray(newValue)) {
                    throw "Schema must be an array";
                }
                scope.columns = angular.copy(newValue).map(function(value, index){ value.index = index; return value;});
                scope.processDataTable();
            });

            scope.$watch('state.allSelected', function(newValue){
                if(!scope.dataTable){
                    return;
                }

                scope.dataTable.forEach(function(currentValue, index){
                    currentValue.selected = newValue;
                });

                scope.updateChanged();
            });

            scope.updateChanged = function(){
                var selectedItemsList = [];

                angular.forEach(scope.dataTable, function(tableItem){
                    if (tableItem.selected) {
                        selectedItemsList.push(tableItem.item);
                    }
                });

                scope.selectedItems = selectedItemsList;
                
                scope.onChange({value : selectedItemsList});
            };

            scope.sortColumn = function(column){
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

                if(isSameColumnFromLastSort){
                    // if we're sorting the same column, just flip the order and go
                    isReversed = !sortInfo.reverseSort;
                } else{
                    // otherwise, start the sort from the user defined override or default value
                    isReversed = !!column.reversed;
                }

                var predicate = scope.getColumnPredicate(column);

                scope.state.sortInfo = {
                    sortedColumn : column,
                    predicate : predicate,
                    reverseSort : isReversed
                };

                update();
            };

            scope.getColumnPredicate = function(column){
                var predicate;

                if (column.sort === false) {
                    return null;
                }

                if (column.sort != null && column.sort !== true) {
                    predicate = angular.isString(column.sort) ? ('+item.' + column.sort) : function(obj){ return angular.bind(obj.item, column.sort)(); };
                }else{
                    predicate = angular.isString(column.content) ? ('+item.' + column.content) : function(obj){ return angular.bind(obj.item, column.content)(); };
                }

                return predicate;
            };

            scope.isSortable = function(column){
                return (column.sort !== false);
            };

            scope.getColumnClasses = function(column, isHeader){
                var output = '';

                if(isHeader && scope.isSortable(column)){
                    output = scope.getColumnSortClass(column) + ' ';
                }

                output += column.className ? column.className : 'column';
                return output;
            };

            scope.getColumnSortClass = function(column){
                var sortInfo = scope.state.sortInfo;
                if (column !== sortInfo.sortedColumn) {
                    return 'column-sortable';
                }

                return 'column-sortable column-sorted ' + (sortInfo.reverseSort ? 'desc' : 'asc');
            };
            scope.getColumnsLength = function(){
                var colLength = scope.columns ? scope.columns.length : 0;
                return colLength + (scope.hasActionColumn ? 1 : 0) + (scope.showCheckboxes ? 1 : 0);
            };
            scope.getEmptyStatusMessage = function(){
                if(scope.state.filter){
                    return scope.noFilterResultsMessage;
                } else {
                    return scope.noDataMessage;
                }
            };
        }
    };
};