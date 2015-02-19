'use strict';

/* @ngInject */
module.exports = function($log) {
    return {
        replace: true,
        restrict: 'E',
        scope: {
            data: '@',
            columns: '@'
        },
        template: require('./templates/data-table.tpl.html'),
        link: function(scope, element) {
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
            
            scope.data = [
                {
                    first : "Yair",
                    last : "Leviel",
                    id : 1234,
                    bu : "Luna"
                },
                {
                    first : "Shawn",
                    last: "Dahlen",
                    id : 1357,
                    bu : "Luna"
                },
                {
                    first : "Nick",
                    last: "Leon",
                    id : 2468,
                    bu : "Luna"
                },
                {
                    first : "Sean",
                    last: "Wang",
                    id : 2002,
                    bu : "Luna"
                },
                {
                    first : "Mike",
                    last: "D",
                    id : 1001,
                    bu : "Luna"
                }
            ];
            
            scope.columns = [
                {
                    id : "FullName",
                    text : function(obj){
                        return obj.first + ' ' + obj.last;
                    },
                    header : 'Full Name',
                    sort : function(objA, objB){
                        return this.text(objA).localeCompare(this.text(objB));
                    },
                    className : 'column-full-text-name'
                },
                {
                    id : "EmployeeID",
                    text : function(obj){
                        return obj.id;
                    },
                    header : 'Employee ID',
                    sort : function(objA, objB){
                        return objA.id > objB.id ? 1 : objA.id < objB.id ? -1 : 0;
                    }
                }
            ];
        }
    };
};
