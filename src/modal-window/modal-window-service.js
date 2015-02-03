'use strict';

/* @ngInject */
module.exports = function($modal, $templateCache, $rootScope, $q) {
    return {
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
