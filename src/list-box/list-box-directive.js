'use strict';

/* @ngInject */
module.exports = function($log, $q, idService) {
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
            getSelectedItems: '&'
        },
        template: require('./templates/list-box.tpl.html'),
        link: function(scope, element, attrs) {
            scope.data = [];
            scope.columns = [];
            scope.loading = true;
            scope.tableId = idService.guid();
            
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
            scope.state = {
                allSelected : false
            };
            
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
                
                var sortDirection = scope.sortInfo.sortDirection;
                if (sortDirection === 'DESC') {
                    var originalSortFunc = angular.bind(column, sortFunc);
                    var reverseSortFunc = function(objA, objB) {
                        return -( originalSortFunc(objA, objB) );
                    };
                    sortFunc = reverseSortFunc;
                }
                
                scope.data.sort(angular.bind(column, sortFunc));
                
                scope.sortInfo = {
                    sortedColumn : column,
                    sortDirection : sortDirection === 'ASC' ? 'DESC' : 'ASC'
                };
            };
            
            scope.detectSortingFunction = function(column){
                var columnSort = column.sort;

                // if sorting is turned off, just stop
                if (!scope.isSortable(column)) {
                    console.log("HELLO")
                    return null;
                }
                
                // if the sort is a string, and it's known, use the sort requested
                if (angular.isString(columnSort) && columnSort in SORT_TYPES) {
                    return SORT_TYPES[columnSort];
                }
                
                if(angular.isFunction(columnSort)){
                    return columnSort;
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
                    output = 'util-clickable ';
                }
                
                output += column.className ? column.className : 'column';
                return output;
            };
            
            scope.sortInfo = {
                sortedColumn : null,
                sortDirection: 'ASC'
            };
        }
    };
};
