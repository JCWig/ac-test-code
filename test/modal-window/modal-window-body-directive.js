'use strict';

describe('akam-modal-window-body directive', function() {
    beforeEach(function() {
        var self = this;

        angular.mock.module(require('../../src/modal-window').name);
        angular.mock.module(function($provide, $translateProvider) {
            $provide.factory('i18nCustomLoader', function($q, $timeout) {
                return function(options) {
                    var deferred = $q.defer();
                    $timeout(function() {
                        deferred.resolve({});
                    });
                    return deferred.promise;
                };
            });
            $translateProvider.useLoader('i18nCustomLoader');
        });
        inject(function($compile, $rootScope, $httpBackend) {
            var markup = '<akam-modal-window-body></akam-modal-window-body>';

            self.template = '<span>Hello {{ name }}</span>';
            self.$httpBackend = $httpBackend;
            self.scope = $rootScope.$new();
            self.scope.modalWindow = {};
            self.scope.name = 'Akamai';
            self.link = $compile(markup);
        });
    });

    context('when rendering', function() {
        it('should render an inline template', function() {
            var modalWindow;

            this.scope.modalWindow.template = this.template;
            modalWindow = this.link(this.scope)[0];
            this.scope.$digest();

            expect(modalWindow.childNodes).to.have.length(1);
            expect(modalWindow.textContent).to.equal('Hello Akamai');
        });

        it('should render a template url', function() {
            var url = 'modal-window/template.html';
            var modalWindow;

            this.$httpBackend.whenGET(url).respond(this.template);
            this.scope.modalWindow.templateUrl = url;
            modalWindow = this.link(this.scope)[0];
            this.$httpBackend.flush();

            this.$httpBackend.verifyNoOutstandingRequest();
            expect(modalWindow.childNodes).to.have.length(1);
            expect(modalWindow.textContent).to.equal('Hello Akamai');
        });
    });
});
