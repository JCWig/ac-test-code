'use strict';

describe('akam-pagination directive', function() {
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/pagination'));
        inject(function($compile, $rootScope) {
        });
    });

    context('when rendering', function() {
        it('should display the total item count');
        it('should highlight the current active page');
        it('should display a previous button');
        it('should display a next button');
        it('should display the first page');
        it('should display the last page');
        it('should display a maximum of seven pages');
        it('should display the page size options');

        context('when total item count is less than 25', function() {
            it('should hide pagination');
            it('should hide page size options');
            it('should display the the total item count');
        });

        context('when the last page is the current page', function() {
            it('should disable the next button');
        });

        context('when the first page is the current page', function() {
            it('should disable the previous button');
        });

        context('when the current page is > 3 away from the first', function() {
            it('should display an ellipsis after the first page');
        });

        context('when the current page is > 3 away from the last', function() {
            it('should display an ellipsis before the last page');
        });
    });

    context('when a page is clicked', function() {
        it('should highlight the clicked page');
        it('should trigger the onchangepage callback');
    });

    context('when the previous button is clicked', function() {
        it('should highlight the previous page');
        it('should trigger the onchangepage callback');
    });

    context('when the next button is clicked', function() {
        it('should highlight the next page');
        it('should trigger the onchangepage callback');
    });

    context('when the page size is changed', function() {
        it('should highlight the new page size');
        it('should trigger the onchangesize callback');
    });

    context('when the total item count is updated', function() {
        it('should display the updated total item count');
        it('should update the pagination controls');
    });
});
