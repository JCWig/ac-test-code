'use strict';

/* @ngInject */
module.exports = function($modal, $templateCache, $rootScope, $q) {
    return {
        /**
         * @ngdoc method
         *
         * @name modalWindow#open
         *
         * @methodOf akamai.components.modal-window.service:modalWindow
         *
         * @description Opens a new modal window with a backdrop with
         * the specified options.
         *
         * @param {object} options A hash with the specified options:
         *
         *   - `template` (string) An inline template to render
         *     within the modal body.
         *
         *   - `templateUrl` (string) A URL referencing a template
         *     to render within the modal body.
         *
         *   - `controller` (Function or string) A controller for the
         *     modal instance that can initialize scope.
         *
         *   - `scope` (Scope) (default: `$rootScope`) A scope
         *     instance to use for the modal body content.
         *
         *   - `title` (string) (default: `Modal Window Title`) A
         *     title for the modal window.
         *
         *   - `icon` (string) A CSS class representing an icon to
         *     display to the left of the modal window title.
         *
         *   - `cancelLabel` (string) (default: `Cancel`) A label
         *     for the cancel button.
         *
         *   - `submitLabel` (string) (default: `Save`) A label for
         *     the submit button.
         *
         *   - `hideSubmit` (boolean) (default: `false`) A flag to
         *     hide the submit button and only allow the modal to be
         *     dismissed.
         *
         * @return {object} An instance of the modal with the following
         * properties:
         *
         *   - `close` (Function) A method to close the modal window
         *     that accepts a result as an argument.
         *
         *   - `dismiss` (Function) A method to dismiss the modal
         *     window, rejecting the `result` promise.
         *
         *   - `result` (Promise) A promise representing the result
         *     when the modal window is closed.
         *
         */
        open: function(options) {
            var scope = (options.scope || $rootScope).$new();
            var deferred = $q.defer();
            var disabled = false;
            var instance;

            // check that a template was provided
            if (!(angular.isDefined(options.template) ||
                  angular.isDefined(options.templateUrl))) {
                throw new Error('template or templateUrl option required');
            }

            // setup options specific for the modal window
            scope.modalWindow = {
                title: options.title || 'Modal Window Title',
                icon: options.icon,
                cancelLabel: options.cancelLabel || 'Cancel',
                submitLabel: options.submitLabel || 'Save',
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
            scope.submitted = deferred.promise;
            scope.submit = function() {
                deferred.resolve(angular.bind(instance, instance.close));
            };

            return instance;
        }
    };
};
