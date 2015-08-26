'use strict';

describe('akam-modal-window-body directive', function() {
  var compile = null;
  var self = this;
  beforeEach(function() {
    inject.strictDi(true);
    self = this;
    angular.mock.module(require('../../src/modal-window').name);
    angular.mock.module(function($provide, $translateProvider) {

      function i18nCustomLoader($q, $timeout) {
        return function(options) {
          var deferred = $q.defer();
          $timeout(function() {
            deferred.resolve({});
          });
          return deferred.promise;
        };
      }
      i18nCustomLoader.$inject = ['$q', '$timeout'];

      $provide.factory('i18nCustomLoader', i18nCustomLoader);
      $translateProvider.useLoader('i18nCustomLoader');
    });
    inject(function($compile, $rootScope, $httpBackend, $http, $templateCache, $q, $modal, translate, statusMessage, i18nConfig) {
      self.$httpBackend = $httpBackend;
      self.scope = $rootScope.$new();
      self.scope.modalWindow = {
        templateModel: {},
        contentScope: $rootScope.$new()
      };
      self.scope.modalWindow.contentScope.name = 'Akamai';
      self.http = $http;
      self.templateCache = $templateCache;
      self.q = $q;
      self.translate = translate;
      self.modal = $modal;
      self.statusMessage = statusMessage;
      self.i18nConfig = i18nConfig;
      compile = $compile;
    });
  });
  afterEach(function() {
    if (self.element) {
      document.body.removeChild(self.element);
      self.element = null;
    }
  });
  function addElement(markup) {
    self.el = compile(markup)(self.scope);
    self.element = self.el[0];
    self.scope.$apply();
    document.body.appendChild(self.element);
  }

  describe('when rendering', function() {
    it('should render an inline template', function() {
      var markup = '<akam-modal-window-body></akam-modal-window-body>';
      var template = '<span>Hello {{ name }}</span>';

      this.scope.modalWindow.templateModel.template = template;
      addElement(markup);

      expect(self.element.textContent.trim()).toEqual('Hello Akamai');
    });

    it('should render a template url', function() {
      var markup = '<akam-modal-window-body></akam-modal-window-body>';
      var template = '<span>Hello {{ name }}</span>';
      var url = 'modal-window/template.html';

      this.$httpBackend.whenGET(url).respond(template);
      this.scope.modalWindow.templateModel.templateUrl = url;
      addElement(markup);
      this.$httpBackend.flush();

      this.$httpBackend.verifyNoOutstandingRequest();
      expect(self.element.textContent.trim()).toContain('Hello Akamai');
    });
  });
  describe('when modalWindow is processing', function() {
    it('should hide overflow on div.modal-body', function() {
      var markup = '<akam-modal-window-body></akam-modal-window-body>';
      var template = '<span>Hello {{ name }}</span>';
      var url = 'modal-window/template.html';
      var el;
      self.scope.modalWindow.processing = true;

      this.$httpBackend.whenGET(url).respond(template);
      this.scope.modalWindow.templateModel.templateUrl = url;
      addElement(markup);
      this.$httpBackend.flush();
      this.$httpBackend.verifyNoOutstandingRequest();

      el = document.querySelector('.util-hidden-overflow');

      expect(el).not.toBe(null);
    });
  });
});
