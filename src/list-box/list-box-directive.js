'use strict';

/* @ngInject */
module.exports = function($log, $q, uuid) {
    var SORT_TYPES = {
        generic : function(objA, objB){
            var aContent = getColumnContent(this, objA, null);
            var bContent = getColumnContent(this, objB, null);
            
            //handle null cases
            if (aContent == null || bContent == null) {
                return (aContent == null && bContent == null) ? 0 : (bContent == null) ? 1 : -1;
            }
            
            return aContent > bContent ? 1 : (bContent > aContent ? -1 : 0);
        },
        text : function(objA, objB) {
            var aContent = getColumnContent(this, objA, "");
            var bContent = getColumnContent(this, objB, "");
            //NOTE: this method can only be applied to Strings.
            return aContent.localeCompare(bContent);
        },
        number : function(objA, objB){
            var aContent = getColumnContent(this, objA, 0);
            var bContent = getColumnContent(this, objB, 0);
            return aContent - bContent;
        },
        date : function(objA, objB){
            // Convert the date into a number and compare numbers
            var aContent = getColumnContent(this, objA, null);
            var bContent = getColumnContent(this, objB, null);
            
            //handle null cases
            if (aContent == null || bContent == null) {
                return (aContent == null && bContent == null) ? 0 : (bContent == null) ? 1 : -1;
            }

            return aContent.getTime() - bContent.getTime();
        }
    };
    
    var SORT_DIRECTIONS = {
        'ASC' : 'ASC',
        'DESC' : 'DESC'
    };
    
    var getColumnContent = function(column, item, defaultValue){
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

    return {
        replace: true,
        restrict: 'E',
        scope: {
            mydata: '=',
            mycolumns: '=',
            filterPlaceholder : "@",
            getSelectedItems: '&'
        },
        template: require('./templates/list-box.tpl.html'),
        link: function(scope, element, attrs) {
            scope.data = [];
            scope.columns = [];
            scope.loading = true;
            scope.tableId = uuid.guid();
            scope.filterPlaceholder = scope.filterPlaceholder || "Filter";
            
            scope.state = {
                sortInfo : {
                    sortedColumn : null,
                    sortDirection: SORT_DIRECTIONS.ASC
                },
                viewSelectedOnly : false,
                allSelected : false,
                filter : "",
                search : {
                    '$' : '' 
                }
            };
            
            scope.updateSearchFilter = function(){
                if (scope.state.viewSelectedOnly === true) {
                    scope.state.search = {
                        'selected' : true,
                        '$' : scope.state.filter
                    };
                }else{
                    scope.state.search = {
                        '$' : scope.state.filter
                    };
                }
            };
            
            scope.getColumnContent = getColumnContent;

            scope.$watch('mydata', function(newValue) {
                $q.when(scope.mydata).then(function(data){
                    scope.data = angular.copy(data);
                    scope.loading = false;
                });
            });
            
            scope.$watch('mycolumns', function(newValue){
                scope.columns = angular.copy(newValue) || [];
            });
                
            scope.showCheckboxes = true;
            
            scope.numberOfColumns = function(){
                return scope.columns.length + (scope.showCheckboxes ? 1 : 0);
            };
            
            scope.$watch('state.allSelected', function(newValue){
                scope.data.forEach(function(currentValue, index){
                    currentValue.selected = newValue;
                });
            });
            
            scope.getSelectedItems = function(){
                var filtered = scope.data.filter(function(item){
                    return !!item.selected;
                });
                
                return filtered;
            };
            
            scope.sortColumn = function(column){
                if (column == null) {
                    throw "Column may not be null/undefined";
                }
                
                // make sure we have a valid dataset to sort & ensure at least 2 elements
                if (!angular.isArray(scope.data) || scope.data.length < 2) {
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
                
                scope.data.sort(angular.bind(column, sortFunc));
                
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
                
                //begin detection process
                var contentForFirstRow = scope.getColumnContent(column, scope.data[0]);
                
                if (angular.isString(contentForFirstRow)) {
                    return SORT_TYPES.text;
                } else if (angular.isNumber(contentForFirstRow)) {
                    return SORT_TYPES.number;
                }else if (angular.isDate(contentForFirstRow)) {
                    return SORT_TYPES.date;
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
