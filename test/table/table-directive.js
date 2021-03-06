'use strict';
var utilities = require('../utilities');
var FILTER_BOX = 'span.filter input[type="search"]';
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
var PAGINATION_INDEXES = 'div.akam-pagination .pagination li';
var PAGINATION_PAGE_ONE = 'div.akam-pagination .pagination li:nth-child(2)';
var PAGINATION_INDEX_NTH = 'div.akam-pagination .pagination li:nth-child';
var PAGINATION_INDEX_REVERSE = 'div.akam-pagination .pagination li:nth-last-child';
var PAGE_SIZE_SMALLEST = 'div.akam-pagination .page-size li:first-child';
var PAGE_SIZE_LARGEST = 'div.akam-pagination .page-size li:last-child';
var PAGE_SIZE_NTH = 'div.akam-pagination .page-size li:nth-child';
var PAGE_SIZES = 'div.akam-pagination .page-size li';

var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require("../i18n/i18n_responses/en_US.json");
var translationMock = angular.merge({}, enUsResponse, enUsMessagesResponse);

describe('akam-table', function() {
  var compile, scope, q, timeout, httpBackend, http, log;
  var self = this;
  beforeEach(function() {
    self = this;
    angular.mock.module(require('../../src/table').name);
    angular.mock.module(function($translateProvider) {
      $translateProvider.translations('en_US', translationMock);
      $translateProvider.useLoader('translateNoopLoader');
    });
    inject(function($compile, $rootScope, $q, $timeout, $httpBackend, $http, $log) {
      compile = $compile;
      scope = $rootScope.$new();
      q = $q;
      timeout = $timeout;
      httpBackend = $httpBackend;
      http = $http;
      log = $log;
    });
    scope.mydata = [
      {
        first_name: 'Oliver Queen',
        id: 11,
        bu: 'Justice League',
        color: 'Green',
        birthday: new Date(2001, 10, 20),
        generic: ['seriously whats wrong with arrow cave?']
      },
      {
        first_name: 'Roy Harper',
        id: 20,
        bu: 'Teen Titans',
        color: 'Red',
        birthday: new Date(2002, 10, 20),
        generic: ['speedy']
      },
      {
        first_name: 'Dinah Lance',
        id: 35,
        bu: 'Birds of Prey',
        color: 'Black',
        birthday: new Date(2000, 10, 20),
        generic: ['AAAAAAAAAAAAAAAAAAA']
      }
    ];
    scope.columns = {
      first_name: 'Full Name',
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
  describe('given an array bound to the items attribute', function(){
  	describe('when a table is rendered', function(){
  		beforeEach(function(){
	      scope.pdfClicked = jasmine.createSpy('spy');
	      var markup = '<akam-table items="mydata" akam-standalone filter-placeholder="placeholder" on-change="changeRows(items)">'+
	          '<akam-table-row>'+
	          '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
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
  		it('should display rows chunked by page size', function(){
				var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
	      expect(numberOfRows).toEqual(3); //# columns + checkbox
  		});
      it('should dislay headers for each akam-row-column', function(){
        var numberOfColumns = document.querySelector('tbody tr').querySelectorAll('td').length;
        expect(numberOfColumns).toEqual(6); // # rows plus header row
      });
      it('should display a page count equal to the aray size divided by page size', function(){
        var paginationIndexes = document.querySelectorAll(PAGINATION_INDEXES);
        expect(paginationIndexes.length).toEqual(3);
      });
  	});
  });
  describe('given a promise bound to the items attribute', function(){
    describe('when a table is rendered', function(){
      beforeEach(function(){
        var def = q.defer();
        scope.delayedData = def.promise;
        timeout(function(){
          def.resolve(scope.mydata);
        }, 2000);
        var markup = '<akam-table items="delayedData" akam-standalone not-filterable on-change="changeRows(items)"'+
             'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should display an indeterminate progress indicator', function(){
        var indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
        expect(indeterminateProgress).not.toBe(null);
        expect(indeterminateProgress.classList).not.toContain('failed');
        timeout.flush();
        indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
        expect(indeterminateProgress).toBe(null);
      });
    });
  });
  describe('given a promise bound to the items attribute', function(){
    describe('when a table is rendered', function(){
      describe('and the promise resolved successfully', function(){
        beforeEach(function(){
          var def = q.defer();
          scope.delayedData = def.promise;
          timeout(function(){
            def.resolve(scope.mydata);
          }, 2000);
          var markup = '<akam-table items="delayedData" akam-standalone not-filterable on-change="changeRows(items)"'+
               'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>'
          addElement(markup);
          timeout.flush();
        });
        it('should remove the indeterminate progress indicator', function(){
          var indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
          expect(indeterminateProgress).toBe(null);
        });
      });
    });
  });
  describe('given a promise bound to the items attribute', function(){
    describe('when the promise fails', function(){
      beforeEach(function(){
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
      });
      it('should display failed indeterminate progress', function(){
        httpBackend.flush();
        var indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
        expect(indeterminateProgress.classList).toContain('failed');
      });
    });
  });
  describe('given a promise bound to the items attribute', function(){
    describe('when the promise fails', function(){
      describe('and a new promise is given', function(){
        beforeEach(function(){
          httpBackend.when('GET', '/randomurl').respond(404, "data not found");
          httpBackend.when('GET', '/successurl').respond(scope.mydata);
          scope.httpData = http.get('/randomurl');
          var markup = '<akam-table items="httpData" akam-standalone on-change="changeRows(items)"'+
               'on-select="selectionCallback(selectedItems)" selected-items="selectedItems">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>'
          addElement(markup);
          httpBackend.flush();
          scope.httpData = http.get('/successurl');
        });
        it('should re show the indeterminate progress indicator', function(){
          var indeterminateProgress = document.querySelector('.indeterminate-progress-wrapper');
          expect(indeterminateProgress.classList).toContain('failed');
        });
      });
    });
  });
  describe('given a rendered table', function(){
    describe('when a value is rebound to the items attribute', function(){
      beforeEach(function(){
        scope.changingData = scope.bigData;
        var markup = '<akam-table items="changingData" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" default-sort row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
        utilities.click(NEXT_BUTTON);
        scope.$digest();
        var tableController = self.el.isolateScope().table;
        tableController.state.filter = 'Oliver';
        tableController.filterRows();
        scope.$digest();
        var columnTwoHeader = document.querySelector('.id');
        utilities.click(columnTwoHeader);
        scope.changingData = scope.mydata
        scope.$digest();
      });
      it('should reset the pagination state', function(){
        var paginationOneIndex = document.querySelector(PAGINATION_PAGE_ONE);
        expect(paginationOneIndex.classList).toContain('active');
      });
      it('should reset filter box state', function(){
        var tableController = self.el.isolateScope().table;
        expect(tableController.state.filter).toEqual('');
      });
      it('should reset sort state to default', function(){
        var columnTwoHeader = document.querySelector('.id');
        expect(columnTwoHeader.classList).not.toContain('asc');
      });
    });
  });
  describe('given a not-pageable attribute', function(){
    describe('when a table is rendered', function(){
      beforeEach(function(){
        scope.pdfClicked = jasmine.createSpy('spy');
        var markup = '<akam-table items="mydata" akam-standalone not-pageable filter-placeholder="placeholder" on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
            '</akam-table-column>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should not display pagination', function(){
        var pagination = document.querySelector('div.akam-pagination');
        expect(pagination).toBe(null);
      });
    });
  });
  describe('given custom markup for a column', function(){
    describe('when the table is rendered', function(){
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
      it("should compile the custom markup with the table's parent scope", function(){
        var icon = document.querySelectorAll('.column-action')[1].querySelector('.akam-menu-button ul li');
        utilities.click(icon);
        expect(scope.pdfClicked).toHaveBeenCalled();
      });
      it('should render the custom markup', function(){
        var icon = document.querySelectorAll('.column-action')[1].querySelector('.akam-menu-button i');
        expect(icon).not.toBe(null);
      });
    });
  });
  describe('given a text-property attribtue for a column', function(){
    describe('when the table is rendered', function(){
      beforeEach(function(){
        scope.pdfClicked = jasmine.createSpy('spy');
        var markup = '<akam-table items="mydata" akam-standalone filter-placeholder="placeholder" on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
            '</akam-table-column>'+
        '</akam-table>'
        addElement(markup);
      });
      it("should display text-property's value", function(){
        var rowOneColumnOne = document.querySelectorAll('.name')[1];
        expect(rowOneColumnOne.textContent).toContain('Oliver Queen');
      });
    });
  });
  describe('given a header name atribute for a column', function(){
    describe('and the value is a valid locale key', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          scope.pdfClicked = jasmine.createSpy('spy');
          var markup = '<akam-table items="mydata" akam-standalone filter-placeholder="placeholder" on-change="changeRows(items)">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="table.full-name">'+
              '</akam-table-column>'+
          '</akam-table>'
          addElement(markup);
        });
        it('should display the translated header-name', function(){
          var columnOneHeader = document.querySelector('.name');
          expect(columnOneHeader.textContent).toContain('Full Name');
        });
      });
    });
  });
  describe('given a header name attribute for a column', function(){
    describe('when the table is rendered', function(){
      beforeEach(function(){
        scope.pdfClicked = jasmine.createSpy('spy');
        var markup = '<akam-table items="mydata" akam-standalone filter-placeholder="placeholder" on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
            '</akam-table-column>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should display the attributes value', function(){
        var columnOneHeader = document.querySelector('.name');
        expect(columnOneHeader.textContent).toContain(scope.columns.first_name);
      });
    });
  });
  describe('given a not not-sortable attribute for a column', function(){
    describe('when the table is rendered', function(){
      beforeEach(function(){
        var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
          '<akam-table-row>'+
          '<akam-table-column class="color" row-property="color" not-sortable header-name="{{columns.color}}">'+
          '</akam-table-column>'+
        '</akam-table-row>'+
      '</akam-table>'
      addElement(markup);
      });
      it('should not display the sort icon on hover for the column',function(){
        var columnHeader = document.querySelector('.color')
        utilities.mouseHover(columnHeader);
        var icon = columnHeader.querySelector('i');
        expect(icon.classList).not.toContain('luna-arrow-up')
      });
      it('should not respond to a click event for the column',function(){
        var columnOneHeader = document.querySelector('.color');
        utilities.click(columnOneHeader);
        var rowOneColumnFour = document.querySelectorAll('.color')[1];
        var rowThreeColumnFour = document.querySelectorAll('.color')[3];
        expect(rowOneColumnFour.textContent).toContain('Green');
        expect(rowThreeColumnFour.textContent).toContain('Black');
      });
    });
    describe('given a declared not sortable attribute for a table', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          var markup = '<akam-table items="mydata" akam-standalone not-sortable on-change="changeRows(items)">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
                '</akam-table-column>'+
              '<akam-table-column class="color" row-property="color"  header-name="{{columns.color}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>'
          addElement(markup);
        });
        it('should not display the sort icon on hover for all columns', function(){
          var columnOneHeader = document.querySelector('.name');
          var columnTwoHeader = document.querySelector('.color');
          utilities.mouseHover(columnOneHeader);
          var icon = columnOneHeader.querySelector('i');
          expect(icon.classList).not.toContain('luna-arrow-up');
          utilities.mouseHover(columnTwoHeader);
          var icon = columnTwoHeader.querySelector('i');
          expect(icon.classList).not.toContain('luna-arrow-up')
        });
        it('should not respond to a click event for all columns', function(){
          var columnOneHeader = document.querySelector('.name');
          utilities.click(columnOneHeader);
          var rowOneColumnFour = document.querySelectorAll('.color')[1];
          var rowThreeColumnFour = document.querySelectorAll('.color')[3];
          expect(rowOneColumnFour.textContent).toContain('Green');
          expect(rowThreeColumnFour.textContent).toContain('Black');
          var columnTwoHeader = document.querySelector('.color');
          utilities.click(columnTwoHeader);
          expect(rowOneColumnFour.textContent).toContain('Green');
          expect(rowThreeColumnFour.textContent).toContain('Black');
        });
      });
    });
    describe('given a rendered table', function(){
      describe('when a sortable column is clicked', function(){
        beforeEach(function(){
          var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
                '</akam-table-column>'+
              '<akam-table-column class="color" row-property="color"  header-name="{{columns.color}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>'
          addElement(markup);
        });
        it('should display the ascending sort icon for the column', function(){
          var columnOneHeader = document.querySelector('.name');
          utilities.click(columnOneHeader);
          scope.$digest();
          expect(columnOneHeader.classList).toContain('asc');
        });
        it('should sort column data in ascending order by the text-property', function(){
          var columnOneHeader = document.querySelector('.name');
          utilities.click(columnOneHeader);
          scope.$digest();
          var rowOneColumnFour = document.querySelectorAll('.name')[1];
          var rowThreeColumnFour = document.querySelectorAll('.name')[3];
          expect(rowOneColumnFour.textContent).toContain('Dinah Lance');
          expect(rowThreeColumnFour.textContent).toContain('Roy Harper');
        });
      });
    });
  });
  describe('given a rendered table', function(){
    describe('when a sortable column is clicked', function(){
      beforeEach(function(){
        var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{columns.first_name}}">'+
              '</akam-table-column>'+
            '<akam-table-column class="color" row-property="color"  header-name="{{columns.color}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should display the reverse sort icon for the column', function(){
        var columnOneHeader = document.querySelector('.name');
        utilities.click(columnOneHeader);
        utilities.click(columnOneHeader);
        expect(columnOneHeader.classList).toContain('desc');
      });
      it('should sort column data in reverse order by the text-property', function(){
        var columnOneHeader = document.querySelector('.name');
        utilities.click(columnOneHeader);
        utilities.click(columnOneHeader)
        var rowOneColumnFour = document.querySelectorAll('.name')[1];
        var rowThreeColumnFour = document.querySelectorAll('.name')[3];
        expect(rowOneColumnFour.textContent).toContain('Roy Harper');
        expect(rowThreeColumnFour.textContent).toContain('Dinah Lance');
      });
    });
  });
  describe('given a rendered table', function(){
    describe('when a descending sorted column is clicked', function(){
      beforeEach(function() {
        var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" default-sort row-property="first_name" header-name="{{columns.first_name}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="id" row-property="id" header-name="{{columns.id}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="generic" row-property="generic" header-name="{{columns.generic}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="color" row-property="color"  header-name="{{columns.color}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
        var columnOneHeader = document.querySelector('.name');
        utilities.click(columnOneHeader);
        utilities.click(columnOneHeader);
      });
      it('should display the ascending sort icon for the column', function(){
        var columnOneHeader = document.querySelector('.name');
        expect(columnOneHeader.classList).toContain('asc');
      });
      it('should sort column data in ascending order by the text-property', function(){
        var columnOneHeader = document.querySelector('.name');
        var rowOneColumnOne = document.querySelectorAll('.name')[1];
        var rowThreeColumnOne = document.querySelectorAll('.name')[3];
        expect(rowOneColumnOne.textContent).toContain('Dinah Lance');
        expect(rowThreeColumnOne.textContent).toContain('Roy Harper');
      });
    });
  });
  describe('given a default-sort attribtute for a column', function(){
    describe('when the table is rendered', function(){
      beforeEach(function() {
        var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" default-sort row-property="first_name" header-name="{{columns.first_name}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="id" row-property="id" header-name="{{columns.id}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="generic" row-property="generic" header-name="{{columns.generic}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="color" row-property="color"  header-name="{{columns.color}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should display the ascending sort icon for the column', function(){
        var columnOneHeader = document.querySelector('.name');
        expect(columnOneHeader.classList).toContain('asc');
      });
      it('should sort column data in ascending order by the text-property', function(){
        var columnOneHeader = document.querySelector('.name');
        var rowOneColumnOne = document.querySelectorAll('.name')[1];
        var rowThreeColumnOne = document.querySelectorAll('.name')[3];
        expect(rowOneColumnOne.textContent).toContain('Dinah Lance');
        expect(rowThreeColumnOne.textContent).toContain('Roy Harper');
      });
    });
  });
  describe('given a default-sort attribute on a column', function(){
    describe('and a not-sortable attribute on the table', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          var spy = spyOn(log, "debug");
          var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)" not-sortable>'+
                '<akam-table-row>'+
                '<akam-table-column class="name" default-sort row-property="first_name" header-name="{{columns.first_name}}">'+
              '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>';
          addElement(markup);
        });
        it('should alert the user to the mistake', function(){
          expect(log.debug).toHaveBeenCalled();
        });
        it('should not sort by that column', function(){
          var rowOneColumnOne = document.querySelectorAll('.name')[1];
          var rowThreeColumnOne = document.querySelectorAll('.name')[3];
          expect(rowOneColumnOne.textContent).toContain('Oliver Queen');
          expect(rowThreeColumnOne.textContent).toContain('Dinah Lance');
        });
      });
    });
  });
  describe('given a rendered table', function(){
    describe('when input is provided in the filter box', function(){
      beforeEach(function(){
        var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
        var tableController = self.el.isolateScope().table;
        tableController.state.filter = 'Oliver';
        tableController.filterRows();
        scope.$digest();
      });
      it('should display rows where input matches any column text', function(){
        var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
        expect(numberOfRows).toEqual(1);
      });
    });
  });
  describe('given a not-filterable attrbute for a column', function(){
    describe('and a rendered table', function(){
      describe('when input is provided in the filter box', function(){
        beforeEach(function(){
          var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" not-filterable header-name="{{bigDataColumns.row1}}">'+
              '</akam-table-column>'+
              '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>'
          addElement(markup);
          var tableController = self.el.isolateScope().table;
          tableController.state.filter = 'Oliver';
          tableController.filterRows();
          scope.$digest();
        });
        it('should not display rows where input matches column text', function(){
          var numberOfRows = document.querySelector('tbody').querySelectorAll('tr').length;
          expect(numberOfRows).toEqual(0);
        });
      });
    });
  });
  describe('given a not-filterable attribute for a table', function(){
    describe('when the table is rendered', function(){
      beforeEach(function(){
        var markup = '<akam-table items="mydata" akam-standalone not-filterable on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
            '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should not display the filter box', function(){
        var filterbox = document.querySelector('.filter input');
        expect(filterbox).toBe(null);
      });
    });
  });
  describe('given an undeclared selected-items attribute', function(){
    describe('when the table is rendered', function(){
      beforeEach(function(){
        var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should not display the checkbox column', function(){
        var columnHeaders = document.querySelector('thead').querySelectorAll('th');
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        expect(columnHeaders.length).toEqual(1);
        expect(checkboxes.length).toEqual(0);
      });
    });
  });
  describe('given an array bound to the selected-items attribute', function(){
    describe('when a table is rendered', function(){
      beforeEach(function(){
        scope.selectedItems = [scope.mydata[1]];
         var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)" selected-items="selectedItems">'+
            '<akam-table-row>'+
            '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
            '</akam-table-column>'+
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should display a checkbox column', function(){
        var columnHeaders = document.querySelector('thead').querySelectorAll('th');
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        expect(columnHeaders.length).toEqual(2);
        expect(checkboxes.length).not.toEqual(0);
      });
      it('should check row items contained in the bound array', function(){
        var checkedCheckboxes = document.querySelectorAll(ALL_CHECKED_CHECKBOXES);
        expect(checkedCheckboxes.length).toEqual(1);
      });
    });
  });
  describe('given an array bound to the selected-items attribute', function(){
    describe('and a callback bound to the on-selected attribute', function(){
      describe('and a rendered table', function(){
        describe('when a row checkbox is checked', function(){
          beforeEach(function(){
            scope.selectedItems = [scope.mydata[1]];
            scope.onSelect = jasmine.createSpy('spy');
             var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)" selected-items="selectedItems" '+
                'on-select="onSelect(selectedItems)">'+
                '<akam-table-row>'+
                '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
                '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>'
            addElement(markup);
            utilities.click(document.querySelectorAll('input[type="checkbox"]')[0]);
            scope.$digest();
          });
          it('should append the row item to the bound array', function(){
            expect(scope.selectedItems.length).toEqual(2);
          });
          it('should invoke the callback with the bound array as an argument', function(){
            expect(scope.onSelect).toHaveBeenCalledWith(scope.selectedItems);
          });
        });
      });
    });
  });
  describe('given an array bound to the selected-items attribute', function(){
    describe('and a callback bound to the on-select attribute', function(){
      describe('and a arendred table with a chekced row', function(){
        describe('when a row checkbox is unchecked', function(){
          beforeEach(function(){
            scope.selectedItems = [scope.mydata[1]];
            scope.onSelect = jasmine.createSpy('spy');
             var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)" selected-items="selectedItems" '+
                'on-select="onSelect(selectedItems)">'+
                '<akam-table-row>'+
                '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
                '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>'
            addElement(markup);
            utilities.click(document.querySelectorAll('input[type="checkbox"]')[1]);
            scope.$digest();
          });
          it('should remove the row item from the bound array', function(){
            expect(scope.selectedItems.length).toEqual(0);
          });
          it('should invoke the callback with the bound array as an argument', function(){
            expect(scope.onSelect).toHaveBeenCalledWith(scope.selectedItems);
          });
        });
      });
    });
  });
  describe('given no custom markup for the toolbar', function(){
    describe('and a not-filterable attribute for the table', function(){
      describe('when a table is rendered', function(){
        beforeEach(function(){
           var markup = '<akam-table items="mydata" akam-standalone not-filterable on-change="changeRows(items)">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>'
          addElement(markup);
          scope.$digest();
        });
        it('should not display the toolbar container', function(){
          var toolbar = document.querySelector('.toolbar');
          expect(toolbar).toBe(null);
        });
      });
    });
  });
  describe('given custom markup for the toolbar', function(){
    describe('when a table is rendered', function(){
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
          '</akam-table-row>'+
        '</akam-table>'
        addElement(markup);
      });
      it('should compile the custom markup with the tables parent scope', function(){
        var akamToolbar = document.querySelector('akam-table-toolbar');
        var dropdownMenu = akamToolbar.querySelector('ul.dropdown-menu');
        var dropMenuOption = dropdownMenu.querySelector('li');
        utilities.click(dropMenuOption);
        scope.$digest();
        expect(scope.pdfClicked).toHaveBeenCalled();
      });
      it('should render the custom markup within the toolbar container', function(){
        var akamToolbar = document.querySelector('akam-table-toolbar');
        var icon = akamToolbar.querySelector('.luna-bar_chart');
        var dropdownMenu = akamToolbar.querySelector('ul.dropdown-menu');
        var dropMenuOption = dropdownMenu.querySelector('li');
        expect(akamToolbar).not.toBe(null);
        expect(icon).not.toBe(null);
        expect(dropdownMenu).not.toBe(null);
        expect(dropMenuOption.textContent).toContain('PDF');
      });
    });
  });
  describe('given custom markup for the toolbar', function(){
    describe('and a not-filterable attribute on the table', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          var markup = '<akam-table items="mydata" akam-standalone filter-placeholder="placeholder"'+
              ' not-filterable on-change="changeRows(items)">'+
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
              '</akam-table-row>'+
            '</akam-table>'
            addElement(markup);
        });
        it('should remove only the filterbox', function(){
          var filterbox = document.querySelector(FILTER_BOX);
          var akamToolbar = document.querySelector('akam-table-toolbar');
          expect(filterbox).toBe(null);
          expect(akamToolbar).not.toBe(null);
        });
      });
    });
  });
  describe('given an akam-table-row element is provided', function(){
    describe('and no akam-table-column is proivded', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          spyOn(log, "warn");
          var markup = '<akam-table items="mydata" not-sortable akam-standalone on-change="changeRows(items)">'+
                '<akam-table-row>'+
                '<akam-fake-name></akam-fake-name>'+
              '</akam-table-row>'+
            '</akam-table>';
          addElement(markup);
        });
        it('should warn the developer of the mistake', function(){
          expect(log.warn).toHaveBeenCalled();
        });
      });
    });
  });
  describe('given an akam-table element', function(){
    describe('and no akam-table-row element is provided', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          spyOn(log, "debug");
          var markup = '<akam-table items="mydata" not-sortable akam-standalone on-change="changeRows(items)">'+
            '</akam-table>';
          addElement(markup);
        });
        it('should alert the developer of the mistake with a logged debug', function(){
          expect(log.debug).toHaveBeenCalled();
        });
      });
    });
  });
  describe('given an array bound to the items attribute', function(){
    describe('and no row-property attribute for an akam-table-colun', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          spyOn(log, "debug");
          var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
                '<akam-table-row>'+
                '<akam-table-column class="name" header-name="{{columns.fullname}}">'+
                '</akam-table-column>'+
                '</akam-table-row>'+
              '</akam-table>';
          addElement(markup);
        });
        it('should not render any value for that column', function(){
          var text = document.querySelectorAll('.name')[1].textContent;
          expect(text).toEqual('');
        });
        it('should alert the developer of the mistake with a logged debug', function(){
          expect(log.debug).toHaveBeenCalled();
        });
      });
    });
  });
  describe('given a text-property attribute for a column', function(){
    describe('and the text-property value does not have a string format', function(){
      describe('when the table is rendered', function(){
        beforeEach(function(){
          scope.brokenData = [{id:{}},{id:{}},{id:{}}];
          var markup = '<akam-table items="brokenData" akam-standalone on-change="changeRows(items)">'+
                '<akam-table-row>'+
                '<akam-table-column class="id" row-property="id" header-name="{{columns.id}}">'+
              '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>';
          addElement(markup);
        });
        it('should not display the rows', function(){
          var totalItemsSpan = document.querySelector(TOTAL_ITEMS_SPAN);
          expect(totalItemsSpan.textContent).toContain('0');
        });
      })
    });
  });
  describe('given a rendered table', function(){
    describe('and table has pagination', function(){
      describe('when the next arrow is clicked', function(){
        beforeEach(function(){
          scope.changeRows = jasmine.createSpy('spy');
          var markup = '<akam-table items="bigData" akam-standalone on-change="changeRows(items)">'+
                '<akam-table-row>'+
                '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
                '</akam-table-column>'+
                '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
                '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>';
            addElement(markup);
        });
        it('should display the next page of data', function(){
          var rowOneColumnOne = document.querySelectorAll('.name')[1];
          var firstContent = rowOneColumnOne.textContent;
          utilities.click(NEXT_BUTTON+' a');
          scope.$digest();
          rowOneColumnOne = document.querySelectorAll('.name')[1];
          expect(rowOneColumnOne.textContent).not.toEqual(firstContent);
        });
        it('should trigger on-change callback', function(){
          expect(scope.changeRows).toHaveBeenCalled();
        });
      })
    });
  });
  describe('given a rendered table', function(){
    describe('and table has pagination', function(){
      describe('when the previous arrow is clicked', function(){
        var firstContent;
        beforeEach(function(){
          scope.changeRows = jasmine.createSpy('spy');
          var markup = '<akam-table items="bigData" akam-standalone on-change="changeRows(items)">'+
                '<akam-table-row>'+
                '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
                '</akam-table-column>'+
                '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
                '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>';
            addElement(markup);
            var rowOneColumnOne = document.querySelectorAll('.name')[1];
            firstContent = rowOneColumnOne.textContent;
            utilities.click(NEXT_BUTTON+' a');
            scope.$digest();
        });
        it('should display the previous page of data', function(){
          var rowOneColumnOne = document.querySelectorAll('.name')[1];
          utilities.click(PREVIOUS_BUTTON+' a');
          scope.$digest();
          rowOneColumnOne = document.querySelectorAll('.name')[1];
          expect(rowOneColumnOne.textContent).toEqual(firstContent);
        });
        it('should trigger on-change callback', function(){
          expect(scope.changeRows).toHaveBeenCalled();
        });
      })
    });
  });
  describe('given a rendered table', function(){
    describe('and table has pagination', function(){
      describe('when an indices is clicked', function(){
        beforeEach(function(){
          scope.changeRows = jasmine.createSpy('spy');
          var markup = '<akam-table items="bigData" akam-standalone on-change="changeRows(items)">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
              '</akam-table-column>'+
              '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>';
          addElement(markup);
        });
        it('should display the that page of data', function(){
          var rowOneColumnOne = document.querySelectorAll('.name')[1];
          var firstContent = rowOneColumnOne.textContent;
          utilities.click(document.querySelector(PAGINATION_INDEX_NTH+'(3) a'));
          scope.$digest();
          rowOneColumnOne = document.querySelectorAll('.name')[1];
          expect(rowOneColumnOne.textContent).not.toEqual(firstContent);
        });
        it('should trigger on-change callback', function(){
          expect(scope.changeRows).toHaveBeenCalled();
        });
      })
    });
  });
  describe('given a rendered table', function(){
    describe('and table has pagination', function(){
      describe('when an new page size is clicked', function(){
        beforeEach(function(){
          var markup = '<akam-table items="bigData" akam-standalone on-change="changeRows(items)">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
              '</akam-table-column>'+
              '<akam-table-column class="id" row-property="id" header-name="{{bigDataColumns.row2}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>';
          addElement(markup);
          utilities.click(PAGE_SIZE_LARGEST+ ' a');
          scope.$digest();
        });
        it('should display that amount of data', function(){
          var totalRows = document.querySelectorAll(TABLE_ROW);
          expect(totalRows.length).toEqual(50);
        });
      })
    });
  });
  describe('given a no-data-message attribute', function(){
    describe('when the table is rendered', function(){
      describe('and the table contains no data', function(){
        beforeEach(function(){
          scope.noData = [];
          scope.noDataMessage = "No data available";
          var markup = '<akam-table items="noData" akam-standalone on-change="changeRows(items)" no-items-message="noDataMessage">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>';
          addElement(markup);
        });
        it('should display the no data message', function(){
          var emptyMessage = document.querySelector('.empty-table-message');
          expect(emptyMessage.textContent).toContain(scope.noDataMessage);
        });
      });
    });
  });
  describe('given a no-data-message attribute', function(){
    describe('when the table is rendered', function(){
      describe('and the table contains no data', function(){
        describe('and the message is changed', function(){
          beforeEach(function(){
            scope.noData = [];
            scope.noDataMessage = "No data available";
            var markup = '<akam-table items="noData" akam-standalone on-change="changeRows(items)" no-items-message="noDataMessage">'+
                '<akam-table-row>'+
                '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
                '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>';
            addElement(markup);
            scope.noDataMessage = "new message";
            scope.$digest();
          });
          it('should display the new no data message', function(){
            var emptyMessage = document.querySelector('.empty-table-message');
            expect(emptyMessage.textContent).toContain("new message");
          });
        });
      });
    });
  });
  describe('given no no-data-message attribute', function(){
    describe('when the table is rendered', function(){
      describe('and the table contains no data', function(){
        beforeEach(function(){
          scope.noData = [];
          var markup = '<akam-table items="noData" akam-standalone on-change="changeRows(items)">'+
              '<akam-table-row>'+
              '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
              '</akam-table-column>'+
            '</akam-table-row>'+
          '</akam-table>';
          addElement(markup);
          var emptyMessage = document.querySelector('.empty-table-message');
          scope.$digest();
        });
        it('should display default no data message message', function(){
          var emptyMessage = document.querySelector('.empty-table-message');
          expect(emptyMessage.textContent).toContain("There is no data based upon your criteria");
        });
      });
    });
  });
  describe('given a no-filter-message attribute', function(){
    describe('when the table is rendered', function(){
      describe('and there is some filter', function(){
        describe('and the table contains no data', function(){
          beforeEach(function(){
            scope.noData = [];
            scope.noFiterMessage = "No data available";
            var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)" '+
                'no-filter-results-message="{{noFiterMessage}}">'+
                '<akam-table-row>'+
                '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
                '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>';
            addElement(markup);
            var tableController = self.el.isolateScope().table;
            tableController.state.filter = 'zzzzz';
            tableController.filterRows();
            scope.$digest();
          });
          it('should display the no filter results message', function(){
            var emptyMessage = document.querySelector('.empty-table-message');
            expect(emptyMessage.textContent).toContain(scope.noFiterMessage);
          });
        });
      });
    });
  });
  describe('given no no-filter-message attribute', function(){
    describe('when the table is rendered', function(){
      describe('and there is some filter', function(){
        describe('and the table contains no data', function(){
          beforeEach(function(){
            scope.noFiterMessage = "No data available";
            var markup = '<akam-table items="mydata" akam-standalone on-change="changeRows(items)">'+
                '<akam-table-row>'+
                '<akam-table-column class="name" row-property="first_name" header-name="{{bigDataColumns.row1}}">'+
                '</akam-table-column>'+
              '</akam-table-row>'+
            '</akam-table>';
            addElement(markup);
            var tableController = self.el.isolateScope().table;
            tableController.state.filter = 'zzzzz';
            tableController.filterRows();
            scope.$digest();
          });
          it('should display the no filter results message', function(){
            var emptyMessage = document.querySelector('.empty-table-message');
            expect(emptyMessage.textContent).toContain('There are no results based upon your filter');
          });
        });
      });
    });
  });
  describe('given a rendered table', function(){
    describe('and a filter-placeholder attribute is not provided', function(){
      it('should render default filter placeholder for the filterbox', function(){
        var markup =  '<akam-table items="mydata" akam-standalone '+
                        ' on-change="changeRows(items)">'+
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
                          '</akam-table-row>'+
                        '</akam-table>'
        addElement(markup);

        var filterbox = document.querySelector(FILTER_BOX);
        expect(filterbox.placeholder).toContain("Filter");
      });
    });
    describe('and a filter-placeholder attribute is provided', function(){
      it('should translate filter-placeholder for the filterbox if key is valid', function(){
        var markup =  '<akam-table items="mydata" akam-standalone filter-placeholder="components.table.filterPlaceholder"'+
                        ' on-change="changeRows(items)">'+
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
                          '</akam-table-row>'+
                        '</akam-table>'
        addElement(markup);

        var filterbox = document.querySelector(FILTER_BOX);
        timeout(function(){
          expect(filterbox.placeholder).toContain("Filter");
        },0);
      });
      it('should translate and display key if key is invalid', function(){
        var markup =  '<akam-table items="mydata" akam-standalone filter-placeholder="invalidKey"'+
                        ' on-change="changeRows(items)">'+
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
                          '</akam-table-row>'+
                        '</akam-table>'
        addElement(markup);

        var filterbox = document.querySelector(FILTER_BOX);
        expect(filterbox.placeholder).toContain("invalidKey");
      });
    });
    describe('and a no-filter-results-message attribute is not provided', function(){
      it('should render default filter placeholder for the filterbox', function(){
        var markup =  '<akam-table items="mydata" akam-standalone '+
                        ' on-change="changeRows(items)">'+
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
                          '</akam-table-row>'+
                        '</akam-table>'
        addElement(markup);
        var tableController = self.el.isolateScope().table;
        tableController.state.filter = 'zzzzz';
        tableController.filterRows();
        scope.$digest();
        var emptyMessage = document.querySelector('.empty-table-message');
        expect(emptyMessage.textContent).toContain("There are no results based upon your filter");
      });
    });
    describe('and a no-filter-results-message attribute is provided', function(){
      it('should translate no-filter-results-message key is valid', function(){
        var markup =  '<akam-table items="mydata" akam-standalone no-filter-results-message="components.table.filterPlaceholder"'+
                        ' on-change="changeRows(items)">'+
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
                          '</akam-table-row>'+
                        '</akam-table>'
        addElement(markup);
        var tableController = self.el.isolateScope().table;
        tableController.state.filter = 'zzzzz';
        tableController.filterRows();
        scope.$digest();
        var emptyMessage = document.querySelector('.empty-table-message');
        timeout(function(){
          expect(emptyMessage.textContent).toContain("Filter");
        },0);
      });
      it('should translate and display key if key is invalid', function(){
        var markup =  '<akam-table items="mydata" akam-standalone no-filter-results-message="invalidKey"'+
                        ' on-change="changeRows(items)">'+
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
                          '</akam-table-row>'+
                        '</akam-table>'
        addElement(markup);
        var tableController = self.el.isolateScope().table;
        tableController.state.filter = 'zzzzz';
        tableController.filterRows();
        scope.$digest();
        var emptyMessage = document.querySelector('.empty-table-message');
        expect(emptyMessage.textContent).toContain("invalidKey");
      });
    });
  });
 });




