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
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require("../i18n/i18n_responses/en_US.json");

describe('akam-table', function() {
  var compile, scope, q, timeout, httpBackend, http, log;
  var self = this;
  beforeEach(function() {
    self = this;
    angular.mock.module(require('../../src/table').name);
    angular.mock.module(function($provide, $translateProvider, $sceProvider) {
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($compile, $rootScope, $q, $timeout, $httpBackend, $http, $log) {
      compile = $compile;
      scope = $rootScope.$new();
      q = $q;
      timeout = $timeout;
      httpBackend = $httpBackend;
      http = $http;
      $httpBackend.when('GET', utilities.LIBRARY_PATH).respond(enUsMessagesResponse);
      $httpBackend.when('GET', utilities.CONFIG_PATH).respond(enUsResponse);
      $httpBackend.flush();
      log = $log;
    });
    scope.mydata = [
      {
        fullname: 'Oliver Queen',
        id: 11,
        bu: 'Justice League',
        color: 'Green',
        birthday: new Date(2001, 10, 20),
        generic: ['seriously whats wrong with arrow cave?']
      },
      {
        fullname: 'Roy Harper',
        id: 20,
        bu: 'Teen Titans',
        color: 'Red',
        birthday: new Date(2002, 10, 20),
        generic: ['speedy']
      },
      {
        fullname: 'Dinah Lance',
        id: 35,
        bu: 'Birds of Prey',
        color: 'Black',
        birthday: new Date(2000, 10, 20),
        generic: ['AAAAAAAAAAAAAAAAAAA']
      }
    ];
    scope.columns = {
      fullname: 'Full Name',
      id: 'ID',
      bu: 'Team',
      color: 'Favorite Color',
      birthday: 'Birthday',
      generic: 'Generic Sorting'
    }
    scope.bigData = require('./bigdata/bigdata.json');
    scope.bigDataColumns = {
      row1: "First Name",
      row2: "ID"
    }
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
    beforeEach(function(){
      scope.pdfClicked = jasmine.createSpy('spy');
      var markup = '<akam-table items="mydata" akam-standalone filter-placeholder="placeholder" on-change="changeRows(items)">'+
          '<akam-table-toolbar class="toolbar-class util-pull-right">'+
            '<span>Icons</span>'+
            '<i class="luna-bar_chart"></i>'+
            '<akam-menu-button>'+
              '<akam-menu-button-item text="PDF" ng-click="pdfClicked()">'+
              '</akam-menu-button-item>'+
            '</akam-menu-button>'+
          '</akam-table-toolbar>'+
          '<akam-table-row>'+
          '<akam-table-column class="name" row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="id" row-property="id" header-name="{{columns.id}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="bu" row-property="bu" header-name="{{columns.bu}}">'+
            '<span class="custom-content"> {{row.bu}} </span>'+
          '</akam-table-column>'+
          '<akam-table-column class="color" row-property="color" header-name="{{columns.color}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="birthday" row-property="birthday" header-name="{{columns.birthday}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="generic" row-property="generic" header-name="{{columns.generic}}">'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);
    });
    it('should render data table and pagination', function() {
      var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      var numberOfColumns = document.querySelector('tbody tr').querySelectorAll('td').length;
      var pagination = document.querySelector('div.akam-pagination');

      expect(numberOfColumns).toEqual(6); // # rows plus header row
      expect(numberOfRows).toEqual(3); //# columns + checkbox 
      expect(pagination).not.toBe(null);
    });
    it('should render a filter bar with placeholder', function(){
      var filterbox = document.querySelector('.filter');
      expect(filterbox).not.toBe(null);
      expect(filterbox.textContent).not.toBe('placeholder');
    });
    it('should render toolbar menu', function(){
      var akamToolbar = document.querySelector('akam-table-toolbar');
      var icon = akamToolbar.querySelector('.luna-gear');
      var dropdownMenu = akamToolbar.querySelector('ul.dropdown-menu');
      var dropMenuOption = dropdownMenu.querySelector('li');
      utilities.click(dropMenuOption);
      scope.$digest();
      expect(akamToolbar).not.toBe(null);
      expect(icon).not.toBe(null);
      expect(dropdownMenu).not.toBe(null);
      expect(dropMenuOption.textContent).toContain('PDF')
      expect(scope.pdfClicked).toHaveBeenCalled();
    });
    it('should render data correctly', function(){
      var columnOneHeader = document.querySelector('.name');
      var columnTwoHeader = document.querySelector('.id');
      var columnThreeHeader = document.querySelector('.bu');
      var columnFourHeader = document.querySelector('.color');
      var columnFiveHeader = document.querySelector('.birthday');
      var columnSixHeader = document.querySelector('.generic');

      var rowOneColumnOne = document.querySelectorAll('.name')[1];
      var rowOneColumnTwo = document.querySelectorAll('.id')[1];
      var rowOneColumnThree = document.querySelectorAll('.bu')[1];
      var rowOneColumnFour = document.querySelectorAll('.color')[1];
      var rowOneColumnFive = document.querySelectorAll('.birthday')[1];
      var rowOneColumnSix = document.querySelectorAll('.generic')[1];

      expect(columnOneHeader.textContent).toContain(scope.columns.fullname);
      expect(columnTwoHeader.textContent).toContain(scope.columns.id);
      expect(columnThreeHeader.textContent).toContain(scope.columns.bu);
      expect(columnFourHeader.textContent).toContain(scope.columns.color);
      expect(columnFiveHeader.textContent).toContain(scope.columns.birthday);
      expect(columnSixHeader.textContent).toContain(scope.columns.generic);

      expect(rowOneColumnOne.textContent).toContain(scope.mydata[0].fullname);
      expect(rowOneColumnTwo.textContent).toContain(scope.mydata[0].id);
      expect(rowOneColumnThree.textContent).toContain(scope.mydata[0].bu);
      expect(rowOneColumnFour.textContent).toContain(scope.mydata[0].color);
      expect(rowOneColumnFive.textContent).toContain('2001-11-20'); //Extended Standard String
      expect(rowOneColumnSix.textContent).toContain(scope.mydata[0].generic);
    });
    it('should display total number of results', function(){
      var totalItemsSpan = document.querySelector('.total-items');
      expect(totalItemsSpan.textContent).toContain('3');
    });
    it('should have forward and backward arrows disabled', function(){
      var backArrow = document.querySelector(PREVIOUS_BUTTON);
      var nextArrow = document.querySelector(NEXT_BUTTON);

      expect(backArrow.classList).toContain('disabled');
      expect(nextArrow.classList).toContain('disabled');
    });
  });
  describe('when data is delayed', function(){
    it('should render indeterminate progress while loading (deffered)', function(){
      var def = q.defer();
      scope.delayedData = def.promise;
      timeout(function(){
        def.resolve(scope.mydata);
      }, 2000);
      var markup = '<akam-table items="delayedData" akam-standalone not-filterable on-change="changeRows(items)"'+
           'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
          '<akam-table-row>'+
          '<akam-table-column class="name" row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);

      var indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
      expect(indeterminateProgress).not.toBe(null);
      expect(indeterminateProgress.classList).not.toContain('failed');
      timeout.flush();
      indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
      expect(indeterminateProgress).toBe(null);
    });
    it('should render failure indeterminate progress when failed', function(){
      var def = q.defer();
      scope.delayedData = def.promise;
      timeout(function(){
        def.reject();
      }, 2000);
      var markup = '<akam-table items="delayedData" akam-standalone on-change="changeRows(items)"'+
           'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
          '<akam-table-row>'+
          '<akam-table-column class="name" row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);

      var indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
      expect(indeterminateProgress).not.toBe(null);
      expect(indeterminateProgress.classList).not.toContain('failed');
      timeout.flush();
      indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
      expect(indeterminateProgress).not.toBe(null);
      expect(indeterminateProgress.classList).toContain('failed');
    });
    it('should render indeterminate progress while loading (http)', function(){
      httpBackend.when('GET', '/randomurl').respond(scope.mydata);
      scope.httpData = http.get('/randomurl');
      var markup = '<akam-table items="httpData" akam-standalone on-change="changeRows(items)"'+
           'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
          '<akam-table-row>'+
          '<akam-table-column class="name" row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);

      var indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
      expect(indeterminateProgress).not.toBe(null);
      expect(indeterminateProgress.classList).not.toContain('failed');
      httpBackend.flush();
      indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
      expect(indeterminateProgress).toBe(null);
    });
    it('should render failure indeterminate progress when failed', function(){
      httpBackend.when('GET', '/randomurl').respond(404, "data not found");
      scope.httpData = http.get('/randomurl');
      var markup = '<akam-table items="httpData" akam-standalone on-change="changeRows(items)"'+
           'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
          '<akam-table-row>'+
          '<akam-table-column class="name" row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);

      var indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
      expect(indeterminateProgress).not.toBe(null);
      expect(indeterminateProgress.classList).not.toContain('failed');
      httpBackend.flush();
      indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
      expect(indeterminateProgress).not.toBe(null);
      expect(indeterminateProgress.classList).toContain('failed');
    });
  });
  describe('when rendered with selectedItems', function(){
    beforeEach(function(){
      scope.selectionCallback = jasmine.createSpy('spy');
      scope.selectedItems = [scope.mydata[1]];
      var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)"'+
           'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
          '<akam-table-row>'+
          '<akam-table-column class="name" row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);
    });
    it('should render checkboxes for each row', function() {
      var checkboxes = document.querySelector('tbody').querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toEqual(3);
    });
    it('should have an additional column for checkboxes', function() {
      var numberOfColumns = document.querySelector('tbody tr').querySelectorAll('td').length;
      expect(numberOfColumns).toEqual(2); // # columns plus checkbox
    });
    it('should be able to provide selected items', function() {
      var selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      expect(selectedCheckboxes.length).toEqual(1);
    });
    it('should be able to select items', function() {
      var toSelectCheckbox = document.querySelectorAll('input[type="checkbox"]')[2];
      utilities.click(toSelectCheckbox);
      scope.$digest();
      expect(scope.selectedItems.length).toEqual(2);
      expect(scope.selectionCallback).toHaveBeenCalled();
      expect(scope.selectionCallback.calls.count()).toEqual(1);
    });
    it('should be able to deselect items', function(){
      var toSelectCheckbox = document.querySelectorAll('input[type="checkbox"]')[1];
      utilities.click(toSelectCheckbox);
      scope.$digest();
      expect(scope.selectedItems.length).toEqual(0);
      expect(scope.selectionCallback.calls.count()).toEqual(1);
    });
    it('should be able select all items', function(){
      var toSelectCheckbox = document.querySelectorAll('input[type="checkbox"]')[0];
      utilities.click(toSelectCheckbox);
      scope.$digest();
      expect(scope.selectedItems.length).toEqual(2);
      expect(scope.selectionCallback.calls.count()).toEqual(1);
    });
  });
  describe('when using data table sort option', function() {
    beforeEach(function() {
      var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
          '<akam-table-row>'+
          '<akam-table-column class="name" default-sort row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="id" row-property="id" header-name="{{columns.id}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="generic" row-property="generic" header-name="{{columns.generic}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="color" row-property="color" not-sortable header-name="{{columns.color}}">'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);
    });
    it('should be able to sort default', function(){
      var columnOneHeader = document.querySelector('.name');
      var rowOneColumnOne = document.querySelectorAll('.name')[1];
      var rowThreeColumnOne = document.querySelectorAll('.name')[3];
      expect(rowOneColumnOne.textContent).toContain('Dinah Lance');
      expect(rowThreeColumnOne.textContent).toContain('Roy Harper');
    });
    it('should be able to sort alphabetically', function(){
      var columnOneHeader = document.querySelector('.name');
      utilities.click(columnOneHeader);
      utilities.click(columnOneHeader);
      var rowOneColumnOne = document.querySelectorAll('.name')[1];
      var rowThreeColumnOne = document.querySelectorAll('.name')[3];
      expect(rowOneColumnOne.textContent).toContain('Dinah Lance');
      expect(rowThreeColumnOne.textContent).toContain('Roy Harper');
    });
    it('should be able to sort reverse-alphabetically', function(){
      var columnOneHeader = document.querySelector('.name');
      utilities.click(columnOneHeader);
      var rowOneColumnOne = document.querySelectorAll('.name')[1];
      var rowThreeColumnOne = document.querySelectorAll('.name')[3];
      expect(rowOneColumnOne.textContent).toContain('Roy Harper');
      expect(rowThreeColumnOne.textContent).toContain('Dinah Lance');
    });
    it('should be able to sort numerically', function(){
      var columnTwoHeader = document.querySelector('.id');
      utilities.click(columnTwoHeader);
      var rowOneColumnTwo = document.querySelectorAll('.id')[1];
      var rowThreeColumnTwo = document.querySelectorAll('.id')[3];
      expect(rowOneColumnTwo.textContent).toContain('11');
      expect(rowThreeColumnTwo.textContent).toContain('35');
    });
    it('should be able to sort reverse-numerically', function(){
      var columnTwoHeader = document.querySelector('.id');
      utilities.click(columnTwoHeader);
      utilities.click(columnTwoHeader);
      var rowOneColumnTwo = document.querySelectorAll('.id')[1];
      var rowThreeColumnTwo = document.querySelectorAll('.id')[3];
      expect(rowOneColumnTwo.textContent).toContain('35');
      expect(rowThreeColumnTwo.textContent).toContain('11');
    });
    it('should be able to sort generically', function(){
      var columnThreeHeader = document.querySelector('.generic');
      utilities.click(columnThreeHeader);
      var rowOneColumnThree = document.querySelectorAll('.generic')[1];
      var rowThreeColumnThree = document.querySelectorAll('.generic')[3];
      expect(rowOneColumnThree.textContent).toContain('["AAAAAAAAAAAAAAAAAAA"]');
      expect(rowThreeColumnThree.textContent).toContain('["speedy"]');
    });
    it('should be able to sort reverse-generically', function(){
      var columnThreeHeader = document.querySelector('.generic');
      utilities.click(columnThreeHeader);
      utilities.click(columnThreeHeader);
      var rowOneColumnThree = document.querySelectorAll('.generic')[1];
      var rowThreeColumnThree = document.querySelectorAll('.generic')[3];
      expect(rowOneColumnThree.textContent).toContain('["speedy"]');
      expect(rowThreeColumnThree.textContent).toContain('["AAAAAAAAAAAAAAAAAAA"]');
    });
    it('should not sort columns with not-sortable enabled', function(){
      var columnFourHeader = document.querySelector('.color');
      utilities.click(columnFourHeader);
      utilities.click(columnFourHeader);
      var rowOneColumnFour = document.querySelectorAll('.color')[1];
      var rowThreeColumnFour = document.querySelectorAll('.color')[3];
      expect(rowOneColumnFour.textContent).toContain('Black');
      expect(rowThreeColumnFour.textContent).toContain('Red');
    });
    it('should be able to sort entire row', function(){
      var columnThreeHeader = document.querySelector('.generic');
      utilities.click(columnThreeHeader);
      utilities.click(columnThreeHeader);
      var rowOneColumnOne = document.querySelectorAll('.name')[1];
      var rowTwoColumnOne = document.querySelectorAll('.name')[2];
      var rowThreeColumnOne = document.querySelectorAll('.name')[3];
      expect(rowOneColumnOne.textContent).toContain('Roy Harper');
      expect(rowTwoColumnOne.textContent).toContain('Oliver Queen');
      expect(rowThreeColumnOne.textContent).toContain('Dinah Lance');
    });
  });
  describe('when working with big data', function(){
    beforeEach(function(){
      var markup = '<akam-table items="bigData" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
    });
    it('should start on pagination index 1', function(){
      var paginationOneIndex = document.querySelector(PAGINATION_PAGE_ONE);
      expect(paginationOneIndex.classList).toContain('active');
    });
    it('should render inactive pages', function(){
      var paginationTwoIndex = document.querySelector(PAGE_SIZE_NTH+'(2)');
      expect(paginationTwoIndex.classList).not.toContain('active');
    });
    it('should start on page size 25', function(){
      var pageSize10 = document.querySelector(PAGE_SIZE_SMALLEST);
      var pageSize25 = document.querySelector(PAGE_SIZE_NTH+'(2)');
      var pageSize50 = document.querySelector(PAGE_SIZE_LARGEST);
      expect(pageSize10.classList).toContain('active');
      expect(pageSize25.classList).not.toContain('active');
      expect(pageSize50.classList).not.toContain('active');
    });
    it('should be able to change page size', function(){
      var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      expect(numberOfRows).toEqual(10); 

      var pageSize25 = document.querySelector(PAGE_SIZE_NTH+'(2)');
      utilities.click(pageSize25.querySelector('a'));
      scope.$digest();

      numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      expect(numberOfRows).toEqual(25);
    });
    it('should be able to change page forward and back index (arrow)', function(){
      var rowOneColumnOne = document.querySelectorAll('.name')[1];
      var firstContent = rowOneColumnOne.textContent;
      utilities.click(NEXT_BUTTON+' a');
      scope.$digest();
      rowOneColumnOne = document.querySelectorAll('.name')[1];
      expect(rowOneColumnOne.textContent).not.toEqual(firstContent);
      utilities.click(PREVIOUS_BUTTON+' a');
      scope.$digest();
      rowOneColumnOne = document.querySelectorAll('.name')[1];
      expect(rowOneColumnOne.textContent).toEqual(firstContent);
    });
    it('should be able to change page by clicking on indexes', function(){
      var rowOneColumnOne = document.querySelectorAll('.name')[1];
      var firstContent = rowOneColumnOne.textContent;
      utilities.click(document.querySelector(PAGINATION_INDEX_NTH+'(3) a'));
      scope.$digest();
      rowOneColumnOne = document.querySelectorAll('.name')[1];
      expect(rowOneColumnOne.textContent).not.toEqual(firstContent);
      utilities.click(PAGINATION_PAGE_ONE+' a');
      scope.$digest();
      rowOneColumnOne = document.querySelectorAll('.name')[1];
      expect(rowOneColumnOne.textContent).toEqual(firstContent);
    });
  });
  describe('when interacting with filter bar', function(){
    beforeEach(function(){
      scope.onRowsChange = jasmine.createSpy('spy');
      var markup = '<akam-table no-filter-results-message="no filter results" items="mydata" '+
          'akam-standalone on-change="onRowsChange(items)"'+
           'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
          '<akam-table-row>'+
          '<akam-table-column class="name" row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="name" not-filterable row-property="bu" header-name="{{columns.bu}}">'+
          '</akam-table-column>'+
          '<akam-table-column class="name" not-filterable row-property="color" header-name="{{columns.color}}">'+
            '<span class="custom-content">{{row.color}}</span>'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);
    });
    it('should filter based upon input', function(){
      var tableController = self.el.isolateScope().table;
      tableController.state.filter = 'Oliver';
      tableController.filterRows();
      scope.$digest();
      var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      expect(numberOfRows).toEqual(1);
      expect(scope.onRowsChange).toHaveBeenCalled();
    });
    it('should not filter on no filter columns', function(){
      var tableController = self.el.isolateScope().table;
      tableController.state.filter = 'Justice';
      tableController.filterRows();
      scope.$digest();
      var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      expect(numberOfRows).toEqual(0); 
    });
    it('should be able to clear filter', function(){
      var tableController = self.el.isolateScope().table;
      tableController.state.filter = 'Justice';
      tableController.filterRows();
      scope.$digest();
      var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      expect(numberOfRows).toEqual(0); 
      utilities.click('.clear-filter');
      scope.$digest();
      numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      expect(numberOfRows).toEqual(3); 
    });
    it('should not match custom markup', function(){
      var tableController = self.el.isolateScope().table;
      tableController.state.filter = 'Green';
      tableController.filterRows();
      scope.$digest();
      var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      expect(numberOfRows).toEqual(0); 
    });
    it('should display message if no filter results', function(){
      var tableController = self.el.isolateScope().table;
      tableController.state.filter = 'Green';
      tableController.filterRows();
      scope.$digest();
      var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      var emptyMessage = document.querySelector('.empty-table-message');
      expect(emptyMessage.textContent).toContain('no filter results');
      expect(numberOfRows).toEqual(0); 
    });
  });
  describe('when filtering large data', function(){
    beforeEach(function(){
      var markup = '<akam-table items="bigData" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
    });
    it('should filter based upon input', function(){
      utilities.click(NEXT_BUTTON+' a');
      scope.$digest();
      var tableController = self.el.isolateScope().table;
      tableController.state.filter = 'a';
      tableController.filterRows();
      scope.$digest();
      var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
      var paginationOne = document.querySelector(PAGINATION_PAGE_ONE);
      expect(numberOfRows).toEqual(10);
      expect(paginationOne.classList).toContain('active');
    });
  });
  describe('when giving menu buttons', function(){
    beforeEach(function(){
      scope.pdfClicked = jasmine.createSpy('spy');
      var markup = '<akam-table items="bigData" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
            '</akam-table-column>'+
            '<akam-table-column not-filterable not-sortable class="column-action" header-name="examples.actions">'+
              '<akam-menu-button>'+
                '<akam-menu-button-item text="PDF" ng-click="pdfClicked(row)"></akam-menu-button-item>'+
              '</akam-menu-button>'+
          '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
    });
    it('should render with an icon', function(){
      var icon = document.querySelectorAll('.column-action')[1].querySelector('.akam-menu-button i');
      expect(icon).not.toBe(null);
    });
    it('should be able to trigger icon event', function(){
      var icon = document.querySelectorAll('.column-action')[1].querySelector('.akam-menu-button ul li');
      utilities.click(icon);
      expect(scope.pdfClicked).toHaveBeenCalled();
    });
  });
  describe('when no data is given', function(){
    beforeEach(function(){
      scope.nodata = [];
      scope.noDataMessage = "no data available"
      var markup = '<akam-table items="nodata" akam-standalone on-change="changeRows(items)" no-data-message="noDataMessage">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
    });
    it('should display and empty message', function(){
      var emptyMessage = document.querySelector('.empty-table-message');
      expect(emptyMessage.textContent).toContain(scope.noDataMessage);
    });
    it('should be able to change empty message', function(){
      var emptyMessage = document.querySelector('.empty-table-message');
      expect(emptyMessage.textContent).toContain("no data available");
      scope.noDataMessage = "new message";
      scope.$digest();
      expect(emptyMessage.textContent).toContain("new message");
    });
  });
  describe('when no columns are filterable', function(){
    beforeEach(function(){
      var markup = '<akam-table items="mydata" akam-standalone not-filterable on-change="changeRows(items)">'+
          '<akam-table-toolbar class="toolbar-class util-pull-right">'+
            '<span>Icons</span>'+
            '<i class="luna-bar_chart"></i>'+
            '<akam-menu-button>'+
              '<akam-menu-button-item text="PDF" ng-click="pdfClicked()">'+
              '</akam-menu-button-item>'+
            '</akam-menu-button>'+
            '</akam-table-toolbar>'+
            '<akam-table-row>'+
            '<akam-table-column class="name" not-filterable row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>';
        addElement(markup);
    });
    it('should not display a filter box', function(){
      var filterbox = document.querySelector(FILTER_BOX);
      expect(filterbox).toBe(null);
    });
  });
  describe('when no pagination is requested', function(){
    beforeEach(function(){
      var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)" no-paging>'+
            '<akam-table-row>'+
            '<akam-table-column class="name" not-filterable row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>';
        addElement(markup);
    });
    it('should not display pagination', function(){
      var pagination = document.querySelector('.akam-pagination');
      expect(pagination).toBe(null);
    });
  });
  describe('when no sorting is requested', function(){
    beforeEach(function(){
      var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)" not-sortable>'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>';
        addElement(markup);
    });
    it('should not sort by any column', function(){
      var columnOneHeader = document.querySelector('.name');
      utilities.click(columnOneHeader);
      var rowOneColumnOne = document.querySelectorAll('.name')[1];
      var rowThreeColumnOne = document.querySelectorAll('.name')[3];
      expect(rowOneColumnOne.textContent).toContain('Oliver Queen');
      expect(rowThreeColumnOne.textContent).toContain('Dinah Lance');
    });
  });
  describe('when reaching error cases', function(){
    it('should not show data when it doesnt have a string format', function(){
      scope.brokenData = [{id:{}},{id:{}},{id:{}}];
      var markup = '<akam-table items="brokenData" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="id" row-property="id" header-name="{{columns.id}}">'+
          '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>';
      addElement(markup);
      var totalItemsSpan = document.querySelector(TOTAL_ITEMS_SPAN);
      expect(totalItemsSpan.textContent).toContain('0');
    });
    it('should not sort default sort if no sort is requested', function(){
      var spy = spyOn(log, "debug");
      var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)" not-sortable>'+
            '<akam-table-row>'+
            '<akam-table-column class="name" default-sort row-property="fullname" header-name="{{columns.fullname}}">'+
          '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>';
      addElement(markup);
      expect(spy).toHaveBeenCalled();   
    });
    it('should not render anything and warn if columns not provided', function(){
      var spy = spyOn(log, "warn");
      var markup = '<akam-table items="mydata" not-sortable akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-fake-name></akam-fake-name>'+
          '</akam-table-row>'+
        '</akam-table>';
      addElement(markup);
      expect(spy).toHaveBeenCalled();   
    });
    it('should warn user if no akam-table-row provided', function(){
      var spy = spyOn(log, "debug");
      var markup = '<akam-table items="mydata" not-sortable akam-standalone on-change="changeRows(items)">'+
        '</akam-table>';
      addElement(markup);
      expect(spy).toHaveBeenCalled();   
    });
    it('should warn user if no columns provided', function(){
      var spy = spyOn(log, "warn");
      var markup = '<akam-table items="mydata" not-sortable akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
          '</akam-table-row>'+
        '</akam-table>';
      addElement(markup);
      expect(spy).toHaveBeenCalled();   
    });
    it('should not render anything and log error no row property given', function(){
      var spy = spyOn(log, "debug");
      var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" header-name="{{columns.fullname}}">'+
            '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>';
      addElement(markup);
      expect(spy).toHaveBeenCalled();   
    });
  });
});