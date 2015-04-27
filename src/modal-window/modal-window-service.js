'use strict';
var angular = require('angular');

/* @ngInject */
module.exports = function($modal, $templateCache, $rootScope, $q, translate, statusMessage) {

  return {
    /**
     * @ngdoc method
     *
     * @name modalWindow#open
     *
     * @methodOf akamai.components.modal-window.service:modalWindow
     *
     * @description Opens a new modal window.
     *
     * @param {object} options A hash with the options specified below.
     *
     * @param {string} [options.cancelLabel=Cancel] A label for
     * the cancel button.
     *
     * @param {Function|string} options.controller A controller
     * for the modal instance that can initialize scope.
     *
     * @param {boolean} [options.hideSubmit=false] A flag to hide
     * the submit button and only allow the modal to be dismissed.
     *
     * @param {string} options.icon A CSS class representing an
     * icon to display to the left of the modal window title.
     *
     * @param {Scope} [options.scope=$rootScope] A scope
     * instance to use for the modal body content.
     *
     * @param {string} [options.submitLabel=Save] A label for the
     * submit button.
     *
     * @param {string} options.template An inline template to
     * render within the body of the modal window.
     *
     * @param {string} options.templateUrl A URL referencing a
     * template to render within the body of the modal window.
     *
     * @param {string} [options.title=Modal Window Title] A
     * title for the modal window.
     *
     * @return {object} An instance of the modal with the following
     * properties:
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
    open: function(options) {
      var scope = (options.scope || $rootScope).$new(),
        onSubmit = angular.noop,
        disabled = false,
        processing = false, //variable used to determine if the submit is clicked, but promise has not resolved
        instance;

      scope.showSubmitError = false;

      // check that a template was provided
      if (!(angular.isDefined(options.template) ||
        angular.isDefined(options.templateUrl))) {
        throw new Error('Modal Window template or templateUrl option required');
      }

      // setup options specific for the modal window
      scope.modalWindow = {
        title: options.title || translate.sync('components.modal-window.title'),
        icon: options.icon,
        cancelLabel: options.cancelLabel || translate.sync('components.modal-window.label.cancel'),
        submitLabel: options.submitLabel || translate.sync('components.modal-window.label.save'),
        template: options.template,
        templateUrl: options.templateUrl,
        errorMessage: options.errorMessage || translate.sync('components.modal-window.errorMessage'),
        successMessage: options.successMessage || translate.sync('components.modal-window.successMessage')
      };

      scope.isSubmitHidden = function() {
        return angular.isDefined(options.hideSubmit) ?
          options.hideSubmit : false;
      };

      // provide methods to control submit button disabled state
      scope.disableSubmit = function() {
        disabled = true;
      };
      scope.enableSubmit = function() {
        disabled = false;
      };
      scope.isSubmitDisabled = function() {
        return disabled || processing;
      };
      scope.isProcessing = function() {
        return processing;
      };

      // create a new bootstrap ui modal instance with akamai options
      instance = $modal.open(angular.extend(options, {
        scope: scope,
        template: require('./templates/modal-window.tpl.html')
      }));

      scope.close = function() {
        instance.dismiss();
      };

      // setup promise that will resolve when submit button is clicked
      scope.setOnSubmit = function(fn) {
        onSubmit = fn;
      };

      scope.submit = function() {
        var result;

        processing = true;
        scope.showSubmitError = false;

        if (angular.isFunction(onSubmit)) {
          result = onSubmit();
        } else {
          result = onSubmit;
        }

        $q.when(result).then(
          function(returnValue) {
            instance.close(returnValue);
            statusMessage.showSuccess({text: scope.modalWindow.successMessage});
          }
        ).catch(
          function() {
            processing = false;
            scope.showSubmitError = true;
          }
        );
      };
      return instance;
    }
  };
};
