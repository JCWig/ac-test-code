'use strict';
var utilities = require('../utilities');
var FILTER_BOX = 'div.filter input[type="search"]';
var FILTER_ICON = 'div.filter i.clear-filter';
var ALL_CHECKED_CHECKBOXES = 'input[type="checkbox"]:checked';
var TABLE_COLUMN_HEADER = '.akam-data-table thead tr th';
var TABLE_ROW = 'div.akam-data-table tbody tr';

var MENU_BUTTON_WRAPPER = '.akam-menu-button';
var MENU_BUTTON_BUTTON = '.akam-menu-button i.luna-gear';
var MENU_BUTTON_ITEMS = '.akam-menu-button li';
var DROP_DOWN_MENU = '.akam-menu-button .dropdown-menu';

var PREVIOUS_BUTTON = 'div.akam-pagination .pagination li:first-child';
var NEXT_BUTTON = 'div.akam-pagination .pagination li:last-child';
var TOTAL_ITEMS_SPAN = 'div.akam-pagination .total-items';
var PAGINATION_PAGE_ONE = 'div.akam-pagination .pagination li:nth-child(2)';
var PAGINATION_INDEX_NTH = 'div.akam-pagination .pagination li:nth-child';
var PAGINATION_INDEX_REVERSE = 'div.akam-pagination .pagination li:nth-last-child';
var PAGE_SIZE_SMALLEST = 'div.akam-pagination .page-size li:first-child';
var PAGE_SIZE_LARGEST = 'div.akam-pagination .page-size li:last-child';
var PAGE_SIZE_NTH = 'div.akam-pagination .page-size li:nth-child';
var PAGE_SIZES = 'div.akam-pagination .page-size li';

//i18n Requirements
var LIBRARY_PATH = /\/libs\/akamai-components\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '/apps/appname/locales/en_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require("../i18n/i18n_responses/en_US.json");

describe('akam-data-table', function() {
  var compile = null;
  var scope = null;
  var self = this;
  var q = null;
  var timeout = null;
  var httpBackend = null;
  var http = null;
  beforeEach(function() {
    self = this;
    angular.mock.module(require('../../src/data-table').name);
    angular.mock.module(function($provide, $translateProvider, $sceProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($compile, $rootScope, $q, $timeout, $httpBackend, $http) {
      compile = $compile;
      scope = $rootScope.$new();
      q = $q;
      timeout = $timeout;
      httpBackend = $httpBackend;
      http = $http;
      $httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
      $httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
      $httpBackend.flush();
    });
    scope.mydata = [
      {
        first: 'Oliver',
        last: 'Queen',
        id: 11,
        bu: "<span>Justice League</span>",
        color: "Green",
        birthday: new Date(2001, 10, 20),
        generic: ["seriously whats wrong with arrow cave?"]
      },
      {
        first: "Roy",
        last: "Harper",
        id: 20,
        bu: "<span>Teen Titans</span>",
        color: "Red",
        birthday: new Date(2002, 10, 20),
        generic: ["shoot em up"]
      },
      {
        first: "Dinah",
        last: "Lance",
        id: 35,
        bu: "<span>Birds of Prey</span>",
        color: "Black",
        birthday: new Date(2000, 10, 20),
        generic: ["AAAAAAAAAAAAAAAAAAA"]
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
        content: function() {
          return this.id;
        },
        header: 'ID'
      },
      {
        content: "color",
        header: "Favorite Color",
        sort: function() {
          var colorsValues = {
            'Red': 1,
            'Black': 2,
            'Green': 3
          };
          return colorsValues[this.color];
        }
      },
      {
        content: function() {
          return this.birthday.getDate() + " " + this.birthday.getMonth() + " " + this.birthday.getFullYear();
        },
        header: "Birthday"
      },
      {
        content: "generic",
        header: "Generic Sorting"
      }
    ];
    scope.mybigdata = require('./bigTestingData/thousandUsers');
    scope.bigcolumns = [
      {
        content: function() {
          return this.first_name + ' ' + this.last_name;
        },
        header: 'Full Name',
        className: 'column-full-name'
      },
      {
        content: 'id',
        header: 'Emp. ID',
        className: 'column-employeeid'
      }
    ];
    scope.dataObj = {data: scope.mydata};
  });
  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });
  function addElement(markup) {
    self.el = compile(markup)(scope);
    scope.$digest();
    self.element = document.body.appendChild(self.el[0]);

  }

  describe('when rendering data table', function() {

    it('should show progress bar until fully rendered', function() {
      var deferred = q.defer();
      scope.delayeddata = deferred.promise;
      timeout(function() {
        deferred.resolve(scope.mydata);
      }, 2000);
      var markup = '<akam-data-table data="delayeddata" schema="columns">' +
        '<akam-menu-button icon="luna-gear" position="right">' +
        '<akam-menu-button-item text="PDF" ng-click="process(' + "'PDF'" + ')"></akam-menu-button-item>' +
        '</akam-menu-button></akam-data-table>';
      addElement(markup);

      expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).toMatch(/false/);
      timeout.flush();
      var allRowsLoadedInTable = document.querySelectorAll(TABLE_ROW);

      expect(document.querySelector('akam-indeterminate-progress')).toBe(null);
      expect(allRowsLoadedInTable.length).toEqual(scope.mydata.length);
    });
    it('should render data table and pagination', function() {
      var markup = '<akam-data-table data="mydata" schema="columns">' +
        '</akam-data-table>';
      addElement(markup);
      timeout.flush();
      var dataTableContainer = document.querySelector('div.akam-data-table');
      var paginationContainer = document.querySelector('div.akam-pagination');

      expect(scope.$$childTail.getColumnsLength()).toEqual(5);
      expect(dataTableContainer).not.toBe(null);
      expect(paginationContainer).not.toBe(null);
    });
    it('should render menu buttons and checkboxes', function() {
      var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true">' +
        '<akam-menu-button icon="luna-gear" position="right">' +
        '<akam-menu-button-item text="PDF" ng-click="process(' + "'PDF'" + ')"></akam-menu-button-item>' +
        '</akam-menu-button></akam-data-table>';
      addElement(markup);
      timeout.flush();
      var checkboxes = document.querySelectorAll('input[type="checkbox"]');
      var menuButtons = document.querySelectorAll('.luna-gear');

      expect(scope.$$childTail.getColumnsLength()).toEqual(7); //5 columns + 2 add-ons
      expect(checkboxes.length).toEqual(4); //Select All + 3 Rows
      expect(menuButtons.length).toEqual(3); //1 Menu buttons each for 3 rows
    });
    it('should work if there are no columns at all', function() {
      var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true">' +
        '<akam-menu-button icon="luna-gear" position="right">' +
        '<akam-menu-button-item text="PDF" ng-click="process(' + "'PDF'" + ')"></akam-menu-button-item>' +
        '</akam-menu-button></akam-data-table>';
      addElement(markup);
      timeout.flush();
      scope.$$childTail.columns = null;

      expect(scope.$$childTail.getColumnsLength()).toEqual(2); //5 columns + 2 add-ons
    });
    it('should have filter be clear', function() {
      var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>';
      addElement(markup);
      timeout.flush();
      var filterBox = document.querySelector(FILTER_BOX);

      expect(filterBox.value).toEqual('');
    });
    it('should have 3 options for how many rows are displayed', function() {
      var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>';
      addElement(markup);
      timeout.flush();
      var smallestPageSize = document.querySelector(PAGE_SIZE_SMALLEST);
      var mediumPageSize = document.querySelector(PAGE_SIZE_NTH + '(2)');
      var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST);

      expect(smallestPageSize.textContent).toMatch(/10/);
      expect(mediumPageSize.textContent).toMatch(/25/);
      expect(largestPageSize.textContent).toMatch(/50/);
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

      scope.jsonFromHttpGet = http.get(dataPath);
      var markup = '<akam-data-table data="jsonFromHttpGet" schema="jsonColumns"></akam-data-table>';
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
      httpBackend.when('GET', dataPath).respond(404, "ERROR: NOT FOUND");

      scope.jsonFromHttpGet = http.get(dataPath);
      var markup = '<akam-data-table data="jsonFromHttpGet" schema="jsonColumns"></akam-data-table>';
      addElement(markup);

      expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).toMatch(/false/);
      httpBackend.flush();
      timeout.flush();
      expect(document.querySelector('akam-indeterminate-progress').getAttribute('failed')).toMatch(/true/);

      httpBackend.when('GET', 'success/path').respond(scope.mydata);
      scope.jsonFromHttpGet = http.get('success/path');
      scope.$digest();

      expect(document.querySelector('akam-indeterminate-progress').getAttribute('completed')).toMatch(/false/);
      expect(document.querySelector('akam-indeterminate-progress').getAttribute('failed')).toMatch(/false/);

      httpBackend.flush();
      timeout.flush();

      expect(document.querySelector('akam-indeterminate-progress')).toBe(null);
      expect(document.querySelector(TABLE_ROW)).not.toBe(null);

    });
  });
  describe('when data table is rendered', function() {
    it('should display the total number of results', function() {
      var markup = '<akam-data-table data="mydata" schema="columns" filter-placeholder="yair"></akam-data-table>';
      addElement(markup);
      timeout.flush();
      var totalItemsSpan = document.querySelector(TOTAL_ITEMS_SPAN);

      expect(totalItemsSpan.textContent).toContain('3');
    });
  });
  describe('when rendered with checkboxes', function() {
    beforeEach(function() {
      //value 27 is: {"first_name":"Amanda","last_name":"Allen","email":"aallenr@imgur.com","id":"db71b303-db31-441f-bba4-e8095b728b63"}
      scope.selectedItems1 = [scope.mybigdata[27]];
      var markup = '<akam-data-table data="mybigdata" schema="bigcolumns" show-checkboxes="true" selected-items="selectedItems1"></akam-data-table>';
      addElement(markup);
    });
    it('should show checkboxes for each row', function() {
      expect(document.querySelectorAll(TABLE_ROW).length).toEqual(10);
    });
    it('should have an additional column for checkboxes', function() {
      expect(scope.$$childTail.getColumnsLength()).toEqual(3);
    });
    it('should add checkboxes for each row when page size changes', function() {
      var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST).querySelector('a');
      utilities.click(largestPageSize);
      scope.$digest();
      expect(document.querySelectorAll(TABLE_ROW).length).toEqual(50);
    });
    it('should not delete selectedItems on load', function() {
      expect(scope.$$childTail.selectedItems[0].first_name).toEqual("Amanda");
      expect(scope.$$childTail.selectedItems[0].last_name).toEqual("Allen");
      expect(scope.$$childTail.selectedItems[0].id).toEqual("db71b303-db31-441f-bba4-e8095b728b63");
      expect(scope.$$childTail.selectedItems.length).toEqual(1);
    });
    it('should be able to select items and add onto given selected items', function() {
      var rowOneCheckbox = document.querySelector(TABLE_ROW).querySelectorAll('td')[0].querySelector('input');
      utilities.click(rowOneCheckbox);
      scope.$digest();
      expect(scope.$$childTail.internalSelectedItems[1].first_name).toEqual("Aaron");
      expect(scope.$$childTail.internalSelectedItems[1].last_name).toEqual("Miller");
      expect(scope.$$childTail.internalSelectedItems[1].id).toEqual("c1286872-2774-4c5a-8aa6-91be36b23a6a");
      expect(scope.$$childTail.internalSelectedItems.length).toEqual(2);
    });
    it('should auto check the preselected items even on next page', function() {
      var nextArrow = document.querySelector(NEXT_BUTTON).querySelector('a');
      utilities.click(nextArrow);
      scope.$digest();
      var allCheckedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);
      expect(allCheckedCheckboxes.length).toEqual(1);
    });
    it('selecting items should only run process once', function() {
      var spyOnChange = spyOn(scope.$$childTail, "updateChanged").and.callThrough();
      var rowOneCheckbox = document.querySelector(TABLE_ROW).querySelectorAll('td')[0].querySelector('input');
      utilities.click(rowOneCheckbox);
      scope.$digest();
      expect(spyOnChange).calledOnce;
      expect(scope.$$childTail.selectedItems.length).toEqual(2);
    });
    it('should be able to deselect items and trigger run process twice', function() {
      var spyOnChanged = spyOn(scope.$$childTail, "updateChanged").and.callThrough();
      var rowOneCheckbox = document.querySelector(TABLE_ROW).querySelectorAll('td')[0].querySelector('input');
      utilities.click(rowOneCheckbox);
      scope.$digest();
      var newCheckbox = document.querySelector(TABLE_ROW).querySelectorAll('td')[0].querySelector('input');
      utilities.click(newCheckbox);

      expect(spyOnChanged.calls.count()).toEqual(2);
      expect(scope.$$childTail.selectedItems.length).toEqual(1);
    });
    it('should be able to view selected only items', function() {
      //CURRENTY NOT ACTUALLY IMPLEMENTED ACCESSING FIELD DIRECTLY TO TEST
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[0].querySelector('input');
      var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0].querySelector('input');
      utilities.click(rowOneColumnTwo);
      utilities.click(rowThreeColumnOne);
      scope.$digest();
      scope.$$childTail.state.viewSelectedOnly = true;
      scope.$$childTail.updateSearchFilter();
      scope.$digest();

      // there is already one pre-selected item and we click on two more
      expect(document.querySelectorAll(TABLE_ROW).length).toEqual(3);
    });
    it('should be able to select all items', function() {
      //CURRENTY NOT ACTUALLY IMPLEMENTED ACCESSING FIELD DIRECTLY TO TEST
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];
      var largestPageSize = document.querySelector(PAGE_SIZE_LARGEST).querySelector('a');
      utilities.click(rowOneColumnTwo);
      utilities.click(rowThreeColumnOne);

      scope.$$childTail.state.allSelected = true;
      scope.$$childTail.updateSearchFilter();
      scope.$digest();
      var checkedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(checkedCheckboxes.length).toEqual(11);

      utilities.click(largestPageSize);
      scope.$digest();
      checkedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);

      expect(checkedCheckboxes.length).toEqual(51);

    });
    /*
     it('should reset selectedItems to [] when changed to non array value', function(){
     scope.selectedItems1 = {};
     scope.$digest();

     expect(Array.isArray(scope.selectedItems1)).toBe(true);
     });*/
  });
  describe('when interacting with sort options', function() {
    beforeEach(function() {
      var markup = '<akam-data-table data="mydata" schema="columns"></akam-data-table>';
      addElement(markup);
    });
    it('should be able to sort alphabetically', function() {
      var sortByColumnOneAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[0];
      utilities.click(sortByColumnOneAlphabectically);
      utilities.click(sortByColumnOneAlphabectically);

      var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
      var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];

      expect(rowOneColumnOne.textContent).toMatch(/Dinah Lance/);
      expect(rowThreeColumnOne.textContent).toMatch(/Roy Harper/);
    });
    it('should be able to sort reverse-alphabetically', function() {
      var sortByColumnOneAlphabectically = document.querySelectorAll(TABLE_COLUMN_HEADER)[0];
      utilities.click(sortByColumnOneAlphabectically);

      var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
      var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];

      expect(rowOneColumnOne.textContent).toMatch(/Roy Harper/);
      expect(rowThreeColumnOne.textContent).toMatch(/Dinah Lance/);
    });
    it('should be able to sort numerically', function() {
      var sortByColumnTwoNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwoNumerically);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/11/);
      expect(rowThreeColumnTwo.textContent).toMatch(/35/);
    });
    it('should be able to sort reverse-numerically', function() {
      var sortByColumnTwoNumerically = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwoNumerically);
      utilities.click(sortByColumnTwoNumerically);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var rowThreeColumnTwo = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/35/);
      expect(rowThreeColumnTwo.textContent).toMatch(/11/);
    });
    it('should be able to sort by custom function', function() {
      var sortByColumnThreeCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
      utilities.click(sortByColumnThreeCustom);

      var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
      var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

      expect(rowOneColumnThree.textContent).toMatch(/Red/);
      expect(rowThreeColumnThree.textContent).toMatch(/Green/);
    });
    it('should be able to sort by reverse custom function', function() {
      var sortByColumnThreeCustom = document.querySelectorAll(TABLE_COLUMN_HEADER)[2];
      utilities.click(sortByColumnThreeCustom);
      utilities.click(sortByColumnThreeCustom);

      var rowOneColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];
      var rowThreeColumnThree = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[2];

      expect(rowOneColumnThree.textContent).toMatch(/Green/);
      expect(rowThreeColumnThree.textContent).toMatch(/Red/);
    });
    it('should be able to sort generically', function() {
      var sortByColumnFiveGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[4];
      utilities.click(sortByColumnFiveGeneric);

      var rowOneColumnFive = document.querySelector(TABLE_ROW).querySelectorAll('td')[4];
      var rowThreeColumnFive = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[4];

      expect(rowOneColumnFive.textContent).toContain('AAAAAAAAAAAAAAAAAAA');
      expect(rowThreeColumnFive.textContent).toContain('shoot em up');
    });
    it('should be able to sort reverse generically', function() {
      var sortByColumnFiveGeneric = document.querySelectorAll(TABLE_COLUMN_HEADER)[4];
      utilities.click(sortByColumnFiveGeneric);
      utilities.click(sortByColumnFiveGeneric);

      var rowOneColumnFive = document.querySelector(TABLE_ROW).querySelectorAll('td')[4];
      var rowThreeColumnFive = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[4];

      expect(rowOneColumnFive.textContent).toContain('shoot em up');
      expect(rowThreeColumnFive.textContent).toContain('AAAAAAAAAAAAAAAAAAA');
    });
    it('should sort entire rows', function() {

      var firstRowColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
      var firstRowColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var firstRowColumnThree = document.querySelector(TABLE_ROW).querySelectorAll('td')[2];

      expect(firstRowColumnOne.textContent).toMatch(/Dinah Lance/);
      expect(firstRowColumnTwo.textContent).toMatch(/35/);
      expect(firstRowColumnThree.textContent).toMatch(/Black/);
    });
  });
  describe('when using unique sort cases', function() {
    it('should not bother sorting one row', function() {
      scope.basicdata = [
        {'name': "Kevin"}
      ];
      scope.basiccolumns = [
        {
          content: 'name',
          header: 'Name'
        }
      ];
      var markup = '<akam-data-table data="basicdata" schema="basiccolumns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);

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
      var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);

      var sortByColumnTwo = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      utilities.click(sortByColumnTwo);
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Kevin/);
    });
    it('should be able to sort on different field', function() {
      scope.mydata = [{'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8}];
      scope.columns = [{content: 'name', header: 'Name', sort: 'id'}];
      var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);

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
      var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Alejandro/);
    });
    it('should not default if all columns are unsortable', function() {
      scope.mydata = [
        {'name': "Oliver", 'id': 25},
        {'name': "Barry", 'id': 17}
      ];
      scope.columns = [
        {content: 'name', header: 'Name', sort: false},
        {content: "id", header: "Id", sort: false}
      ];
      var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Oliver/);
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
      var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);
      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Oliver Queen/);
    });
    it('should be able to sort on different field', function() {
      scope.mydata = [{'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8}];
      scope.columns = [{content: 'name', header: 'Name', sort: 'id'}];
      var markup = '<akam-data-table data="mydata" schema="columns" show-checkboxes="true">></akam-data-table>';
      addElement(markup);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toMatch(/Kevin/);
    });
  });
  describe('when navigating the data table', function() {
    beforeEach(function() {
      var markup = '<akam-data-table data="mybigdata" schema="bigcolumns"></akam-data-table>';
      addElement(markup);
    });
    it('should highlight the clicked page', function() {
      var fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH + '(4)');

      expect(fourthClickablePaginationIndex.classList.contains('active')).toBe(false);

      utilities.click(fourthClickablePaginationIndex.querySelector('a'));
      scope.$digest();

      fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH + '(4)');
      expect(fourthClickablePaginationIndex.classList.contains('active')).toBe(true);
    });
    it('should change dislayed data appropriately', function() {
      var fourthClickablePaginationIndex = this.element.querySelector(PAGINATION_INDEX_NTH + '(4)');

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
      expect(rowOneColumnTwo.textContent).toMatch(/Aaron Miller/);

      utilities.click(fourthClickablePaginationIndex.querySelector('a'));
      scope.$digest();

      rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
      expect(rowOneColumnTwo.textContent).toMatch(/Amanda Lewis/);
    });
  });
  describe('when interacting with the filter bar', function() {
    beforeEach(function() {
      var markup = '<akam-data-table data="mybigdata" schema="bigcolumns"></akam-data-table>';
      addElement(markup);
    });
    it('should filter based on input beginning-middle-end matches', function() {
      scope.$$childHead.state.filter = "Kevin";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();
      var totalItemsSpan = document.querySelector(TOTAL_ITEMS_SPAN);

      expect(document.querySelectorAll(TABLE_ROW).length).toEqual(8);
      expect(totalItemsSpan.textContent).toContain('8');
    });
    xit('should change text color of matching input (case insensitive)', function() {
      scope.$$childHead.state.filter = "kevin";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var rowOneColumnOneHighlighted = document.querySelector(TABLE_ROW).querySelector('td span');

      expect(rowOneColumnOneHighlighted.textContent).toMatch(/Kevin/);

    });
    it('should be able to filter on any column', function() {
      scope.$$childHead.state.filter = "95453e7";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
      expect(rowOneColumnOne.textContent).toMatch(/Karen Holmes/);
    });
    it('should revert to pagination index 1', function() {
      scope.$$childHead.state.filter = "Kev";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();
      var pageOneIndex = document.querySelector(PAGINATION_INDEX_NTH + '(2)');
      var previousArrow = document.querySelector(PREVIOUS_BUTTON);
      var nextArrow = document.querySelector(NEXT_BUTTON);

      expect(pageOneIndex.classList.contains('active')).toBe(true);
      expect(previousArrow.classList.contains('disabled')).toBe(true);
      expect(nextArrow.classList.contains('disabled')).toBe(true);
    });
    it('should be able to clear filter with icon click', function() {
      scope.$$childHead.state.filter = "Kevin";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var totalItemsSpan = document.querySelector(TOTAL_ITEMS_SPAN);
      var filterIcon = document.querySelector(FILTER_ICON);
      var pageOneIndex = document.querySelector(PAGINATION_PAGE_ONE);
      utilities.click(filterIcon);
      scope.$digest();

      expect(document.querySelectorAll(TABLE_ROW).length).toEqual(10);
      expect(totalItemsSpan.textContent).toContain('1000');
      expect(pageOneIndex.classList.contains('active')).toBe(true);
    });
    it('should not match any HTML tags', function() {
      scope.$$childHead.state.filter = "span";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var allVisibleRows = document.querySelectorAll(TABLE_ROW);
      expect(allVisibleRows.length).toEqual(0);
    });
  });
  describe('when filtering numbers', function() {
    xit('will highlight numbers correctly and filter on them', function() {
      var markup = '<akam-data-table data="mydata" schema="columns"></akam-data-table>';
      addElement(markup);
      scope.$$childHead.state.filter = "5";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();
      var totalItemsSpan = document.querySelector(TOTAL_ITEMS_SPAN);

      var rowOneColumnOneHighlighted = document.querySelector(TABLE_ROW).querySelector('td span');
      var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];

      expect(rowOneColumnOne.textContent).toMatch(/Dinah Lance/);
      expect(rowOneColumnOneHighlighted.textContent).toMatch(/5/);
      expect(document.querySelectorAll(TABLE_ROW).length).toEqual(1);
      expect(totalItemsSpan.textContent).toContain('1');
    });
  });
  describe('when rendered with action buttons', function() {
    beforeEach(function() {
      var markup = '<akam-data-table data="mydata" schema="columns">' +
        '<akam-menu-button icon="luna-gear" position="right">' +
        '<akam-menu-button-item text="PDF" ng-click="process(' + "'PDF'" + ')"></akam-menu-button-item>' +
        '<akam-menu-button-item text="XML" ng-click="process(' + "'XML'" + ')"></akam-menu-button-item>' +
        '</akam-menu-button></akam-data-table>';
      addElement(markup);
      timeout.flush();
    });
    it('should display all actions closed to start', function() {
      var menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button');
      var menuButton = menuDiv.querySelector('i');

      menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button');
      menuButton = menuDiv.querySelector('i');
      var options = menuDiv.querySelectorAll('.dropdown-menu li');

      expect(menuDiv.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toEqual('false');
    });
    it('should display all actions that can be taken', function() {
      var menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button');
      var menuButton = menuDiv.querySelector('i');

      utilities.click(menuButton);
      scope.$digest();

      menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button');
      menuButton = menuDiv.querySelector('i');
      var options = menuDiv.querySelectorAll('.dropdown-menu li');

      expect(menuDiv.classList.contains('open')).toBe(true);
      expect(menuButton.getAttribute('aria-expanded')).toEqual('true');
      expect(options.length).toEqual(2);
      expect(options[0].textContent).toMatch(/PDF/);
      expect(options[1].textContent).toMatch(/XML/);
    });
    it('should be able to be closed and no action taken', function() {
      scope.process = function(value) {};
      spyOn(scope, "process");
      var menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button')
      var menuButton = menuDiv.querySelector('i');

      utilities.click(menuButton);
      scope.$digest();
      utilities.click(menuButton);
      scope.$digest();

      expect(menuDiv.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toEqual('false');
      expect(scope.process).not.toHaveBeenCalled();
    });
    it('should perform an action on that row if pressed', function() {
      scope.process = function(value) {};
      spyOn(scope, "process");
      var menuDiv = document.querySelector(TABLE_ROW).querySelector('.akam-menu-button')
      var menuButton = menuDiv.querySelector('i');

      utilities.click(menuButton);
      scope.$digest();

      var options = menuDiv.querySelectorAll('.dropdown-menu li a');
      utilities.click(options[0]);
      scope.$digest();

      expect(scope.process).toHaveBeenCalledWith("PDF");
      expect(menuDiv.classList.contains('open')).toBe(false);
    });
  });
  describe('when interacting with menu button', function() {
    beforeEach(function() {
      var markup = '<akam-data-table data="mydata" schema="columns">' +
        '<akam-menu-button icon="luna-gear" position="right">' +
        '<akam-menu-button-item text="PDF" ng-click="process(' + "'PDF'" + ')"></akam-menu-button-item>' +
        '<akam-menu-button-item text="XML" ng-click="process(' + "'XML'" + ')"></akam-menu-button-item>' +
        '</akam-menu-button></akam-data-table>';
      addElement(markup);
      timeout.flush();
    });
    it('should display an icon', function() {
      var menuButton = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_BUTTON);
      expect(menuButton.classList.contains('icon-states')).toBe(true);
    });

    it('should hide the menu', function() {
      var menuButtonWrapper = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_WRAPPER);
      expect(menuButtonWrapper.classList.contains('open')).toBe(false);
    });
    it('should display the menu', function() {
      var menuButton = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_BUTTON);
      utilities.click(menuButton);
      scope.$digest();

      var menuButtonWrapper = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_WRAPPER);
      expect(menuButtonWrapper.classList.contains('open')).toBe(true);
      expect(menuButtonWrapper.querySelector(MENU_BUTTON_BUTTON).getAttribute('aria-expanded')).toEqual('true');

      var dropDownMenu = document.querySelector(TABLE_ROW).querySelector(DROP_DOWN_MENU);

      expect(getComputedStyle(dropDownMenu).display).toEqual('block');
    });
    it('should display the menu items', function() {
      var menuButton = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_BUTTON);
      utilities.click(menuButton);
      scope.$digest();
      var menuButtonItems = document.querySelector(TABLE_ROW).querySelectorAll(MENU_BUTTON_ITEMS);
      expect(menuButtonItems.length).toEqual(2);
      expect(menuButtonItems[0].textContent).toMatch(/PDF/);
    });
    it('should trigger the menu item action', function() {
      scope.process = function(value) {};
      spyOn(scope, "process");
      var menuButton = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_BUTTON);
      utilities.click(menuButton);
      scope.$digest();

      var options = document.querySelector(TABLE_ROW).querySelectorAll('.dropdown-menu li a')[0];
      utilities.click(options);
      scope.$digest();

      expect(scope.process).toHaveBeenCalledWith("PDF");
    });
    it('should hide the menu when clicking item', function() {
      var menuButton = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_BUTTON);
      utilities.click(menuButton);
      scope.$digest();

      var options = document.querySelector(TABLE_ROW).querySelectorAll('.dropdown-menu li a')[0];
      utilities.click(options);
      scope.$digest();

      var menuButtonWrapper = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_WRAPPER);
      var dropDownMenu = document.querySelector(TABLE_ROW).querySelector(DROP_DOWN_MENU);

      expect(menuButtonWrapper.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toEqual('false');
      expect(getComputedStyle(dropDownMenu).display).toEqual('none');
    });
    it('clicking menu button should hide dropdown', function() {
      var menuButton = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_BUTTON);
      utilities.click(menuButton);
      scope.$digest();
      utilities.click(menuButton);
      scope.$digest();

      var menuButtonWrapper = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_WRAPPER);
      var dropDownMenu = document.querySelector(TABLE_ROW).querySelector(DROP_DOWN_MENU);

      expect(menuButtonWrapper.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toEqual('false');
      expect(getComputedStyle(dropDownMenu).display).toEqual('none');
    });
    it('click -button- shoud hide dropdown', function() {
      var menuButton = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_BUTTON);
      var menuButtonWrapper = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_WRAPPER);
      var dropDownMenu = document.querySelector(TABLE_ROW).querySelector(DROP_DOWN_MENU);

      utilities.click(menuButton);
      scope.$digest();

      utilities.clickAwayCreationAndClick('button');

      expect(menuButtonWrapper.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toEqual('false');
      expect(getComputedStyle(dropDownMenu).display).toEqual('none');
    });
    it('click -div- shoud hide dropdown', function() {
      var menuButton = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_BUTTON);
      var menuButtonWrapper = document.querySelector(TABLE_ROW).querySelector(MENU_BUTTON_WRAPPER);
      var dropDownMenu = document.querySelector(TABLE_ROW).querySelector(DROP_DOWN_MENU);

      utilities.click(menuButton);
      scope.$digest();

      utilities.clickAwayCreationAndClick('div');

      expect(menuButtonWrapper.classList.contains('open')).toBe(false);
      expect(menuButton.getAttribute('aria-expanded')).toEqual('false');
      expect(getComputedStyle(dropDownMenu).display).toEqual('none');
    });
  });
  describe('when data gets messed up', function() {
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
      var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);

      utilities.click(document.querySelectorAll(TABLE_COLUMN_HEADER)[1]);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var allVisibleRows = document.querySelectorAll(TABLE_ROW);

      expect(rowOneColumnTwo.textContent).toEqual('');
      expect(allVisibleRows.length).toEqual(2);
    });
    it('should recognize content not matching', function() {
      scope.baddata = [
        {first: "Nick"},
        {first: "Kevin"}];
      scope.columns = [
        {
          content: "no-matches",
          header: 'Full Name'
        }
      ];
      var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);

      utilities.click(document.querySelectorAll(TABLE_COLUMN_HEADER)[1]);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var allVisibleRows = document.querySelectorAll(TABLE_ROW);

      expect(rowOneColumnTwo.textContent).toEqual('');
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
      var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);

      var rowOneColumnTwo = document.querySelector(TABLE_ROW).querySelectorAll('td')[1];
      var rowTwoColumnTwo = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[1];
      var rowFourColumnTwo = document.querySelectorAll(TABLE_ROW)[3].querySelectorAll('td')[1];
      var rowFiveColumnTwo = document.querySelectorAll(TABLE_ROW)[4].querySelectorAll('td')[1];

      expect(rowOneColumnTwo.textContent).toEqual('');
      expect(rowTwoColumnTwo.textContent).toEqual('');
      expect(rowFourColumnTwo.textContent).toContain('James');
      expect(rowFiveColumnTwo.textContent).toContain('Kevin');
    });

    it('should be able to handle data object for data', function() {
      var markup = '<akam-data-table data="dataObj" schema="columns" filter-placeholder="placeholder"></akam-data-table>'
      addElement(markup);

      var rowOneColumnOne = document.querySelector(TABLE_ROW).querySelectorAll('td')[0];
      var rowTwoColumnOne = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[0];
      var rowThreeColumnOne = document.querySelectorAll(TABLE_ROW)[2].querySelectorAll('td')[0];

      expect(rowOneColumnOne.textContent).toMatch(/Dinah Lance/);
      expect(rowTwoColumnOne.textContent).toMatch(/Oliver Queen/);
      expect(rowThreeColumnOne.textContent).toMatch(/Roy Harper/);
    });
    it('should present message when no data is available and no filters', function() {
      scope.baddata = [];
      scope.columns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);
      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toMatch(/There is no data based upon your criteria/);
    });
    it('should be able to provivde a message when no data is available and no filters', function() {
      var NO_DATA_MESSAGE = 'Oh noes!';
      scope.baddata = [];
      scope.columns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      scope.myNoDataMessage = NO_DATA_MESSAGE;
      var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true" no-data-message="myNoDataMessage"></akam-data-table>';
      addElement(markup);
      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toContain(NO_DATA_MESSAGE);
    });
    it('should present a the empty table message when no data is available and filtered', function() {
      scope.baddata = [];
      scope.columns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true"></akam-data-table>';
      addElement(markup);
      scope.$$childHead.state.filter = "Oliver";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toContain('There is no data based upon your criteria');
    });
    it('should present a the empty table message when no data is available and filtered thats provided', function() {
      scope.baddata = [];
      scope.columns = [
        {
          content: "name",
          header: 'Name'
        }
      ];
      var NO_FILTER_RESULTS_MESSAGE = "no filter message message";
      scope.noFilterMessage = NO_FILTER_RESULTS_MESSAGE;
      var markup = '<akam-data-table data="baddata" schema="columns" show-checkboxes="true" no-filter-results-message="no filter message message"></akam-data-table>';
      addElement(markup);
      scope.$$childHead.state.filter = "Oliver";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var dataTableRow = document.querySelector('.empty-table-message');

      expect(dataTableRow.textContent).toContain('There is no data based upon your criteria');
    });
  });
  describe('when changing data input', function() {
    beforeEach(function() {
      scope.mydata = [{'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8},
        {'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8},
        {'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8},
        {'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8},
        {'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8},
        {'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8},
        {'name': "Kevin", 'id': 5}, {'name': "Alejandro", 'id': 8}];
      scope.columns = [{content: 'name', header: 'Name', sort: 'name'}];
    });
    it('should clear filter when data is changed', function() {
      scope.changingdata = scope.mybigdata.slice(0);
      scope.changingcolumns = scope.bigcolumns.slice(0);
      var markup = '<akam-data-table data="changingdata" schema="changingcolumns"></akam-data-table>';
      addElement(markup);

      scope.$$childHead.state.filter = "Oliver";
      scope.$$childHead.updateSearchFilter();
      scope.$digest();

      var allVisibleRows = document.querySelectorAll(TABLE_ROW);
      expect(allVisibleRows.length).toEqual(3);

      scope.changingdata = scope.mydata.slice(0);
      scope.changingcolumns = scope.columns.slice(0);
      scope.$digest();
      expect(scope.$$childHead.state.filter).toEqual('');

      allVisibleRows = document.querySelectorAll(TABLE_ROW);
      expect(allVisibleRows.length).toEqual(10);
    });
    it('should reset to page 1 on data change from no longer existant pagination index', function() {
      scope.changingdata = scope.mybigdata.slice(0);
      scope.changingcolumns = scope.bigcolumns.slice(0);
      var markup = '<akam-data-table data="changingdata" schema="changingcolumns"></akam-data-table>';
      addElement(markup);

      var largestPaginationIndex = document.querySelector(PAGINATION_INDEX_NTH + '(2)');
      utilities.click(largestPaginationIndex);
      scope.$digest();

      scope.changingdata = scope.mydata.slice(0);
      scope.changingcolumns = scope.columns.slice(0);

      var paginationPageOne = document.querySelector(PAGINATION_PAGE_ONE);

      expect(paginationPageOne.classList.contains('active')).toBe(true);
    });
    it('should reset to page 1 on data change from still existant pagination index', function() {
      scope.changingdata = scope.mybigdata.slice(0);
      scope.changingcolumns = scope.bigcolumns.slice(0);
      var markup = '<akam-data-table data="changingdata" schema="changingcolumns"></akam-data-table>';
      addElement(markup);

      var nextArrow = document.querySelector(NEXT_BUTTON);
      utilities.click(nextArrow);
      scope.$digest();

      scope.changingdata = scope.mydata.slice(0);
      scope.changingcolumns = scope.columns.slice(0);
      scope.$digest();

      var paginationPageOne = document.querySelector(PAGINATION_PAGE_ONE);

      expect(paginationPageOne.classList.contains('active')).toBe(true);
    });
    it('should re-sort based on first column', function() {
      scope.changingdata = scope.mybigdata.slice(0);
      scope.changingcolumns = scope.bigcolumns.slice(0);
      var markup = '<akam-data-table data="changingdata" schema="changingcolumns"></akam-data-table>';
      addElement(markup);
      var rowOneColumnTwo = document.querySelectorAll(TABLE_COLUMN_HEADER)[1];
      var rowTwoColumnOne = document.querySelectorAll(TABLE_ROW)[1].querySelectorAll('td')[0];

      utilities.click(rowOneColumnTwo);
      scope.$digest();
      expect(rowOneColumnTwo.classList.contains('asc')).toEqual(true);
      expect(rowTwoColumnOne.textContent).toEqual('Adam Grant');

      scope.changingdata = scope.mydata.slice(0);
      scope.changingcolumns = scope.columns.slice(0);
      scope.$digest();

      var rowOneColumnOne = document.querySelectorAll(TABLE_COLUMN_HEADER)[0];
      rowTwoColumnOne = document.querySelectorAll(TABLE_ROW)[0].querySelectorAll('td')[0];

      expect(rowOneColumnOne.classList.contains('asc')).toEqual(true);
      expect(rowTwoColumnOne.textContent).toEqual('Alejandro');
    });
  });
  describe('when errors are thrown', function() {
    it('should throw error when schema is not an array', function() {
      scope.messedupcolumns = {};
      var markup = '<akam-data-table data="mydata" schema="messedupcolumns"></akam-data-table>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("Schema must be an array");
      }
    });
    it('should throw error when data is not an array', function() {
      scope.messedupdata = {};
      var markup = '<akam-data-table data="messedupdata" schema="columns"></akam-data-table>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("Data must be an array");
      }
    });
    it('should throw error when column content is not a string or function', function() {
      scope.badcontent = [
        {content: {}}
      ];
      var markup = '<akam-data-table data="mydata" schema="badcontent"></akam-data-table>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("The column content field is using an unknown type.  Content field may only be String or Function type");
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
      var markup = '<akam-data-table data="mydata" schema="columns"></akam-data-table>';
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
      var markup = '<akam-data-table data="mydata"></akam-data-table>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("Schema must be an array");
      }
    });
    it('should throw error when data is not provided', function() {
      scope.messedupcolumns = {};
      var markup = '<akam-data-table  schema="columns"></akam-data-table>';
      try {
        addElement(markup);
        timeout.flush();
      } catch (e) {
        expect(e).toEqual("Data must be an array");
      }
    });
  });
});