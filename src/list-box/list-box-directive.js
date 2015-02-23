'use strict';

/* @ngInject */
module.exports = function($log, $q, uuid) {
    var SORT_TYPES = {
        generic : function(objA, objB){
            var aContent = objA.cells[this.index];
            var bContent = objB.cells[this.index];
            
            //handle null cases
            if (aContent == null || bContent == null) {
                return (aContent == null && bContent == null) ? 0 : (bContent == null) ? 1 : -1;
            }
            
            return aContent > bContent ? 1 : (bContent > aContent ? -1 : 0);
        },
        text : function(objA, objB) {
            var aContent = objA.cells[this.index];
            var bContent = objB.cells[this.index];
            
            //NOTE: this method can only be applied to Strings.
            return aContent.localeCompare(bContent);
        },
        number : function(objA, objB){
            var aContent = objA.cells[this.index];
            var bContent = objB.cells[this.index];
            return aContent - bContent;
        }
    };
    
    var SORT_DIRECTIONS = {
        'ASC' : 'ASC',
        'DESC' : 'DESC'
    };

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
            scope.loading = true;
            scope.tableId = uuid.guid();
            scope.filterPlaceholder = scope.filterPlaceholder || "Filter";
            scope.selectedItems = scope.selectedItems || [];
            
            scope.state = {
                sortInfo : {
                    sortedColumn : null,
                    sortDirection: SORT_DIRECTIONS.ASC
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
                    return column.content(item) || defaultValue;
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
                
                scope.dataTable = dataTableOutput;
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
            
            scope.numberOfColumns = function(){
                return scope.columns.length + (scope.showCheckboxes ? 1 : 0);
            };
            
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
                
                // default to text compare
                var sortFunc = scope.detectSortingFunction(column);
                
                // this means there is no sort available
                if (sortFunc == null) {
                    return;
                }
                
                var sortInfo = scope.state.sortInfo;
                
                // first check if the column we're sorting is the same column from the last sort
                var isSameColumnFromLastSort = sortInfo.sortedColumn === column;
                
                var sortDirection;
                
                if(isSameColumnFromLastSort){
                    // if we're sorting the same column, just flip the order and go
                    var lastSortDirection = sortInfo.sortDirection;
                    sortDirection = lastSortDirection === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC;
                } else{
                    // otherwise, start the sort from the user defined override or default value 
                    sortDirection = column.sortDirection || SORT_DIRECTIONS.ASC;
                }
                
                if (sortDirection === SORT_DIRECTIONS.DESC) {
                    var originalSortFunc = angular.bind(column, sortFunc);
                    var reverseSortFunc = function(objA, objB) {
                        return -( originalSortFunc(objA, objB) );
                    };
                    sortFunc = reverseSortFunc;
                }
                
                scope.dataTable.sort(angular.bind(column, sortFunc));
                
                scope.state.sortInfo = {
                    sortedColumn : column,
                    sortDirection : sortDirection
                };
            };
            
            scope.detectSortingFunction = function(column){
                var columnSort = column.sort;

                // if sorting is turned off, just stop
                if (!scope.isSortable(column)) {
                    return null;
                }
                
                // if the sort is a string, and it's known, use the sort requested
                if (angular.isString(columnSort) && columnSort in SORT_TYPES) {
                    return SORT_TYPES[columnSort];
                }
                
                // handle user defined sorting function
                if (angular.isFunction(columnSort)) {
                    return columnSort;
                }

                //begin detection process
                var contentForFirstRow = scope.dataTable[0].cells[column.index];
                
                if (angular.isString(contentForFirstRow)) {
                    return SORT_TYPES.text;
                } else if (angular.isNumber(contentForFirstRow)) {
                    return SORT_TYPES.number;
                } else {
                    return SORT_TYPES.generic;
                }
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
                
                return 'column-sortable column-sorted ' + sortInfo.sortDirection.toLowerCase();
            };
        }
    };
};