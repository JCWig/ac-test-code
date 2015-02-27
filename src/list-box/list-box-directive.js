'use strict';

/* @ngInject */
module.exports = function($log, $q, uuid, $filter) {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            data: '=',
            schema: '=',
            filterPlaceholder : "@",
            selectedItems: '=?',
            onChange : "&"
        },
        template: require('./templates/list-box.tpl.html'),
        link: function(scope, element, attrs) {
            var orderBy = $filter('orderBy');
            scope.loading = true;
            scope.tableId = uuid.guid();
            scope.filterPlaceholder = scope.filterPlaceholder || "Filter";
            scope.selectedItems = scope.selectedItems || [];
            
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
            };
            
            scope.getColumnContent = function(column, item, defaultValue){
                var columnContent = column.content;
                
                if (angular.isString(columnContent)) {
                    if (columnContent in item) {
                        // retrieve the property for the item with the same name
                        return item[columnContent] || defaultValue;
                    }else{
                        // this means that the property is undefined in the object
                        return defaultValue;
                    }
                }else if (angular.isFunction(columnContent)) {
                    // return the content based on the result of the function call
                    return angular.bind(item, column.content)() || defaultValue;
                }
                
                throw "The column content field is using an unknown type.  Content field may only be String or Function type";
            };
            
            scope.processDataTable = function(){
                // we can only really process the data if both fields are set
                if (scope.columns == null || scope.internalData == null) {
                    return;
                }
                
                // do the same process as ng-repeat, except we do this only once to cache the output
                var dataTableOutput = new Array(scope.internalData.length);
                angular.forEach(scope.internalData, function(dataItem, key) {
                    dataTableOutput[key] = {
                        selected : false,
                        cells : scope.columns.map(
                            function (column) {
                                return scope.getColumnContent(column, dataItem, column.defaultValue);
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
                
                if (autoSortableColumns.length > 0) {
                    scope.sortColumn(autoSortableColumns[0]);
                }
                
                scope.loading = false;
            };
            
            scope.$watch('data', function(newValue) {
                scope.loading = true;
                $q.when(scope.data).then(function(data){
                    if (!angular.isArray(data)) {
                        throw "Data must be an array";
                    }

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
                
            scope.showCheckboxes = attrs.showCheckboxes !== 'false';
            
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
                if (scope.onChange) {
                    scope.onChange({value : selectedItemsList});
                }
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
                
                scope.dataTable = orderBy(scope.dataTable, scope.state.sortInfo.predicate, scope.state.sortInfo.reverseSort);
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
        }
    };
};