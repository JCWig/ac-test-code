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
                
                scope.data.sort(column.sort);
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
                        return objA.first > objB.first ? 1 : objA.first < objB.first ? -1 : 0;
                    }
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
