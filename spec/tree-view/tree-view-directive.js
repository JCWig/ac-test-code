'use strict';
var utilities = require('../utilities');

var CURRENT = '.tree-view-current';
var CHILDREN = '.tree-view-children';
var CHILD_CONTENTS = '.tree-view-children .tree-view-contents';
var PARENT_ICON = '.tree-view-current .icon-states';
var PARENT_SELECTOR = '.tree-view-current .tooltip';
var CURRENT_CONTEXT_TITLE = '.tree-view-current-contents';
var PARENT_SELECTOR_ROWS = '.tree-view-current .tooltip .tree-view-contents';


describe('akamai.components.tree-view', function() {
    var scope, timeout, compile, q;
    beforeEach(function() {
        inject.strictDi(true);
        var self = this;
        angular.mock.module(require('../../src/tree-view').name);
        inject(function($compile, $rootScope, $timeout, $q,  $log) {
            scope = $rootScope.$new();
            timeout = $timeout;
            compile = $compile;
            q = $q;
        });
        scope.contextData = {
            parent:{title:"Justice League"},
            current:{title: "Bruce Wayne"},
            children:[
                {title:"Dick Grayson"},
                {title:"Jason Todd"},
                {title:"Tim Drake"},
                {title:"Barbara Gordon"},
                {title:"Damian Wayne"}
            ]
        };
        scope.triggerChange = function(clickedObj){
            if(clickedObj.title === 'Barbara Gordon'){
                scope.contextData = {
                    parent:{title:"Bruce Wayne"},
                    children : [
                        {title:"Dinah Lance"},
                        {title:"Helena Bertinelli"},
                        {title:"Selina Kyle"}
                    ]
                }
            } else if (clickedObj.title === 'Dick Grayson') {
                scope.contextData = {
                    parent:{title:"Bruce Wayne"},
                    children : null
                }
            }  else if (clickedObj.title === 'Tim Drake') {
                scope.contextData = {
                    parent:{title:"Bruce Wayne"},
                    children : []
                }
            } else if (clickedObj.title === 'Jason Todd') {
                var def = q.defer();
                scope.contextData = def.promise;
                timeout(function(){
                    def.reject();
                }, 2000);
            } else if (clickedObj.title === 'Bruce Wayne') {
                var def = q.defer();
                scope.contextData = def.promise;
                timeout(function(){
                    def.resolve({
                        parent:{title:"Jusice League"},
                        children:[
                            {title:"Dick Grayson"},
                            {title:"Jason Todd"},
                            {title:"Tim Drake"},
                            {title:"Barbara Gordon"},
                            {title:"Damian Wayne"}
                        ]
                    });
                }, 2000);
            } else if (clickedObj.title === 'Justice League') {
                scope.contextData = {
                    parent : null,
                    children: [
                        {title: "Bruce Wayne"},
                        {title: "Clark Kent"},
                        {title: "Hal Jordan"},
                        {title: "Barry Allen"},
                        {title: "Arthur Curry"},
                        {title: "Diana Prince"}
                    ]
                }
            } else {
                scope.contextData = {
                    children: null
                }
            }
        }
    });
    afterEach(function() {
        if(self.element){
            document.body.removeChild(self.element);
            self.element = null;
        }
    });
    function addElement(markup) {
        self.element = document.createElement('div');
        self.element.innerHTML = markup;
        document.body.appendChild(self.element);
        compile(document.body)(scope);
        scope.$digest();
        timeout.flush();
    };
    describe('when rendering', function(){
        it('should render one level and current context', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var treeContents = document.querySelectorAll(CHILD_CONTENTS);
            var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
            var currentContextIcon = document.querySelector(PARENT_ICON);

            expect(treeContents.length).toEqual(5);
            expect(treeContents[0].textContent).toContain('Dick Grayson');
            expect(currentContext.textContent).toContain('Bruce Wayne');
            expect(currentContextIcon.classList.contains('luna-folder')).toBe(true);
        });
        it('should render parent selector when prompted', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var parentSelector = document.querySelector(PARENT_SELECTOR);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            expect(parentSelector.classList.contains('fade')).toBe(false);
            utilities.click(currentContextIcon);
            scope.$digest();
            timeout.flush();

            var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS); 
            expect(parentSelectorRows.length).toEqual(1);
            expect(parentSelectorRows[0].querySelector('span').textContent).toContain('Justice League');
            expect(parentSelector.classList.contains('fade')).toBe(true);
        });
    });
    describe('when interacting with the tree-view', function(){
        it('should open and close parent selector when needed', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var parentSelector = document.querySelector(PARENT_SELECTOR);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            expect(parentSelector.classList.contains('fade')).toBe(false);
            utilities.click(currentContextIcon);
            scope.$digest();
            timeout.flush();
            expect(parentSelector.classList.contains('fade')).toBe(true);
            utilities.click(currentContextIcon);
            scope.$digest();
            timeout.flush();
            expect(parentSelector.classList.contains('fade')).toBe(false);
        });
        /*it('should highlight rows in child selector when mouse hover', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>'
            addElement(markup);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS);
            utilities.mouseHover(childSelectorRow);
            childSelectorRow = document.querySelector(CHILD_CONTENTS);
            console.log(childSelectorRow);
            expect(getComputedStyle(childSelectorRow)['background-color']).toContain('asdfasd');
        });
        it('should highlight rows in parent selector when mouse hover', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>'
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(currentContextIcon);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            scope.$digest();
            timeout.flush();
            var parentSelectorRow = document.querySelector(PARENT_SELECTOR_ROWS);
            utilities.mouseHover(parentSelectorRow);
            parentSelectorRow = document.querySelector(PARENT_SELECTOR_ROWS);
            expect(getComputedStyle(parentSelectorRow)['background-color']).toContain('asdfasd');
        });*/
        it('should replace current context and update parent nodes when clicking a child', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS).querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            scope.$digest();

            utilities.click(currentContextIcon);
            scope.$digest();
            timeout.flush();

            var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
            expect(currentContext.textContent).toContain('Dick Grayson');

            var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS); 
            expect(parentSelectorRows.length).toEqual(2);
        });
        it('should replace render new children when needed', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[3].querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            scope.$digest();

            utilities.click(currentContextIcon);
            scope.$digest();
            timeout.flush();

            var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
            expect(currentContext.textContent).toContain('Barbara Gordon');

            var childRows = document.querySelectorAll(CHILD_CONTENTS);
            var firstChild = childRows[0];
            expect(childRows.length).toEqual(3);
            expect(firstChild.textContent).toContain('Dinah Lance');
        });
        it('should not render any data if there are no children (null)', function(){
             var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS).querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
        });
        it('should not render any data if there are no children (empty array)', function(){
             var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[2].querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
        });
        it('should display rejected information', function(){
             var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[1].querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            timeout.flush();
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
            //NEEEEEEEEFASDfjal;sdfjasdhfjashdfkljashdlkjfhaslkjdfhlksdjfhlkasdjhf
            //NEEEEEEEEFASDfjal;sdfjasdhfjashdfkljashdlkjfhaslkjdfhlksdjfhlkasdjhf
            //NEEEEEEEEFASDfjal;sdfjasdhfjashdfkljashdlkjfhaslkjdfhlksdjfhlkasdjhf
            //NEEEEEEEEFASDfjal;sdfjasdhfjashdfkljashdlkjfhaslkjdfhlksdjfhlkasdjhf
            //NEEEEEEEEFASDfjal;sdfjasdhfjashdfkljashdlkjfhaslkjdfhlksdjfhlkasdjhf
        });
        it('should change to a different parent if selected', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS).querySelector('span');
            utilities.click(childSelectorRow);
            scope.$digest();
            utilities.click(currentContextIcon);
            scope.$digest();
            timeout.flush();

            utilities.click(document.querySelector(PARENT_SELECTOR_ROWS));
            scope.$digest();
            timeout.flush();

            var childSelectorRow = document.querySelector(CHILD_CONTENTS).querySelector('span');
            var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
            expect(childSelectorRow.textContent).toContain('Bruce Wayne');
            expect(currentContext.textContent).toContain('Justice League');
        });
        it('should change icon if current context has no parents', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS).querySelector('span');

            utilities.click(currentContextIcon);
            scope.$digest();
            timeout.flush();

            utilities.click(PARENT_SELECTOR_ROWS);
            scope.$digest();
            timeout.flush();

            var icon = document.querySelector(PARENT_ICON);
            expect(icon.classList.contains('luna-home')).toBe(true);
        });
        it('should not load parent selector if no parents', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS).querySelector('span');

            utilities.click(currentContextIcon);
            scope.$digest();
            timeout.flush();

            utilities.click(PARENT_SELECTOR_ROWS);
            scope.$digest();
            timeout.flush();

            var icon = document.querySelector(PARENT_ICON);
            utilities.click(icon);
            var parentSelector = document.querySelector(PARENT_SELECTOR);
            expect(parentSelector.classList.contains('fade')).toBe(false);
        });
    });
});