'use strict';

/* @ngInject */
module.exports = function($modal, $templateCache, $rootScope, $q, translate) {
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
            var scope = (options.scope || $rootScope).$new();
            //var deferred = $q.defer();
            var disabled = false;
            var instance;

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
                templateUrl: options.templateUrl
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
                return disabled;
            };

            // create a new bootstrap ui modal instance with akamai options
            instance = $modal.open(angular.extend(options, {
                scope: scope,
                template: require('./templates/modal-window.tpl.html')
            }));

            // setup promise that will resolve when submit button is clicked
            instance.submitted = options.submittedCallback || function(close){ close(true); };
            scope.submit = function() {
                if(angular.isFunction(instance.submitted)){
                    instance.submitted(angular.bind(instance, instance.close));
                }
            };

            return instance;
        }
    };
};
