'use strict';
var utilities = require('../utilities');
var translationMock = require('../fixtures/translationFixture.json');

var CURRENT = '.tree-view-current';
var CHILDREN = '.tree-view-children';
var CHILD_CONTENTS = '.tree-view-children .tree-view-contents';
var PARENT_ICON = '.tree-view-current i';
var PARENT_SELECTOR = '.tree-view-current .popover';
var CURRENT_CONTEXT_TITLE = '.tree-view-current-title';
var PARENT_SELECTOR_ROWS = '.tree-view-current .popover .tree-view-contents';
var INDETERMINATE_PROGRESS = 'akam-indeterminate-progress';

describe('akamai.components.tree-view', function() {
  var scope, timeout, compile, q, http, httpBackend;
  beforeEach(function() {
    inject.strictDi(true);
    var self = this;
    angular.mock.module(require('../../src/tree-view').name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function($compile, $rootScope, $timeout, $q, $log, $http, $httpBackend) {
      scope = $rootScope.$new();
      timeout = $timeout;
      compile = $compile;
      q = $q;
      http = $http;
      httpBackend = $httpBackend;
    });
    scope.contextDataCustom = {
      parents: {titles: "Justice League", roots:'true'},
      titles: "Bruce Wayne",
      childs: [
        {titles: "Dick Grayson"},
        {titles: "Jason Todd"},
        {titles: "Tim Drake"},
        {titles: "Barbara Gordon"},
        {titles: "Damian Wayne"},
        {titles: "Terry McGinnis"},
        {titles: "Alfred Pennyworth"},
        {titles: "Talia Al Ghul"}
      ]
    };

    scope.contextData = {
      parent: {title: "Justice League"},
      title: "Bruce Wayne",
      children: [
        {title: "Dick Grayson"},
        {title: "Jason Todd"},
        {title: "Tim Drake"},
        {title: "Barbara Gordon"},
        {title: "Damian Wayne"},
        {title: "Terry McGinnis"},
        {title: "Alfred Pennyworth"},
        {title: "Talia Al Ghul"}
      ]
    };
    scope.triggerChange = function(clickedObj) {
      scope.message = "loading..."
      if (clickedObj.title === 'Barbara Gordon') {
        scope.contextData = {
          parent: {title: "Bruce Wayne"},
          children: [
            {title: "Dinah Lance"},
            {title: "Helena Bertinelli"},
            {title: "Selina Kyle"}
          ]
        }
      } else if (clickedObj.title === 'Dinah Lance') {
        var def = q.defer();
        timeout(function() {
          def.resolve({
            parent: {title: "Barbara Gordon"},
            children: [
              {title: "Oliver Queen"},
              {title: "Mia Dearden"},
              {title: "Roy Harper"}
            ]
          });
        }, 5000);
        return def.promise;
      } else if (clickedObj.title === 'Damian Wayne') {
        var def = q.defer();
        timeout(function() {
          def.reject();
          scope.message = "Failed";
        }, 200);
        return def.promise;
      } else if (clickedObj.title === 'Jason Todd') {
        var def = q.defer();
        scope.contextData = def.promise;
        timeout(function() {
          def.reject();
          scope.message = "Failed";
        }, 200);
      } else if (clickedObj.title === 'Dick Grayson') {
        return {
          parent: {title: "Bruce Wayne"},
          children: null
        };
      } else if (clickedObj.title === 'Tim Drake') {
        var def = q.defer();
        scope.contextData = {
          parent: {title: "Bruce Wayne"},
          children: []
        }
      } else if (clickedObj.title === 'Terry McGinnis') {
        var def = q.defer();
        scope.contextData = {
          parent: {title: "Bruce Wayne"},
          children: null
        }
      } else if (clickedObj.title === 'Alfred Pennyworth') {
        httpBackend.when('GET', '/data/from/here').respond({
          parent: {title: "Bruce Wayne"},
          children: ["Alfred Pennyworth Has No children"]
        });
        scope.contextData = http.get('/data/from/here');
      } else if (clickedObj.title === 'Talia Al Ghul') {
        httpBackend.when('GET', '/data/from/here/does/not/exist').respond(404, "NO DATA HERE");
        scope.contextData = http.get('/data/from/here/does/not/exist');
      } else if (clickedObj.title === 'Bruce Wayne') {
        var def = q.defer();
        scope.contextData = def.promise;
        timeout(function() {
          def.resolve({
            parent: {title: "Jusice League"},
            children: [
              {title: "Dick Grayson"},
              {title: "Jason Todd"},
              {title: "Tim Drake"},
              {title: "Barbara Gordon"},
              {title: "Damian Wayne"},
              {title: "Terry McGinnis"},
              {title: "Alfred Pennyworth"},
              {title: "Talia Al Ghul"}
            ]
          });
        }, 2000);
      } else if (clickedObj.title === 'Justice League') {
        scope.contextData = {
          parent: null,
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
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });
  function addElement(markup) {
    self.element = document.createElement('div');
    self.element.innerHTML = markup;
    document.body.appendChild(self.element);
    scope.$digest();
    self.el = compile(document.body)(scope);

    timeout.flush();
  };
  describe('given a conforming object bound to the item attribute', function(){
    describe('when a tree view is rendered', function(){
      beforeEach(function(){
        var markup = '<div style="max-width:150px"><akam-tree-view item="contextData" on-change="triggerChange(item)"> </akam-tree-view>';
        addElement(markup);
      });
      it('should display the items title', function(){
        var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
        var currentContextIcon = document.querySelector(PARENT_ICON);
        expect(currentContext.textContent).toContain('Bruce Wayne');
        expect(currentContextIcon.classList.contains('luna-parent_group_folder')).toBe(true);
      });
      it('should display the items children', function(){
        var treeContents = document.querySelectorAll(CHILD_CONTENTS);
        expect(treeContents.length).toEqual(8);
        expect(treeContents[0].textContent).toContain('Dick Grayson');
      });
      it('should add the items parents to the selector', function(){
        var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS);
        expect(parentSelectorRows.length).toEqual(1);
        expect(parentSelectorRows[0].querySelector('span').textContent).toContain('Justice League');
      });
    });
  });
  describe('given a promise bound to the item attribute', function(){
    describe('when the tree view is rendered', function(){
      it('should display an indeterminate progress indicator', function(){

      });
    });
  });
  describe('given an object bound to the item attribute',function(){
    describe('and a text-property attribute', function(){
      describe('when the treeview is rendered', function(){
        beforeEach(function(){
          scope.textPropertyData  = {
            parent: {titles: "Justice League", roots:'true'},
            titles: "Bruce Wayne",
            children: [
              {titles: "Dick Grayson"},
              {titles: "Jason Todd"}
            ]
          };
          var markup = '<div style="max-width:150px"><akam-tree-view item="textPropertyData" '+
          'text-property="titles" on-change="triggerChange(item)"> </akam-tree-view>';
          addElement(markup);
        });
        it('should display the items text-property value', function(){
          var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
          expect(currentContext.textContent).toContain('Bruce Wayne');
        });
        it('should display the childrens text-property value', function(){
          var treeContents = document.querySelectorAll(CHILD_CONTENTS);
          expect(treeContents[0].textContent).toContain('Dick Grayson');
        });
        it('should add the parents text-property value to the selector', function(){
          var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS);
          expect(parentSelectorRows[0].querySelector('span').textContent).toContain('Justice League');
        });
      })
    });
  });
  describe('given an object bound to the item attribute', function(){
    describe('and a children-property attribute', function(){
      describe('when the treeview is rendered', function(){
        beforeEach(function(){
          scope.textPropertyData  = {
            parent: {title: "Justice League", roots:'true'},
            title: "Bruce Wayne",
            childs: [
              {title: "Dick Grayson"},
              {title: "Jason Todd"}
            ]
          };
          var markup = '<div style="max-width:150px"><akam-tree-view item="textPropertyData" '+
          'children-property="childs" on-change="triggerChange(item)"> </akam-tree-view>';
          addElement(markup);
        });
        it('should the items child property',function(){
          var treeContents = document.querySelectorAll(CHILD_CONTENTS);
          expect(treeContents[0].textContent).toContain('Dick Grayson');
        })
      });
    });
  });
  describe('given an object bound to the item attribute', function(){
    describe('and a parent-property attribute', function(){
      describe('when the treeview is rendered', function(){
        beforeEach(function(){
          scope.textPropertyData  = {
            parents: {title: "Justice League", roots:'true'},
            title: "Bruce Wayne",
            child: [
              {title: "Dick Grayson"},
              {title: "Jason Todd"}
            ]
          };
          var markup = '<div style="max-width:150px"><akam-tree-view item="textPropertyData" '+
          'parent-property="parents" on-change="triggerChange(item)"> </akam-tree-view>';
          addElement(markup);
        });
        it('should the items parent property to the selector',function(){
          var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS);
          expect(parentSelectorRows[0].querySelector('span').textContent).toContain('Justice League');
        })
      });
    });
  });
  describe('given an object bound to the item attribute', function(){
    describe('and a root-property attribute', function(){
      describe('when the treeview is rendered', function(){
        beforeEach(function(){
          scope.textPropertyData  = {
            parent: {title: "Justice League", roots:'true'},
            title: "Bruce Wayne",
            child: [
              {title: "Dick Grayson"},
              {title: "Jason Todd"}
            ]
          };
          var markup = '<div style="max-width:150px"><akam-tree-view item="textPropertyData" '+
          'root-property="roots" on-change="triggerChange(item)"> </akam-tree-view>';
          addElement(markup);
        });
        it('should dislay a home icon for a parent with a root-property set to true',function(){
          var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS);
          expect(parentSelectorRows[0].querySelector('i').classList).toContain('luna-home');
        })
      });
    });
  });
  describe('given a rendered tree view', function(){
    describe('and a callback bound to the on-change attribute',function(){
      describe('when a node is clicked',function(){
        beforeEach(function(){
          scope.onChangeEvent = jasmine.createSpy('spy');
          var markup = '<div style="max-width:150px"><akam-tree-view item="contextData" on-change="onChangeEvent(item)"> </akam-tree-view>';
          addElement(markup);
          var childSelectorRow = document.querySelector(CHILD_CONTENTS);
          utilities.click(childSelectorRow);
          scope.$digest();
        });
        it('should invoke the callback with the clicked node as an argument',function(){
          expect(scope.onChangeEvent).toHaveBeenCalledWith(scope.contextData.children[0]);
        });
        it('should update the display with the callback response',function(){
          var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
          expect(currentContext.textContent).toContain('Dick Grayson');
        });
      });
    });
  });
  describe('given a rendered treeview', function(){
    describe('and a node has been clicked', function(){
      describe('and the item attribute value is changed', function(){
        beforeEach(function(){
          scope.onChangeEvent = jasmine.createSpy('spy');
          var markup = '<div style="max-width:150px"><akam-tree-view item="contextData" on-change="triggerChange(item)"> </akam-tree-view>';
          addElement(markup);
          var childSelectorRow = document.querySelector(CHILD_CONTENTS);
          utilities.click(childSelectorRow);
          scope.$digest();
        });
        it('should display the new item', function(){
          var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
          expect(currentContext.textContent).toContain('Dick Grayson');
        });
      });
    });
  });
  describe('given some object bound to the item attribute', function(){
    describe('and the object is not set to a value initially for some amount of time', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          httpBackend.when('GET', 'json/tree-view-data.json').respond({
            "parent":{"title":"Justice League"},
            "title": "Bruce Wayne",
            "children":[{"title":"Dick Grayson"}]
          });
          http.get('json/tree-view-data.json').then(function(resp){
            timeout(function(){
              scope.delayedData = resp;
            }, 2000)
          });
          var markup = '<akam-tree-view item="delayedData" on-change="triggerChange(item)"> </akam-tree-view>';
          addElement(markup);
        });
        it('should show indeterminate progress indicator', function(){
          var indeterminateProgress = document.querySelector(INDETERMINATE_PROGRESS);
          expect(indeterminateProgress).not.toBe(null);
        });
      });
    });
  });
  describe('given an object bound to the item attribute', function(){
    describe('given an array on thats objects parent-property', function(){
      describe('when the table is rendered', function(){
        beforeEach(function() {
          scope.parentArrayData  = {
            parent: [{title: "Justice League"},
              {title: "DC universe", roots:'true'}],
            title: "Bruce Wayne",
            child: [
              {title: "Dick Grayson"},
              {title: "Jason Todd"}
            ]
          };
          var markup = '<akam-tree-view item="parentArrayData" on-change="triggerChange(item)"> </akam-tree-view>';
          addElement(markup);
        });
        it('should add all of the parents to the selector', function(){
          var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS);
          expect(parentSelectorRows.length).toEqual(2);
        });
      });
    });
  });
  describe('given a rendered treeview', function(){
    describe('and a node has been clicked', function(){
      describe('and the some item has been returned from the callback', function(){
        beforeEach(function(){
          var markup = '<div style="max-width:150px"><akam-tree-view item="contextData" on-change="triggerChange(item)"> </akam-tree-view>';
          addElement(markup);
          var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[2];
          utilities.click(childSelectorRow);
          scope.$digest();
        });
        it('should display the new item', function(){
          var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
          expect(currentContext.textContent).toContain('Tim Drake');
        });
      });
    });
  });
  describe('given a rendered tree', function(){
    describe('and the item has no parent nodes', function(){
      beforeEach(function(){
        scope.textPropertyData  = {
          parent: null,
          title: "Bruce Wayne",
          child: [
            {title: "Dick Grayson"},
            {title: "Jason Todd"}
          ]
        };
        var markup = '<div style="max-width:150px"><akam-tree-view item="textPropertyData" '+
        'on-change="triggerChange(item)"> </akam-tree-view>';
        addElement(markup);
        var currentContextIcon = document.querySelector(PARENT_ICON);
        utilities.click(currentContextIcon);
        scope.$digest();
      });
      it('should not allow access to the parent selector', function(){
        var parentSelectorIcon = document.querySelector(PARENT_ICON);
        expect(parentSelectorIcon.classList).not.toContain('util-clickable');
      });
      it('should render luna-home icon', function(){
        var parentSelectorIcon = document.querySelector(PARENT_ICON);
        expect(parentSelectorIcon.classList).toContain('luna-home');
      });
    });
  });
  describe('given a rendered tree', function(){
    describe('and the item has parents', function(){
      describe('when a parent node is clicked', function(){
        describe('and it has parents', function(){
          beforeEach(function(){
            scope.onChange = function(){
              return {
                parent: {title: "DC Universe"},
                children: [
                  {title: "Bruce Wayne"},
                  {title: "Clark Kent"}
                ]
              }
            }
            var markup = '<div style="max-width:150px"><akam-tree-view item="contextData" on-change="onChange(item)"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);
            utilities.click(currentContextIcon);
            scope.$digest();
            utilities.click(PARENT_SELECTOR_ROWS);
            scope.$digest();
          });
          it('should be rendered', function(){
            var currentContext = document.querySelector(CURRENT_CONTEXT_TITLE);
            expect(currentContext.textContent).toContain('Justice League');
          });
          it('should render its parents in the selector', function(){
            var parentSelectorRows = document.querySelectorAll(PARENT_SELECTOR_ROWS)[0];
            expect(parentSelectorRows.textContent).toContain('DC Universe');
          });
        });
      });
    });
  });
  describe('given a rendered tree', function(){
    describe('and the item has parents', function(){
      describe('and the parent selector is loaded', function(){
        describe('when the parent selector icon is clicked', function(){
          beforeEach(function(){
            scope.onChange = function(){
              return {
                parent: [{title: "DC Universe"}],
                children: [
                  {title: "Bruce Wayne"},
                  {title: "Clark Kent"}
                ]
              }
            }
            var markup = '<div style="max-width:150px"><akam-tree-view item="contextData" on-change="onChange(item)"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);

            utilities.click(currentContextIcon);
            scope.$digest();
            utilities.click(currentContextIcon);
            scope.$digest();
          });
          it('should be hidden again', function(){
            var parentSelector = document.querySelector(PARENT_SELECTOR);
            expect(parentSelector.classList.contains('in')).toBe(false);
          });
        });
      });
    });
  });
  describe('given a promise bound to the items attribute', function(){
    describe('and the promise is rejected', function(){
      beforeEach(function(){
        var markup = '<div style="max-width:150px"><akam-tree-view item="contextData" on-change="triggerChange(item)"> </akam-tree-view>';
        addElement(markup);
        var childSelectorRow = document.querySelectorAll(CHILD_CONTENTS)[4].querySelector('span');
        var currentContextIcon = document.querySelector(PARENT_ICON);
        utilities.click(childSelectorRow);
        timeout.flush();
        scope.$digest();
      });
      it('should render a failed indeterminate progress', function(){
        var indeterminateProgress = document.querySelector(INDETERMINATE_PROGRESS);
        expect(indeterminateProgress.getAttribute('failed')).toBe('true');
      });
    });
  });
  describe('given a rendered treeview', function(){
    describe('and the parent selector is visible', function(){
      describe('when the user clicks away from the selector', function(){
        beforeEach(function(){
            scope.onChange = function(){
              return {
                parent: [{title: "DC Universe"}],
                children: [
                  {title: "Bruce Wayne"},
                  {title: "Clark Kent"}
                ]
              }
            }
            var markup = '<div style="max-width:150px"><akam-tree-view item="contextData" on-change="onChange(item)"> </akam-tree-view>';
            addElement(markup);
            var currentContextIcon = document.querySelector(PARENT_ICON);

            utilities.click(currentContextIcon);
            scope.$digest();
            utilities.clickAwayCreationAndClick('div');
            scope.$digest();
          });
        it('should hide the selector', function(){
          var parentSelector = document.querySelector(PARENT_SELECTOR);
          expect(parentSelector.classList.contains('in')).toBe(false);
        });
      });
    });
  });
});









