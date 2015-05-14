'use strict';
var utilities = require('../utilities');

var TREE_VIEW_WRAPPER = '.akam-tree-view';
var DATA_TABLE_WRAPPER = '.akam-data-table';
var LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '/apps/appname/locales/en_US.json';

describe('akamai.components.akam-standalone', function() {
    var scope, timeout, compile, q;
    beforeEach(function() {
        inject.strictDi(true);
        var self = this;
        angular.mock.module(require('../../src/utils').name);
        angular.mock.module(require('../../src/data-table').name);
        angular.mock.module(require('../../src/tree-view').name);
        inject(function($compile, $rootScope, $httpBackend) {
            scope = $rootScope.$new();
            compile = $compile;
            $httpBackend.when('GET', LIBRARY_PATH).respond({});
            $httpBackend.when('GET', CONFIG_PATH).respond({});
            $httpBackend.flush();
        });
    });
    afterEach(function() {
        if(self.element){
            document.body.removeChild(self.element);
            self.element = null;
        }
    });
    function addElement(markup) {
        self.el = compile(markup)(scope);
        scope.$digest();
        self.element = document.body.appendChild(self.el[0]);
      }
    describe('when rendering', function(){
        it('should add correct class when directive is not replaced', function(){
            scope.contextData = {
                parent:{title:"Justice League"},
                current:{title: "Bruce Wayne"},
                children:[{title:"Dick Grayson"}]
            };
            scope.triggerChange = function(){};
            var markup = '<div style="max-width:150px"><akam-tree-view akam-standalone context-data="contextData" on-context-change="triggerChange"> </akam-tree-view></div>';
            addElement(markup);
            var treeContents = document.querySelector(TREE_VIEW_WRAPPER);
            expect(treeContents.classList.contains('standalone')).toBe(true);
        });
        it('should add correct class when directive is replaced', function(){
            scope.data = [];
            scope.schema = [];
            var markup = '<akam-data-table data="data" schema="schema" akam-standalone> </akam-data-table>';
            addElement(markup);
            var datatableConents = document.querySelector(DATA_TABLE_WRAPPER);
            expect(datatableConents.classList.contains('standalone')).toBe(true);
        });
    });
});