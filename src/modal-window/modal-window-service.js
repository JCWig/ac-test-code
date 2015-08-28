import angular from 'angular';
import template from './templates/modal-window.tpl.html';

class ModalWindowController {

  static get $inject() {
    return ['$scope', '$modal', '$templateCache', '$rootScope', 'translate', '$controller',
      'statusMessage', '$q'];
  }

  constructor($scope, $modal, $templateCache, $rootScope, translate, $controller,
              statusMessage, $q) {
    this.$modal = $modal;
    this.$templateCache = $templateCache;
    this.$rootScope = $rootScope;
    this.translate = translate;
    this.$controller = $controller;
    this.$scope = $scope;
    this.statusMessage = statusMessage;
    this.$modal = $modal;
    this.$q = $q;

    this.disabled = false;
    this.processing = false;
    this.showSubmitError = false;
    this.onSubmit = angular.noop;

    this.options = $scope.options;

    this.initializeContent();

    this.setProperty('title', 'components.modal-window.title');
    this.setProperty('cancelLabel', 'components.modal-window.label.cancel');
    this.setProperty('submitLabel', 'components.modal-window.label.save');
    this.setProperty('errorMessage', 'components.modal-window.errorMessage');
    this.setProperty('successMessage', 'components.modal-window.successMessage');
    this.setProperty('icon');
    this.setProperty('template');
    this.setProperty('templateUrl');
    this.setProperty('hideSubmit');
    this.setProperty('doNotShowMessage');
    this.setProperty('instance');
    this.setProperty('showFullscreenToggle');

    this.decorateInstance();

    this.templateModel = {
      template: this.options.contentTemplate,
      templateUrl: this.options.contentTemplateUrl
    };
  }

  initializeContent() {
    let contentController;

    this.contentScope = this.options.contentScope ?
      this.options.contentScope : this.$rootScope.$new();

    this.contentScope.setOnSubmit = fn => this.onSubmit = fn;
    this.contentScope.disableSubmit = () => this.disabled = true;
    this.contentScope.enableSubmit = () => this.disabled = false;

    this.contentScope.isSubmitDisabled = angular.bind(this, this.isSubmitDisabled);

    if (this.options.contentController) {
      contentController = this.$controller(
        this.options.contentController, {$scope: this.contentScope}
      );
    }

    if (this.options.contentControllerAs && contentController) {
      this.contentScope[this.options.contentControllerAs] = contentController;
    }
  }

  decorateInstance() {
    (() => {
      let instanceDismiss = this.instance.dismiss;
      let instanceClose = this.instance.close;

      this.instance.dismiss = () => {
        this.contentScope.$destroy();
        return instanceDismiss();
      };

      this.instance.close = returnValue => {
        this.contentScope.$destroy();
        return instanceClose(returnValue);
      };
    })();
  }

  isSubmitDisabled() {
    return this.disabled || this.processing;
  }

  setProperty(key, defaultKey) {
    if (defaultKey) {
      this[key] = this.options[key] ?
        this.translate.sync(this.options[key]) : this.translate.sync(defaultKey);
    } else {
      this[key] = this.options[key];
    }
  }

  submit() {
    let result;

    this.showSubmitError = false;

    if (angular.isFunction(this.onSubmit)) {
      result = this.onSubmit();
    } else {
      result = this.onSubmit;
    }

    // check to see if the onSubmit returns a promise
    if (result && angular.isFunction(result.then)) {
      this.processing = true;
    }

    this.$q.when(result).then((returnValue) => {
      this.instance.close(returnValue);
      if (!this.doNotShowMessage) {
        this.statusMessage.showSuccess({text: this.successMessage});
      }
    }).catch(() => {
      this.processing = false;
      this.showSubmitError = true;
    });

  }

}

export default class ModalWindowService {

  static get $inject() {
    return ['$modal', '$rootScope'];
  }

  constructor($modal, $rootScope) {
    this.$modal = $modal;
    this.$rootScope = $rootScope;
  }

  /**
   * @ngdoc method
   *
   * @name modalWindow#open
   *
   * @description Opens a new modal window.
   *
   * @param {object} options A hash with the options specified below.
   *
   * @param {string} [options.cancelLabel=Cancel] A label for the cancel button.
   *
   * @param {Function|string} options.controller A controller for the modal instance that can
   * initialize scope.
   *
   * @param {boolean} [options.hideSubmit=false] A flag to hide the submit button and only allow
   * the modal to be dismissed.
   *
   * @param {string} options.icon A CSS class representing an icon to display to the left of the
   * modal window title.
   *
   * @param {Scope} [options.scope=$rootScope] A scope instance to use for the modal body content.
   *
   * @param {string} [options.submitLabel=Save] A label for the submit button.
   *
   * @param {string} options.template An inline template to render within the body of the
   * modal window.
   *
   * @param {string} options.templateUrl A URL referencing a template to render within the body of
   * the modal window.
   *
   * @param {string} [options.title=Modal Window Title] A title for the modal window.
   *
   * @param {boolean} [options.showFullscreenToggle] Allows for the modal to be maximized and
   * restored via user toggling the full screen/restore icon
   *
   * @return {object} An instance of the modal with the following properties:
   *
   * - `close` (Function) A method to close the modal window
   *   that accepts a result as an argument.
   *
   * - `dismiss` (Function) A method to dismiss the modal
   *   window, rejecting the `result` promise.
   *
   * - `result` (Promise) A promise representing the result
   *   when the modal window is closed.
   *
   */
  open(options) {

    if (!angular.isObject(options)) {
      throw new Error('An options object was not passed to modelWindow.open');
    }

    if (!(angular.isString(options.template) || angular.isString(options.templateUrl))) {
      throw new Error('Modal Window template or templateUrl option required');
    }

    let scope = this.$rootScope.$new();

    scope.options = options;

    options.contentController = options.controller;
    options.contentScope = options.scope;
    options.contentControllerAs = options.controllerAs;
    options.contentTemplate = options.template;
    options.contentTemplateUrl = options.templateUrl;

    // create a new bootstrap ui modal instance with akamai options
    options.instance = this.$modal.open(angular.extend(options, {
      scope: scope,
      template: template,
      controller: ModalWindowController,
      controllerAs: 'modalWindow'
    }));

    return options.instance;
  }

}
