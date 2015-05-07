'use strict';
var utilities = require('../utilities');

//CSS Selector variables
var FILTER_BOX = 'div.filter input[type="search"]';
var ALL_CHECKED_CHECKBOXES = 'input[type="checkbox"]:checked';
var TABLE_COLUMN_HEADER = '.akam-list-box thead tr th';
var TABLE_ROW = 'div.data tbody tr';
var SELECTED_SPAN = 'div.list-box-footer span.ng-binding';
var VIEW_SELECTED_ONLY_CHECKBOX = 'div.list-box-footer span.util-pull-right input[type=checkbox]';
var LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '/apps/appname/locales/en_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require("../i18n/i18n_responses/en_US.json");
var MAX_INITIALLY_DISPLAYED = 10;


describe('akam-list-box', function() {
  var compile = null;
  var scope = null;
  var self = this;
  var timeout = null;
  var q = null;
  var $http = null;
  var httpBackend = null;
  var sce;
  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/list-box').name);
    angular.mock.module(/*@ngInject*/function($provide) {
      $provide.decorator('$http', function($delegate) {
        $http = $delegate;
        return $delegate;
      });
    });
    inject(function($compile, $rootScope, $timeout, $q, $httpBackend, $sce) {
      compile = $compile;
      scope = $rootScope.$new();
      timeout = $timeout;
      q = $q;
      sce = $sce;
      httpBackend = $httpBackend;
      httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
      httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
    });

    scope.mydata = [
      {
        first: 'Yair',
        last: 'Leviel',
        id: 1234,
        bu: "Luna",
        color: "Green",
        birthday: new Date(2001, 10, 20),
        generic: ["hello"]
      },
      {
        first: "Nick",
        last: "Leon",
        id: 2468,
        bu: "Luna",
        color: "Red",
        birthday: new Date(2002, 10, 20),
        generic: ["goodbye"]
      },
      {
        first: "K-Slice",
        last: "McYoungPerson",
        id: 3141592653,
        bu: "Luna",
        color: "Yellow",
        birthday: new Date(2000, 10, 20),
        generic: ["shake it off"]
      }
    ];
    scope.columns = [
      {
        content: function() {
          return this.first + ' ' + this.last;
        },
        header: 'Full Name',
        className: 'column-full-text-name',
        title: function() {
          return this.last + ", " + this.first;
        }
      },
      {
        content: 'id',
        header: 'Employee ID'
      },
      {
        content: "color",
        header: "Favorite Color",
        sort: function() {
          var colorsValues = {
            'Red': 1,
            'Yellow': 2,
            'Green': 3
          };
          return colorsValues[this.color];
        }
      },
      {
        content: "birthday",
        header: "Birthday"
      },
      {
        content: "generic",
        header: "Generic Sorting"
      }
    ];
  });
  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    self.element = document.body.appendChild(self.el[0]);
  }

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });
  describe('when rendering multiselect-list-box', function() {
    it('should render all parts', function() {
      var markup = '<akam-list-box data="mydata" schema="columns" ></akam-list-box>';
      addElement(markup);

      var columnNumber = document.querySelectorAll(TABLE_COLUMN_HEADER);
      var columnOneHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input');
      var columntwoHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      var columnThreeHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
      var columnFourHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[3];
      var columnFiveHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[4];
      var columnSixHeaderObject = document.querySelectorAll(TABLE_COLUMN_HEADER)[5];

      expect(columnNumber.length).toEqual(scope.columns.length + 1);
      expect(columnOneHeaderObject.getAttribute('type')).toMatch(/checkbox/);
      expect(columntwoHeaderObject.textContent).toMatch(/Full Name/);
      expect(columnThreeHeaderObject.textContent).toMatch(/Employee ID/);
      expect(columnFourHeaderObject.textContent).toMatch(/Favorite Color/);
      expect(columnFiveHeaderObject.textContent).toMatch(/Birthday/);
      expect(columnSixHeaderObject.textContent).toMatch(/Generic Sorting/);

    });
    it('should not have anything selected', function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      httpBackend.flush();

      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);
      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

      expect(allCheckedCheckboxes.length).toEqual(0);
      expect(numberSelectedSpan.textContent).toMatch(/Selected: 0/);
    });
    it('should load default values if none are given', function() {
      scope.mydata = [{name: "hello"}, {date: "02/07/1993"}];
      scope.columns = [{content: 'date', header: 'Date'}];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var firstRowColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var secondRowColumnTwo = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[1];

      expect(firstRowColumnTwo.textContent).toContain('1993');
      expect(secondRowColumnTwo.textContent).not.toContain('2000');
    });
    it('should have filter be clear', function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);

      var filterBox = document.querySelector(FILTER_BOX);

      expect(filterBox.value).toEqual('');
    });
    it('should can have filter loaded with placeholder', function() {
      var markup = '<akam-list-box data="mydata" schema="columns" filter-placeholder="placeholder"></akam-list-box>';
      addElement(markup);
      httpBackend.flush();

      var filterBox = document.querySelector(FILTER_BOX);

      expect(filterBox.value).toEqual('');
      expect(filterBox.placeholder).toEqual('placeholder');
    });
    it('should display indeterminate progress when loading', function() {
      var deferred = q.defer();
      scope.delayeddata = deferred.promise;
      timeout(function() {
        deferred.resolve(scope.mydata);
      }, 2000);
      var markup = '<akam-list-box data="delayeddata" schema="columns"></akam-list-box>';
      addElement(markup);

      expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).toMatch(/false/);
      timeout.flush();
      var allRowsLoadedInTable = document.querySelectorAll(TABLE_ROW);

      expect(document.querySelector('akam-indeterminate-progress')).toBe(null);
      expect(allRowsLoadedInTable.length).toEqual(scope.mydata.length);
    });

    it('should display failed indetermine progress when http call fails', function() {
      var dataPath = '/get/json/data';
      scope.jsonColumns = [
        {
          content: function() {return this.first + ' ' + this.last;},
          header: 'Full Name',
          className: 'column-full-name'
        },
        {content: 'id', header: 'Emp. ID', className: 'column-employeeid'}
      ];

      httpBackend.when('GET', dataPath).respond(404, "ERROR: NOT FOUND");

      scope.jsonFromHttpGet = $http.get(dataPath);
      var markup = '<akam-list-box data="jsonFromHttpGet" schema="jsonColumns"></akam-list-box>';
      addElement(markup);

      expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).toMatch(/false/);
      httpBackend.flush();
      timeout.flush();
      expect(document.querySelector('akam-indeterminate-progress').getAttribute('failed')).toMatch(/true/);
    });
    it('should display rerender indetermine progress when http call fails the starts again', function() {
      var dataPath = '/get/json/data';
      scope.jsonColumns = [
        {
          content: function() {return this.first + ' ' + this.last;},
          header: 'Full Name',
          className: 'column-full-name'
        }
      ];
      httpBackend.when('GET', 'new_path').respond(404, "ERROR: NOT FOUND");

      scope.jsonFromHttpGet = $http.get('new_path');
      var markup = '<akam-list-box data="jsonFromHttpGet" schema="jsonColumns"></akam-list-box>';
      addElement(markup);

      expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).toMatch(/false/);
      httpBackend.flush();
      timeout.flush();
      expect(document.querySelector('akam-indeterminate-progress').getAttribute('failed')).toMatch(/true/);

      httpBackend.when('GET', 'success/path').respond(scope.mydata);
      scope.jsonFromHttpGet = $http.get('success/path');
      scope.$digest();

      expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).toMatch(/false/);
      expect(document.querySelector('akam-indeterminate-progress').getAttribute('failed')).toMatch(/false/);

      httpBackend.flush();
      timeout.flush();

      expect(document.querySelector('akam-indeterminate-progress')).toBe(null);
      expect(document.querySelector(TABLE_ROW)).not.toBe(null);
    });
    it('should display indeterminate progress and load data on http get', function() {
      var dataPath = '/get/json/data';
      var jsonData = require('./http-data/list-box-data.json');
      scope.jsonColumns = [
        {
          content: function() {return this.first + ' ' + this.last;},
          header: 'Full Name',
          className: 'column-full-name'
        },
        {content: 'id', header: 'Emp. ID', className: 'column-employeeid'}
      ];

      httpBackend.when('GET', dataPath).respond(jsonData);

      scope.jsonFromHttpGet = $http.get(dataPath);
      var markup = '<akam-list-box data="jsonFromHttpGet" schema="jsonColumns"></akam-list-box>';
      addElement(markup);

      expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).toMatch(/false/);
      httpBackend.flush();
      timeout.flush();

      var allRowsLoadedInTable = document.querySelectorAll(TABLE_ROW);
      expect(document.querySelector('akam-indeterminate-progress')).toBe(null);
      expect(allRowsLoadedInTable.length).toEqual(MAX_INITIALLY_DISPLAYED);
    });
    it('should be able to use default sorting method on first column', function() {
      scope.mydata = [
        {'name': "Kevin"},
        {'name': "Alejandro"}
      ];
      scope.columns = [
        {
          content: 'name',
          header: 'Name',
          sort: null
        }
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var sortByColumnTwo = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwo);
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Kevin/);
    });
  });
  /* TODO: FIGURE OUT TESTING FOR SCROLLING/ ENSURE CSS IS APPLIED
  describe('when data exceeds 10 items', function(){
    it('should display more items as scrolling takes place', function() {
      scope.jsonColumns = [
        {
          content: function() {return this.first + ' ' + this.last;},
          header: 'Full Name',
          className: 'column-full-name'
        },
        {content: 'id', header: 'Emp. ID', className: 'column-employeeid'}
      ];
      scope.jsonData = require('./http-data/list-box-data.json');
      var markup = '<akam-list-box data="jsonData" schema="jsonColumns"></akam-list-box>';
      addElement(markup);
      timeout.flush();
      var totalRows = document.querySelectorAll(TABLE_ROW);
      expect(totalRows.length).toEqual(MAX_INITIALLY_DISPLAYED);

      document.querySelector('div.fixed-table-container-inner').scrollTop = 100;
      scope.$digest();

      expect(totalRows.length).not.toEqual(MAX_INITIALLY_DISPLAYED);
    });
  });*/
  describe('when given selectedItems', function() {
    it('should not delete selectedItems on load', function() {
      scope.selectedItems = [{
        first: 'Yair',
        last: 'Leviel',
        id: 1234,
        bu: "Luna",
        color: "Green",
        birthday: new Date(2001, 10, 20),
        generic: ["hello"]
      }];
      var markup = '<akam-list-box data="mydata" schema="columns" selected-items="selectedItems"></akam-list-box>';
      addElement(markup);

      expect(scope.$$childHead.selectedItems.length).toEqual(1);
      expect(scope.$$childHead.selectedItems[0].first).toEqual("Yair");
      expect(scope.$$childHead.selectedItems[0].last).toEqual("Leviel");
    });
    /*
     it('should reset selectedItems to [] when changed to non array value', function(){
     scope.selectedItems = [{
     first : 'Yair',
     last : 'Leviel',
     id : 1234,
     bu : "Luna",
     color: "Green",
     birthday : new Date(2001,10,20),
     generic : ["hello"]
     }];
     var markup = '<akam-list-box data="mydata" schema="columns" selected-items="selectedItems"></akam-list-box>';
     addElement(markup);
     scope.selectedItems = {};
     scope.$digest();

     expect(Array.isArray(scope.selectedItems)).toBe(true);
     });*/
    it('should auto check the preselected items', function() {
      scope.selectedItems = [scope.mydata[0]];
      var markup = '<akam-list-box data="mydata" schema="columns" selected-items="selectedItems"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(allCheckedCheckboxes.length).toEqual(1);
    });
    it('should do nothing if already selectedItem is selected (impossible by interaction)', function() {
      scope.selectedItems = [scope.mydata[0]];
      var markup = '<akam-list-box data="mydata" schema="columns" selected-items="selectedItems"></akam-list-box>';
      addElement(markup);
      timeout.flush();
      var selectedItem = {
        item: scope.mydata[0],
        selected: true
      }
      scope.$$childTail.updateChanged(selectedItem);
      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(allCheckedCheckboxes.length).toEqual(1);
      expect(scope.selectedItems.length).toEqual(1);
    });
    it('should add onto selectedItems when new item clicked', function() {
      scope.selectedItems = [scope.mydata[0]];
      var markup = '<akam-list-box data="mydata" schema="columns" selected-items="selectedItems"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();

      expect(scope.selectedItems.length).toEqual(2);
      expect(scope.selectedItems[0].first).toEqual("Yair");
      expect(scope.selectedItems[0].last).toEqual("Leviel");
      expect(scope.selectedItems[1].first).toEqual("K-Slice");
      expect(scope.selectedItems[1].last).toEqual("McYoungPerson");
    });
  });
  describe('when nothing is selected', function() {
    it('should have selected field equal 0', function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      httpBackend.flush();

      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

      expect(numberSelectedSpan.textContent).toMatch(/Selected: 0/);
    });
  });
  describe('when changing data input', function() {
    it('should have selected field equal 1 after updating data and selecting an item', function() {
      scope.changingdata = scope.mydata.slice(0);
      var markup = '<akam-list-box data="changingdata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);
      expect(numberSelectedSpan.textContent).toMatch(/0/);

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();

      expect(numberSelectedSpan.textContent).toMatch(/1/);
      scope.changingdata = [];

      scope.$digest();
      expect(numberSelectedSpan.textContent).toMatch(/1/);
    });
    it('should not reset view selected only when data is changed', function() {
      scope.changingdata = scope.mydata.slice(0);
      var markup = '<akam-list-box data="changingdata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);
      expect(numberSelectedSpan.textContent).toMatch(/0/);

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);

      utilities.click(firstRowCheckbox);
      scope.$digest();
      utilities.click(viewSelectOnlyCheckbox);
      scope.$digest();

      scope.changingdata = [];
      scope.$digest();
      scope.changingdata = scope.mydata.slice(0);
      scope.$digest();

      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);//Should be 1, which is the viewSelectOnlyCheckbox
      var allVisibleRows = document.querySelectorAll(TABLE_ROW);
      expect(allCheckedCheckboxes.length).toEqual(1);
      expect(allVisibleRows.length).toEqual(3);
    });
    it('should clear filter when data is changed', function() {
      scope.changingdata = scope.mydata.slice(0);
      var markup = '<akam-list-box data="changingdata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);
      expect(numberSelectedSpan.textContent).toMatch(/0/);

      scope.$$childHead.state.filter = "K-Slice";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();
      expect(document.querySelectorAll(TABLE_ROW).length).toEqual(1);

      scope.changingdata = [];
      scope.$digest();
      scope.changingdata = scope.mydata.slice(0);
      scope.$digest();

      var allVisibleRows = document.querySelectorAll(TABLE_ROW);
      var filterBox = document.querySelector(FILTER_BOX);

      expect(scope.$$childHead.state.filter).toEqual('');
      expect(allVisibleRows.length).toEqual(3);
      expect(filterBox.value).toEqual('');
    });
    it('should unselect de/select all  when data is changed', function() {
      scope.changingdata = scope.mydata.slice(0);
      var markup = '<akam-list-box data="changingdata" selected-items="selecteditems" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var selectAllCheckbox = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input');
      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);
      expect(numberSelectedSpan.textContent).toMatch(/0/);

      utilities.click(selectAllCheckbox);
      expect(numberSelectedSpan.textContent).toMatch(/3/);

      scope.changingdata = [];
      scope.selecteditems = [];
      scope.$digest();
      timeout.flush();

      scope.changingdata = scope.mydata.slice(0);
      scope.$digest();
      timeout.flush();

      var selectAllCheckboxIfChecked = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input:checked');

      expect(selectAllCheckboxIfChecked).toBe(null);
      expect(numberSelectedSpan.textContent).toMatch(/0/);
    });
    it('should re-sort based on first row on data update', function() {
      scope.changingdata = scope.mydata.slice(0);
      var markup = '<akam-list-box data="changingdata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnThree = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];

      utilities.click(rowOneColumnThree);
      scope.$digest();
      expect(rowOneColumnThree.classList.contains('asc')).toEqual(true);

      var rowTwoColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowTwoColumnTwo.textContent).toMatch(/Yair Leviel/);

      scope.changingdata = [];
      scope.$digest();
      timeout.flush();

      scope.changingdata = scope.mydata.slice(0);
      scope.$digest();
      timeout.flush();

      var rowOneColumnTwo = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      rowTwoColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.classList.contains('asc')).toBe(true);
      expect(rowOneColumnTwo.classList.contains('desc')).not.toEqual(true);
      expect(rowTwoColumnTwo.textContent).toMatch(/K-Slice McYoungPerson/);
    });
    it('should be able to proceed normally after data update', function() {
      scope.changingdata = scope.mydata.slice(0);
      var markup = '<akam-list-box data="changingdata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnThree = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];

      utilities.click(rowOneColumnThree);
      scope.$digest();
      expect(rowOneColumnThree.classList.contains('asc')).toEqual(true);

      var rowTwoColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowTwoColumnTwo.textContent).toMatch(/Yair Leviel/);

      scope.changingdata = [];
      scope.$digest();
      scope.changingdata = scope.mydata.slice(0);
      scope.$digest();

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();

      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

      expect(numberSelectedSpan.textContent).toMatch(/1/);
    });
  });
  describe('when interacting with de/select all', function() {
    it('should be able to select all items at once', function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();
      var selectAllCheckbox = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input');
      utilities.click(selectAllCheckbox);
      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);
      expect(allCheckedCheckboxes.length).toEqual(scope.mydata.length + 1); //Additional One for the overall checkbox
    });
    it('should be able to deselect all items at once', function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();
      var selectAllCheckbox = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input');
      utilities.click(selectAllCheckbox);
      utilities.click(selectAllCheckbox);
      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(allCheckedCheckboxes.length).toEqual(0);
    });
    it('should not break when no items exist and select all is pressed', function() {
      scope.nodata = [];
      var markup = '<akam-list-box data="nodata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();
      var selectAllCheckbox = document.querySelectorAll(TABLE_COLUMN_HEADER)[0].querySelector('input');
      utilities.click(selectAllCheckbox);
      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);
      var selectSpan = document.querySelector(SELECTED_SPAN);
      expect(allCheckedCheckboxes.length).toEqual(1);
      expect(selectSpan.textContent).toContain('0');
    });
  });
  describe('when interacting with sort options', function() {
    beforeEach(function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();
    });
    it('should be able to sort alphabetically', function() {
      var sortByColumnTwoAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwoAlphabectically);
      utilities.click(sortByColumnTwoAlphabectically);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/K-Slice McYoungPerson/);
      expect(rowThreeColumnTwo.textContent).toMatch(/Yair Leviel/);
    });
    it('should be able to sort reverse-alphabetically', function() {
      var sortByColumnTwoAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwoAlphabectically);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Yair Leviel/);
      expect(rowThreeColumnTwo.textContent).toMatch(/K-Slice McYoungPerson/);
    });
    it('should be able to sort numerically', function() {
      var sortByColumnThreeNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
      utilities.click(sortByColumnThreeNumerically);

      var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
      var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

      expect(rowOneColumnThree.textContent).toMatch(/1234/);
      expect(rowThreeColumnThree.textContent).toMatch(/3141592653/);
    });
    it('should be able to sort reverse-numerically', function() {
      var sortByColumnThreeNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
      utilities.click(sortByColumnThreeNumerically);
      utilities.click(sortByColumnThreeNumerically);

      var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
      var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

      expect(rowOneColumnThree.textContent).toMatch(/3141592653/);
      expect(rowThreeColumnThree.textContent).toMatch(/1234/);
    });
    it('should be able to sort by custom function', function() {
      var sortByColumnFourCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[3];
      utilities.click(sortByColumnFourCustom);

      var rowOneColumnFour = document.querySelector(TABLE_ROW).querySelectorAll('td')[3];
      var rowThreeColumnFour = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[3];

      expect(rowOneColumnFour.textContent).toMatch(/Red/);
      expect(rowThreeColumnFour.textContent).toMatch(/Green/);
    });
    it('should be able to sort by reverse custom function', function() {
      var sortByColumnFourCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[3];
      utilities.click(sortByColumnFourCustom);
      utilities.click(sortByColumnFourCustom);

      var rowOneColumnFour = document.querySelector(TABLE_ROW).querySelectorAll('td')[3];
      var rowThreeColumnFour = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[3];

      expect(rowOneColumnFour.textContent).toMatch(/Green/);
      expect(rowThreeColumnFour.textContent).toMatch(/Red/);
    });
    it('should be able to sort generically', function() {
      var sortByColumnSixGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[5];
      utilities.click(sortByColumnSixGeneric);

      var rowOneColumnSix = document.querySelector(TABLE_ROW).querySelectorAll('td')[5];
      var rowThreeColumnSix = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[5];

      expect(rowOneColumnSix.textContent).toContain('goodbye');
      expect(rowThreeColumnSix.textContent).toContain('shake it off');
    });
    it('should be able to sort reverse generically', function() {
      var sortByColumnSixGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[5];
      utilities.click(sortByColumnSixGeneric);
      utilities.click(sortByColumnSixGeneric);

      var rowOneColumnSix = document.querySelector(TABLE_ROW).querySelectorAll('td')[5];
      var rowThreeColumnSix = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[5];

      expect(rowOneColumnSix.textContent).toContain('shake it off');
      expect(rowThreeColumnSix.textContent).toContain('goodbye');
    });
    it('should sort entire rows', function() {
      var sortByColumnTwoAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwoAlphabectically);

      var firstRowColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var firstRowColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
      var firstRowColumnFour = document.querySelector(TABLE_ROW).querySelectorAll('td')[3];

      expect(firstRowColumnTwo.textContent).toMatch(/Yair Leviel/);
      expect(firstRowColumnThree.textContent).toMatch(/1234/);
      expect(firstRowColumnFour.textContent).toMatch(/Green/);
    });
  });

  describe('when using unique sort cases', function() {
    it('should not bother sorting one row', function() {
      scope.mydata = [
        {'name': "Kevin"}
      ];
      scope.columns = [
        {
          content: 'name',
          header: 'Name'
        }
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var sortByColumnTwo = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwo);
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toContain('Kevin');
    });

    it('should be able to turn off sorting', function() {
      scope.mydata = [
        {'name': "Kevin"},
        {'name': "Alejandro"}
      ];
      scope.columns = [
        {
          content: 'name',
          header: 'Name',
          sort: false
        }
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var sortByColumnTwo = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwo);
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Kevin/);
    });
    it('should be able to sort on different field', function() {
      scope.mydata = [{'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8}];
      scope.columns = [{content: 'name', header: 'Name', sort: 'id'}];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Kevin/);
    });
    it('should default sort by second column if first column is unsortable', function() {
      scope.mydata = [
        {'name': "Kevin", 'id': 25},
        {'name': "Alejandro", 'id': 17}
      ];
      scope.columns = [
        {content: 'name', header: 'Name', sort: false},
        {content: "id", header: "Id"}
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Alejandro/);
    });
    it('should not default if all columns are unsortable', function() {
      scope.mydata = [
        {'name': "Kevin", 'id': 25},
        {'name': "Alejandro", 'id': 17}
      ];
      scope.columns = [
        {content: 'name', header: 'Name', sort: false},
        {content: "id", header: "Id", sort: false}
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Kevin/);
    });
    it('should default sort based upon custom function if provided', function() {
      scope.mydata = [
        {'name': "Roy Harper", 'id': 25, color: 'Yellow'},
        {'name': "Dinah Laurel Lance", 'id': 17, color: 'Green'},
        {'name': "Oliver Queen", 'id': 17, color: 'Red'}
      ];
      scope.columns = [
        {content: 'name', header: 'Name', sort: false},
        {content: "id", header: "Id", sort: false},
        {
          content: "color", header: "Favorite Color", sort: function() {
          var colorsValues = {
            'Red': 1,
            'Yellow': 2,
            'Green': 3
          };
          return colorsValues[this.color];
        }
        }
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Oliver Queen/);
    });
    it('should be able to sort on different field', function() {
      scope.mydata = [{'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8}];
      scope.columns = [{content: 'name', header: 'Name', sort: 'id'}];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Kevin/);
    });
  });
  describe('when selecting an item', function() {
    it('should be able to select an item with on-change', function() {
      scope.changefunction = jasmine.createSpy('spy');

      var markup = '<akam-list-box data="mydata" schema="columns" on-change="changefunction(value)" selected-items="selectedItems1"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);

      var checkedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(checkedCheckboxes.length).toEqual(1);
      expect(scope.changefunction).toHaveBeenCalled();
    });
    it('should be able to de/select an item with on-change and trigger once', function() {
      var markup = '<akam-list-box data="mydata" schema="columns" on-change="changefunction(value)" selected-items="selectedItems1"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var spyOnChange = spyOn(scope.$$childTail, "updateChanged");
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);

      var checkedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(spyOnChange.calls.count()).toEqual(1);
      expect(checkedCheckboxes.length).toEqual(1);
      utilities.click(firstRowCheckbox);
      expect(spyOnChange.calls.count()).toEqual(2);
    });
    it('should be able to select an item without on-change', function() {
      scope.mychange = jasmine.createSpy('spy');
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>'

      addElement(markup);
      timeout.flush();

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);

      var checkedCheckbox = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(checkedCheckbox.length).toEqual(1);
      expect(scope.mychange).not.toHaveBeenCalled();
    });
    it('should update total selected field', function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      httpBackend.flush();
      timeout.flush();

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);

      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

      expect(numberSelectedSpan.textContent).toMatch(/Selected: 1/);
    });
    it('should change background color of selected items', function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      var firstRow = document.querySelector(TABLE_ROW);
      expect(firstRow.classList.contains('row-selected')).toBe(true);
    });
  });
  describe('when deselecting an item', function() {
    beforeEach(function() {
      var markup = '<akam-list-box data="mydata" schema="columns" ></akam-list-box>';
      addElement(markup);
      httpBackend.flush();
      timeout.flush();
    });
    it('should be able to deselect an item', function() {
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);

      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(allCheckedCheckboxes.length).toEqual(0);
    });
    it('should updated total selected field', function() {
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);

      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);

      expect(numberSelectedSpan.textContent).toMatch(/Selected: 0/);
    });
    it('should change background color of deselected items', function() {
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      utilities.click(firstRowCheckbox);

      expect(firstRowCheckbox.parentNode.parentNode.classList.contains('row-selected')).toBe(false);
    });
    it('should be able to deselet a row by clicking a row', function() {
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelectorAll('td')[4];
      utilities.click(firstRowCheckbox);
      utilities.click(firstRowCheckbox);

      expect(firstRowCheckbox.parentNode.classList.contains('row-selected')).toBe(false);
    });
    it('should only trigger updateChanged twice one on, one off', function() {
      var spyOnChange = spyOn(scope.$$childTail, "updateChanged");

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();
      firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();
      expect(spyOnChange.calls.count()).toEqual(2);
    });
  });
  describe('when activating view selected only option', function() {
    beforeEach(function() {
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();
    });
    it('should hide unselected items when "view selected only" pressed', function() {
      var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();
      utilities.click(viewSelectOnlyCheckbox);
      scope.$digest();

      var allVisibleRows = document.querySelectorAll(TABLE_ROW);

      expect(allVisibleRows.length).toEqual(1);
    });
    it('should remove item from view if deselected', function() {

      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();
      var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
      utilities.click(viewSelectOnlyCheckbox);
      scope.$digest();
      firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();

      var allVisibleRows = document.querySelectorAll(TABLE_ROW);

      expect(allVisibleRows.length).toEqual(0);
    });
    it('should show unselected items when "view selected only" re-pressed', function() {
      var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      scope.$digest();
      utilities.click(viewSelectOnlyCheckbox);
      scope.$digest();
      utilities.click(viewSelectOnlyCheckbox);
      scope.$digest();

      var allVisibleRows = document.querySelectorAll(TABLE_ROW);

      expect(allVisibleRows.length).toEqual(scope.mydata.length);
    });
    it('should deactivate selectall checkbox', function() {
      var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      utilities.click(viewSelectOnlyCheckbox);
      utilities.click(viewSelectOnlyCheckbox);

      var viewSelectedOnlyCheckboxIfItsChecked = document.querySelectorAll(VIEW_SELECTED_ONLY_CHECKBOX + ":checked");

      expect(viewSelectedOnlyCheckboxIfItsChecked.length).toEqual(0);
    });
  });
  describe('when interacting with filter bar', function() {
    beforeEach(function() {
      scope.mydata = [{name: "iiiKevfƒiii"}, {name: "Keviiiiii"}, {name: "iiiiiiKev"}, {name: "iiiiiijohn"}, {name: "iiijohniii"}];
      scope.columns = [{content: "name", header: 'Name', sort: false}];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      httpBackend.flush();
      timeout.flush();
    });
    it('should be not be redenered with clear icon', function() {
      var clearFilterTextIcon = document.querySelector('div.list-box-filter i');
      expect(clearFilterTextIcon).toBe(null);
    });
    it('should filter based on input beginning-middle-end matches', function() {
      scope.$$childHead.state.filter = "Kev";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();
      expect(document.querySelectorAll(TABLE_ROW).length).toEqual(3);

      //CURRENTLY IN A FAILING CASE FILTER DOES NOT REORDER BASED UPON ACCURACY
      //expect(document.querySelectorAll(TABLE_ROW)[0].querySelectorAll('td')[1].textContent).toContain('Keviiiiii');
      //expect(document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[1].textContent).toContain('iiiKeviii');
      //ƒexpect(document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1].textContent).toContain('iiiiiiKev');
    });
    it('should filter only selected items when view selected only selected', function() {
      var firstRowCheckbox = document.querySelector(TABLE_ROW).querySelector('td input');
      utilities.click(firstRowCheckbox);
      utilities.click(document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX));
      scope.$$childHead.state.filter = "Kev";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();
      var allVisibleRows = document.querySelectorAll(TABLE_ROW);
      expect(allVisibleRows.length).toEqual(1);
    });
    it('should not change selected value', function() {
      scope.$$childHead.state.filter = "Kev";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();
      var numberSelectedSpan = document.querySelector(SELECTED_SPAN);
      expect(numberSelectedSpan.textContent).toMatch(/Selected: 0/);
    });
    it('should be able to clear filter text', function() {
      scope.$$childHead.state.filter = "Kev";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var allVisibleRows = document.querySelectorAll(TABLE_ROW);
      expect(allVisibleRows.length).toEqual(3);

      var clearFilterTextIcon = document.querySelector('div.filter i');
      utilities.click(clearFilterTextIcon);
      scope.$digest();

      allVisibleRows = document.querySelectorAll(TABLE_ROW);
      expect(allVisibleRows.length).toEqual(scope.mydata.length);
    });
  });
  describe('when there is no data', function() {
    beforeEach(function() {
      scope.baddata = [];
      scope.badcolumns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      httpBackend.flush();
      var markup = '<akam-list-box data="baddata" schema="badcolumns"></akam-list-box>';
      addElement(markup);
      timeout.flush();
    });
    it('should present message when no data is available and no filters that can be provided', function() {
      scope.baddata = [];
      scope.columns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      var dataTableRow = document.querySelector('.empty-table-message');
      expect(dataTableRow.textContent).toMatch(/There is no data based upon your criteria/);
    });
    it('should present the "no data" message when no data is available and filtered', function() {
      scope.$$childHead.state.filter = "Oliver";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toContain('There is no data based upon your criteria');
    });
    it('should present a the no data message when no data is available not filtered and view selected only on', function() {
      var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
      utilities.click(viewSelectOnlyCheckbox);
      scope.$digest();

      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toContain('There is no data based upon your criteria');
    });
  });
  describe('when there is no data can provide messages', function() {
    var NO_DATA_MESSAGE = 'oh noes!11!!!';
    var NONE_SELECTED_MESSAGE = 'none selected!!!!!!';
    var NO_FILTER_RESULTS_MESSAGE = "zero filter results";
    beforeEach(function() {
      scope.baddata = [];
      scope.badcolumns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      httpBackend.flush();
      scope.myNoDataMessage = NO_DATA_MESSAGE;
      scope.myNoneSelectedMessage = NONE_SELECTED_MESSAGE;
      scope.myNoFilterResultsMessage = NO_FILTER_RESULTS_MESSAGE;
      var markup = '<akam-list-box data="baddata" schema="badcolumns" no-data-message="myNoDataMessage" no-filter-results-message="zero filter results"' +
        'none-selected-message="none selected!!!!!!"></akam-list-box>';
      addElement(markup);
      timeout.flush();
    });
    it('should present the "no data" message when no data is available and no filters that can be provided', function() {
      scope.baddata = [];
      scope.columns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toContain(NO_DATA_MESSAGE);
    });
    it('should present the "no data" message when no data is available and filtered', function() {
      scope.$$childHead.state.filter = "Oliver";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toContain(NO_DATA_MESSAGE);
    });
    it('should present a the no data message when no data is available not filtered and view selected only on', function() {
      var viewSelectOnlyCheckbox = document.querySelector(VIEW_SELECTED_ONLY_CHECKBOX);
      utilities.click(viewSelectOnlyCheckbox);
      scope.$digest();

      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toContain(NO_DATA_MESSAGE);
    });
  });
  describe('when data messes up', function() {
    it('should recognize null content when redenring', function() {
      scope.baddata = [
        {first: "Nick"},
        {first: "Kevin"}];
      scope.columns = [
        {
          content: function() {
            return null;
          },
          header: 'Full Name'
        }
      ];
      var markup = '<akam-list-box data="baddata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      utilities.click(document.querySelectorAll(TABLE_COLUMN_HEADER)[1]);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var allVisibleRows = document.querySelectorAll(TABLE_ROW);

      expect(rowOneColumnTwo.textContent).toEqual("");
      expect(allVisibleRows.length).toEqual(2);
    });
    it('should recognize null content when sorting name', function() {
      scope.baddata = [
        {name: null},
        {name: null},
        {name: "Kevin"},
        {name: null},
        {name: "James"}];
      scope.columns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      var markup = '<akam-list-box data="baddata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var rowTwoColumnTwo = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[1];
      var rowFourColumnTwo = document.querySelectorAll(TABLE_ROW)[3].querySelectorAll('td')[1];
      var rowFiveColumnTwo = document.querySelectorAll(TABLE_ROW)[4].querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toEqual('');
      expect(rowTwoColumnTwo.textContent).toEqual('');
      expect(rowFourColumnTwo.textContent).toContain('James');
      expect(rowFiveColumnTwo.textContent).toContain('Kevin');
    });
  });
  describe('when errors are thrown', function() {
    it('should throw error when column content is null', function() {
      scope.mydata = [
        {name: "Bob"},
        {name: null},
        {name: null},
        {name: "James"}
      ];
      scope.badcolumns = [
        {
          content: "name",
          header: "header"
        },
        {
          content: null,
          header: 'Name'
        }
      ];
      var markup = '<akam-list-box data="mydata" schema="badcolumns"></akam-list-box>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual('The column content field is using an unknown type. Content field may only be String or Function type');
      }
    });
    it('should throw error when data is not an array', function() {
      scope.mydata = null;
      scope.columns = [
        {
          content: null,
          header: 'Name'
        },
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("Data must be an array");
      }
    });
    it('should throw error when schema is not an array', function() {
      scope.mydata = [];
      scope.columns = null;
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("Schema must be an array");
      }
    });
    it('should throw error when sort column is null', function() {
      scope.mydata = [
        {'name': "Kevin"},
        {'name': "Alejandro"}
      ];
      scope.columns = [
        {
          content: 'name',
          header: 'Name',
          sort: null
        }
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();
      try {
        scope.$$childHead.sortColumn(undefined);
      } catch (e) {
        expect(e).toEqual("Column may not be null/undefined");
      }
    });
  });
  describe('when changing html inputs', function() {
    it('should throw error when schema is not provided', function() {
      scope.messedupcolumns = {};
      var markup = '<akam-list-box data="mydata"></akam-list-box>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("Schema must be an array");
      }
    });
    it('should throw error when data is not provided', function() {
      scope.messedupcolumns = {};
      var markup = '<akam-list-box schema="columns"></akam-list-box>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("Data must be an array");
      }
    });
  });

  describe('when passing in unsafe data', function() {

    it('should strip it out when not explicitly trusted', function() {
      scope.mydata = [
        {'name': "<span>Kevin</span><script>alert('pwn3d');</script>"},
        {'name': "Alejandro"}
      ];
      scope.columns = [
        {
          content: 'name',
          header: 'Name',
          sort: false
        }
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).not.toContain('pwn3d');
      expect(rowOneColumnTwo.textContent).toContain('Kevin');
    });

    it('should do bad things when it is explicitly trusted', function() {
      scope.mydata = [
        {'name': "Kevin<script>alert('pwn3d');</script>"},
        {'name': "Alejandro"}
      ];
      scope.columns = [
        {
          content: function() {
            return sce.trustAsHtml(this.name);
          },
          header: 'Name',
          sort: false
        }
      ];
      var markup = '<akam-list-box data="mydata" schema="columns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toContain('pwn3d');
    });
  })

  describe('when scrolling ', function(){
    it('should load more data', function(){
      scope.jsonColumns = [
        {
          content: function() {return this.first + ' ' + this.last;},
          header: 'Full Name',
          className: 'column-full-name'
        },
        {content: 'id', header: 'Emp. ID', className: 'column-employeeid'}
      ];
      scope.jsonData = require('./http-data/list-box-data.json').slice(0,30);
      var markup = '<akam-list-box data="jsonData" schema="jsonColumns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var totalRows = document.querySelectorAll(TABLE_ROW);
      expect(totalRows.length).toEqual(MAX_INITIALLY_DISPLAYED);

      utilities.scroll('div.fixed-table-container-inner', 1000);
      scope.$digest();
      totalRows = document.querySelectorAll(TABLE_ROW);

      expect(scope.$$childTail.dataSource.length).toEqual(20);
      expect(totalRows.length).not.toEqual(MAX_INITIALLY_DISPLAYED);
    });
    it('should stop loading data if end is reached', function(){
      scope.jsonColumns = [
        {
          content: function() {return this.first + ' ' + this.last;},
          header: 'Full Name',
          className: 'column-full-name'
        },
        {content: 'id', header: 'Emp. ID', className: 'column-employeeid'}
      ];
      scope.jsonData = require('./http-data/list-box-data.json').slice(0,25);
      var markup = '<akam-list-box data="jsonData" schema="jsonColumns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      utilities.scroll('div.fixed-table-container-inner', 1000);
      scope.$digest();

      utilities.scroll('div.fixed-table-container-inner', 2000);
      scope.$digest();

      utilities.scroll('div.fixed-table-container-inner', 3000);
      scope.$digest();

      var totalRows = document.querySelectorAll(TABLE_ROW);
      expect(scope.$$childTail.dataSource.length).toEqual(25);
      expect(totalRows.length).not.toEqual(MAX_INITIALLY_DISPLAYED);
    });
    it('should leave data if rescrolled to top.', function(){
      scope.jsonColumns = [
        {
          content: function() {return this.first + ' ' + this.last;},
          header: 'Full Name',
          className: 'column-full-name'
        },
        {content: 'id', header: 'Emp. ID', className: 'column-employeeid'}
      ];
      scope.jsonData = require('./http-data/list-box-data.json').slice(0,25);
      var markup = '<akam-list-box data="jsonData" schema="jsonColumns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      utilities.scroll('div.fixed-table-container-inner', 1000);
      scope.$digest();

      var totalRows = document.querySelectorAll(TABLE_ROW);

      expect(scope.$$childTail.dataSource.length).toEqual(20);
      expect(totalRows.length).not.toEqual(MAX_INITIALLY_DISPLAYED);
    });
    it('should not scroll past max-height', function(){
      scope.jsonColumns = [
        {
          content: function() {return this.first + ' ' + this.last;},
          header: 'Full Name',
          className: 'column-full-name'
        },
        {content: 'id', header: 'Emp. ID', className: 'column-employeeid'}
      ];
      scope.jsonData = require('./http-data/list-box-data.json');
      var markup = '<akam-list-box data="jsonData" schema="jsonColumns"></akam-list-box>';
      addElement(markup);
      timeout.flush();

      var totalRows = document.querySelectorAll(TABLE_ROW);
      expect(totalRows.length).toEqual(MAX_INITIALLY_DISPLAYED);

      var element = angular.element(document.querySelector('div.fixed-table-container-inner'));

      element.css({"max-height":'150px'})

      element.scrollTop = 10000;
      element.triggerHandler('scroll');
      scope.$digest();

      expect(totalRows.length).toEqual(MAX_INITIALLY_DISPLAYED);
    });
  });
});