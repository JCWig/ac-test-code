'use strict';
var utilities = require('../utilities');

var CURRENT = '.tree-view-current';
var CHILDREN = '.tree-view-children';
var CHILD_CONTENTS = '.tree-view-children .tree-view-contents';
var PARENT_ICON = '.tree-view-current i';
var PARENT_SELECTOR = '.tree-view-current .tooltip';
var CURRENT_CONTEXT_TITLE = '.tree-view-current-title';
var PARENT_SELECTOR_ROWS = '.tree-view-current .tooltip .tree-view-contents';
var INDETERMINATE_PROGRESS = 'akam-indeterminate-progress';

describe('akamai.components.tree-view', function() {
    var scope, timeout, compile, q, http, httpBackend;
    beforeEach(function() {
        inject.strictDi(true);
        var self = this;
        angular.mock.module(require('../../src/tree-view').name);
        inject(function($compile, $rootScope, $timeout, $q,  $log, $http, $httpBackend) {
            scope = $rootScope.$new();
            timeout = $timeout;
            compile = $compile;
            q = $q;
            http = $http;
            httpBackend = $httpBackend;
        });
        scope.contextData = {
            parent:{title:"Justice League"},
            current:{title: "Bruce Wayne"},
            children:[
                {title:"Dick Grayson"},
                {title:"Jason Todd"},
                {title:"Tim Drake"},
                {title:"Barbara Gordon"},
                {title:"Damian Wayne"},
                {title:"Terry McGinnis"},
                {title:"Alfred Pennyworth"},
                {title:"Talia Al Ghul"}
            ]
        };
        scope.triggerChange = function(clickedObj){
            scope.message = "loading..."
            if(clickedObj.title === 'Barbara Gordon'){
                scope.contextData = {
                    parent:{title:"Bruce Wayne"},
                    children : [
                        {title:"Dinah Lance"},
                        {title:"Helena Bertinelli"},
                        {title:"Selina Kyle"}
                    ]
                }
            } else if (clickedObj.title === 'Dinah Lance') {
                var def = q.defer();
                timeout(function(){
                    def.resolve({
                        parent:{title:"Barbara Gordon"},
                        children : [
                            {title:"Oliver Queen"},
                            {title:"Mia Dearden"},
                            {title:"Roy Harper"}
                    ]});
                }, 5000);
                return def.promise;
            } else if (clickedObj.title === 'Damian Wayne') {
                var def = q.defer();
                timeout(function(){
                    def.reject();
                    scope.message="Failed";
                }, 200);
                return def.promise;
            } else if (clickedObj.title === 'Jason Todd') {
                var def = q.defer();
                scope.contextData = def.promise;
                timeout(function(){
                    def.reject();
                    scope.message="Failed";
                }, 200);
            } else if (clickedObj.title === 'Dick Grayson') {
                return {
                    parent:{title:"Bruce Wayne"},
                    children : null
                };
            }  else if (clickedObj.title === 'Tim Drake') {
                var def = q.defer();
                scope.contextData = {
                    parent:{title:"Bruce Wayne"},
                    children : []
                }
            }  else if (clickedObj.title === 'Terry McGinnis') {
                var def = q.defer();
                scope.contextData = {
                    parent:{title:"Bruce Wayne"},
                    children : null
                }
            }  else if (clickedObj.title === 'Alfred Pennyworth') {
                httpBackend.when('GET', '/data/from/here').respond({
                    parent:{title:"Bruce Wayne"},
                    children : ["Alfred Pennyworth Has No children"]
                });
                scope.contextData = http.get('/data/from/here');
            }  else if (clickedObj.title === 'Talia Al Ghul') {
                httpBackend.when('GET', '/data/from/here/does/not/exist').respond(404, "NO DATA HERE");
                scope.contextData = http.get('/data/from/here/does/not/exist');
            }  else if (clickedObj.title === 'Bruce Wayne') {
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
                            {title:"Damian Wayne"},
                            {title:"Terry McGinnis"},
                            {title:"Alfred Pennyworth"},
                            {title:"Talia Al Ghul"}
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
            var markup = '<div style="max-width:150px"><akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var treeContents = document.querySelectorAll(CHILD_CONTENTS);
            var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
            var currentContextIcon = document.querySelector(PARENT_ICON);

            expect(treeContents.length).toEqual(8);
            expect(treeContents[0].textContent).toContain('Dick Grayson');
            expect(currentContext.textContent).toContain('Bruce Wayne');
            expect(currentContextIcon.classList.contains('luna-parent_group_folder')).toBe(true);
        });
        it('should render parent selector when prompted', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var parentSelector = document.querySelector(PARENT_SELECTOR);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            expect(parentSelector.classList.contains('in')).toBe(false);
            utilities.click(currentContextIcon);
            scope.$digest();
            parentSelector = document.querySelector(PARENT_SELECTOR);
            var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS); 
            expect(parentSelectorRows.length).toEqual(1);
            expect(parentSelectorRows[0].querySelector('span').textContent).toContain('Justice League');
            expect(parentSelector.classList.contains('in')).toBe(true);
        });
    });
    describe('when interacting with the tree-view', function(){
        it('should open and close parent selector when needed', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var parentSelector = document.querySelector(PARENT_SELECTOR);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            expect(parentSelector.classList.contains('in')).toBe(false);
            utilities.click(currentContextIcon);
            scope.$digest();
            expect(parentSelector.classList.contains('in')).toBe(true);
            utilities.click(currentContextIcon);
            scope.$digest();
            expect(parentSelector.classList.contains('in')).toBe(false);
        });
        /*it('should highlight rows in child selector when mouse hover', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>'
            addElement(markup);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS);
            utilities.mouseHover(childSelectorRow);
            childSelectorRow = document.querySelector(CHILD_CONTENTS);
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
            var childSelectorRow = document.querySelector(CHILD_CONTENTS);
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
        it('should render new children when needed', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[3];
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
            var childSelectorRow = document.querySelector(CHILD_CONTENTS);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
        });
        it('should not render any data if there are no children returned (null)', function(){
             var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[5];
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
        });
        it('should not render any data if there are no children (empty array)', function(){
             var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[2];
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
        });
        it('should not display indeterminate progress immediately', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[3];
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            scope.$digest();
            childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[0];
            utilities.click(childSelectorRow);
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
            var indeterminateProgress = document.querySelector(INDETERMINATE_PROGRESS);
            expect(indeterminateProgress).toBe(null);
        });
        it('should display rejected information when children changed', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[1].querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            timeout.flush();
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
            var indeterminateProgress = document.querySelector(INDETERMINATE_PROGRESS);
            expect(indeterminateProgress.getAttribute('failed')).toBe('true');
        });
        it('should display rejected information when children returned', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[4].querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            timeout.flush();
            scope.$digest();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
            var indeterminateProgress = document.querySelector(INDETERMINATE_PROGRESS);
            expect(indeterminateProgress.getAttribute('failed')).toBe('true');
        });
        it('should display data retrieved from http get', function(){            
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[6].querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            httpBackend.flush();

            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(1);
        });
        it('should display no data retrieved from failed http get ', function(){            
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[7].querySelector('span');
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(childSelectorRow);
            httpBackend.flush();
            scope.$digest();
            timeout.flush();
            var childSelectorRows = document.querySelectorAll(CHILD_CONTENTS);
            expect(childSelectorRows.length).toEqual(0);
            var indeterminateProgress = document.querySelector(INDETERMINATE_PROGRESS);
            expect(indeterminateProgress.getAttribute('failed')).toBe('true');
        });
        it('should change to a different parent if selected', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS).querySelector('span');
            
            utilities.click(currentContextIcon);
            scope.$digest();

            utilities.click(document.querySelector(PARENT_SELECTOR_ROWS));
            scope.$digest();

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

            utilities.click(PARENT_SELECTOR_ROWS);
            scope.$digest();

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

            utilities.click(PARENT_SELECTOR_ROWS);
            scope.$digest();

            var icon = document.querySelector(PARENT_ICON);
            utilities.click(icon);
            var parentSelector = document.querySelector(PARENT_SELECTOR);
            expect(parentSelector.classList.contains('in')).toBe(false);
        });
        it('should change icon to luna home if current is root', function(){
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            var childSelectorRow = document.querySelector(CHILD_CONTENTS);
            
            utilities.click(currentContextIcon);
            scope.$digest();

            utilities.click(document.querySelector(PARENT_SELECTOR_ROWS));
            scope.$digest();

            var childSelectorRow = document.querySelector(CHILD_CONTENTS).querySelector('span');
            var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
            expect(currentContextIcon.classList.contains('luna-home')).toBe(true);
        });
        it('should make icon root in parent selector if given root parent', function(){
            scope.contextData.parent = {"title":"Justice League", root:true};
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            
            utilities.click(currentContextIcon);
            scope.$digest();

            var parentSelectorIcon = document.querySelector(PARENT_SELECTOR_ROWS).querySelector('i');
            expect(parentSelectorIcon.classList.contains('luna-home')).toBe(true);
        });
        it('should be able to provide multiple parents', function(){
            scope.contextData.parent = [{"title":"Justice League 2"}, {"title":"Justice League", root:true}];
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            
            utilities.click(currentContextIcon);
            scope.$digest();

            var parentSelectors = document.querySelectorAll(PARENT_SELECTOR_ROWS);
            expect(parentSelectors.length).toEqual(2);
        });
        it('should close parent selector on click away', function(){
            scope.contextData.parent = [{"title":"Justice League 2"}, {"title":"Justice League", root:true}];
            var markup = '<akam-tree-view context-data="contextData" on-context-change="triggerChange"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            
            utilities.click(currentContextIcon);
            scope.$digest();

            var parentSelector = document.querySelector(PARENT_SELECTOR);
            expect(parentSelector.classList.contains('in')).toBe(true);
            utilities.clickAwayCreationAndClick('div');
            expect(parentSelector.classList.contains('in')).toBe(false);
        });
    });
});