'use strict';

/* @ngInject */
module.exports = function($log, $q) {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            mydata: '=',
            mycolumns: '=',
            getSelectedItems: '&'
        },
        template: require('./templates/data-table.tpl.html'),
        link: function(scope, element, attrs) {
            scope.data = [];
            scope.columns = [];
            scope.loading = true;
            
            scope.$watch('mydata', function(newValue) {
                $q.when(scope.mydata).then(function(data){
                    scope.data = data;
                    scope.loading = false;
                });
            });
            
            scope.$watch('mycolumns', function(newValue){
                scope.columns = newValue || [];
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
                
                var sortDirection = scope.sortInfo.sortDirection;
                scope.data.sort(angular.bind(column, column.sort));
                if (sortDirection === 'DESC') {
                    scope.data.reverse();
                }
                
                scope.sortInfo = {
                    sortedColumn : column.id,
                    sortDirection : sortDirection === 'ASC' ? 'DESC' : 'ASC'
                };
            };
            
            scope.isSortable = function(column){
                return (column.sort != null);
            };
            
            scope.getColumnClasses = function(column, isHeader){
                var output = '';
                
                if(isHeader && scope.isSortable(column)){
                    output = 'util-clickable ';
                }
                
                output += column.className ? column.className : 'data-table-' + column.id.toLowerCase();
                return output;
            };
            
            scope.sortInfo = {
                sortedColumn : null,
                sortDirection: 'ASC'
            };
        }
    };
};
