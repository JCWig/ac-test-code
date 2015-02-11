'use strict';

var utils = require('../utilities');

describe('akam-pagination directive', function() {
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/pagination').name);
        inject(function($compile, $rootScope) {
            var markup = '<akam-pagination total-items="pager.count" ' +
                'current-page="pager.page" onchangepage="onchangepage(page)" ' +
                'page-size="pager.size"></akam-pagination>';

            self.scope = $rootScope.$new();
            self.scope.onchangepage = sinon.spy();
            self.scope.onchangesize = sinon.spy();
            self.scope.pager = { count: 220, page: 5, size: 25 };
            self.element = $compile(markup)(self.scope)[0];
            self.scope.$digest();
        });
    });

    context('when rendering', function() {
        it('should display the total item count', function() {
            var el = this.element.querySelector('.total-items');
            expect(el.textContent).to.match(new RegExp(this.scope.pager.count));
        });

        it('should highlight the current active page', function() {
            var el = this.element.querySelector('.pagination li.active');
            expect(el.textContent).to.match(new RegExp(this.scope.pager.page));
        });

        it('should display a previous button', function() {
            var el = this.element.querySelector('.pagination li:first-child');
            expect(el.textContent).to.match(/Previous/);
        });

        it('should display a next button', function() {
            var el = this.element.querySelector('.pagination li:last-child');
            expect(el.textContent).to.match(/Next/);
        });

        it('should display the first page', function() {
            var el = this.element.querySelector('.pagination li:nth-child(2)');
            expect(el.textContent).to.match(/1/);
        });

        it('should display the last page', function() {
            var el = this.element.querySelector('.pagination li:nth-last-child(2)');
            expect(el.textContent).to.match(/9/);
        });

        it('should display pages', function() {
            var items;

            this.scope.pager.count = 53;
            this.scope.pager.page = 2;
            this.scope.$digest();

            // the list contains 3 pages and the next/previous buttons
            items = this.element.querySelectorAll('.pagination li');
            expect(items).to.have.length(3 + 2);
        });

        it('should display a maximum of seven pages', function() {
            var items = this.element.querySelectorAll('.pagination li');

            // the list contains 2 ellipsis and the next/previous buttons in
            // addition to the 7 maximum pages
            expect(items).to.have.length(7 + 2 + 2);
        });

        it('should display the page size options');

        context('when the current page is not set', function() {
            it('should default to the first page', function() {
                var el;

                this.scope.pager.page = null;
                this.scope.$digest();
                
                el = this.element.querySelector('.pagination li:nth-child(2)');
                expect(el.classList.contains('active')).to.be.true;
            });
        });

        context('when total item count is less than two pages', function() {
            beforeEach(function() {
                this.scope.pager.count = 25;
                this.scope.$digest();
            });

            it('should hide pagination', function() {
                var el = this.element.querySelector('.pagination');
                expect(el).to.be.null;
            });

            it('should hide page size options', function() {
                var el = this.element.querySelector('.page-size');
                expect(el).to.be.null;
            });

            it('should display the the total item count', function() {
                var el = this.element.querySelector('.total-items');
                expect(el).to.not.be.null;
            });
        });

        context('when the last page is the current page', function() {
            it('should disable the next button', function() {
                var el = this.element.querySelector('.pagination li:last-child');

                expect(el.classList.contains('disabled')).to.be.false;

                this.scope.pager.page = 9;
                this.scope.$digest();

                el = this.element.querySelector('.pagination li:last-child');
                expect(el.classList.contains('disabled')).to.be.true;
            });
        });

        context('when the first page is the current page', function() {
            it('should disable the previous button', function() {
                var el = this.element.querySelector('.pagination li:first-child');

                expect(el.classList.contains('disabled')).to.be.false;

                this.scope.pager.page = 1;
                this.scope.$digest();

                el = this.element.querySelector('.pagination li:first-child');
                expect(el.classList.contains('disabled')).to.be.true;
            });
        });

        context('when the current page is > 3 away from the first', function() {
            it('should display an ellipsis after the first page', function() {
                var el = this.element.querySelector('.pagination li:nth-child(3)');

                expect(el.textContent).to.equal(String.fromCharCode(8230));

                this.scope.pager.page = 3;
                this.scope.$digest();

                el = this.element.querySelector('.pagination li:nth-child(3)');
                expect(el.textContent).to.not.equal(String.fromCharCode(8230));
            });
        });

        context('when the current page is > 3 away from the last', function() {
            it('should display an ellipsis before the last page', function() {
                var el =
                    this.element.querySelector('.pagination li:nth-last-child(3)');

                expect(el.textContent).to.equal(String.fromCharCode(8230));

                this.scope.pager.page = 7;
                this.scope.$digest();

                el = this.element.querySelector('.pagination li:nth-last-child(3)');
                expect(el.textContent).to.not.equal(String.fromCharCode(8230));
            });
        });
    });

    context('when a page is clicked', function() {
        it('should highlight the clicked page', function() {
            var el = this.element.querySelector('.pagination li:nth-child(4)');

            expect(el.classList.contains('active')).to.be.false;

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            el = this.element.querySelector('.pagination li:nth-child(4)');
            expect(el.classList.contains('active')).to.be.true;
        });

        it('should trigger the onchangepage callback', function() {
            var el = this.element.querySelector('.pagination li:nth-child(4)');

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangepage).to.have.been.calledWith(3);
        });
    });

    context('when an active page is clicked', function() {
        it('should do nothing', function() {
            var el = this.element.querySelector('.pagination li:nth-child(6)');

            expect(el.classList.contains('active')).to.be.true;

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangepage).to.not.have.been.called;
        });
    });

    context('when the previous button is clicked', function() {
        it('should highlight the previous page', function() {
            var el = this.element.querySelector('.pagination li:first-child');

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            el = this.element.querySelector('.pagination li:nth-child(5)');
            expect(el.classList.contains('active')).to.be.true;
        });

        it('should trigger the onchangepage callback', function() {
            var el = this.element.querySelector('.pagination li:first-child');

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangepage).to.have.been.calledWith(4);
        });
    });

    context('when the next button is clicked', function() {
        it('should highlight the next page', function() {
            var el = this.element.querySelector('.pagination li:last-child');

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            el = this.element.querySelector('.pagination li:nth-last-child(5)');
            expect(el.classList.contains('active')).to.be.true;
        });

        it('should trigger the onchangepage callback', function() {
            var el = this.element.querySelector('.pagination li:last-child');

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangepage).to.have.been.calledWith(6);
        });
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
