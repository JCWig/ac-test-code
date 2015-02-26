'use strict';

var utils = require('../utilities');
var translationMock = {
    "components": {
        "pagination": {
            "label": {
                "results": "Results: ",
                "show-entries": "Show Entries: "
            }
        }
    }
};

describe('akam-pagination directive', function() {
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/pagination').name);
        angular.mock.module(function($provide, $translateProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve(translationMock);
                    });
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function($compile, $rootScope, $timeout) {
            var markup = '<akam-pagination total-items="pager.count" ' +
                'current-page="pager.page" onchangepage="onchangepage(page)" ' +
                'page-size="pager.size" onchangesize="onchangesize(size)">' +
                '</akam-pagination>';

            self.scope = $rootScope.$new();
            self.timeout = $timeout;
            self.scope.onchangepage = sinon.spy();
            self.scope.onchangesize = sinon.spy();
            self.scope.pager = {
                count: 220,
                page: 5,
                size: 25
            };
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
            var el = this.element.querySelector('.pagination li:first-child i');
            expect(el.classList.contains('luna-arrow_smLeft')).to.be.true;
        });

        it('should display a next button', function() {
            var el = this.element.querySelector('.pagination li:last-child i');
            expect(el.classList.contains('luna-arrow_smRight')).to.be.true;
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

        it('should display the page size options', function() {
            var el = this.element.querySelectorAll('.page-size li');
            expect(el).to.have.length(3);
        });

        context('when the page size is not set', function() {
            it('should default to 10', function() {
                var el;

                this.scope.pager.size = null;
                this.scope.$digest();

                el = this.element.querySelector('.page-size li:first-child');
                expect(el.classList.contains('active')).to.be.true;
            });
        });

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
                this.scope.pager.count = 9;
                this.scope.pager.size = 10;
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

        context('when total item count is less than a page size', function() {
            it('should disable the page size', function() {
                var pageSizes;
                var el;

                this.scope.pager.count = 24;
                this.scope.pager.size = 10;
                this.scope.$digest();

                pageSizes = this.element.querySelectorAll('.page-size li');
                expect(pageSizes[0].classList.contains('disabled')).to.be.false;
                expect(pageSizes[1].classList.contains('disabled')).to.be.true;

                utils.click(pageSizes[1].querySelector('a'));
                el = this.element.querySelector('.page-size li:nth-child(2)');
                expect(el.classList.contains('active')).to.be.false;
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

    context('when a page size is clicked', function() {
        it('should highlight the new page size', function() {
            var el = this.element.querySelector('.page-size li:last-child');

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            el = this.element.querySelector('.page-size li:last-child');
            expect(el.classList.contains('active')).to.be.true;

        });

        it('should trigger the onchangesize callback', function() {
            var el = this.element.querySelector('.page-size li:last-child');

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            expect(this.scope.onchangesize).to.have.been.calledWith(50);
        });
    });

    context('when the active page size is clicked', function() {
        it('should do nothing', function() {
            var el = this.element.querySelector('.page-size li:nth-child(2)');

            expect(el.classList.contains('active')).to.be.true;

            utils.click(el.querySelector('a'));
            this.scope.$digest();

            el = this.element.querySelector('.page-size li:nth-child(2)');
            expect(el.classList.contains('active')).to.be.true;
        });
    });

    context('when the total item count is updated', function() {
        it('should display the updated total item count', function() {
            var el;

            this.scope.pager.count = 450;
            this.scope.$digest();

            el = this.element.querySelector('.total-items');
            expect(el.textContent).to.match(new RegExp(this.scope.pager.count));
        });

        it('should update the pagination controls', function() {
            var el;

            this.scope.pager.count = 500;
            this.scope.$digest();

            el = this.element.querySelector('.pagination li:nth-last-child(2)');
            expect(el.textContent).to.match(/20/);
        });
    });

    context('after rendering', function() {
        it('should translated result label display correctly', function() {
            var el;

            this.timeout.flush();
            this.scope.$digest();

            el = this.element.querySelector('.total-items');
            expect(el.textContent).to.contain("Results: ");
        });

        it('should translated show entries label display correctly', function() {
            var el;

            this.timeout.flush();
            this.scope.$digest();

            el = this.element.querySelector('.page-size').childNodes[1];
            expect(el.textContent).to.contain("Show Entries: ");
        });
    });
});
