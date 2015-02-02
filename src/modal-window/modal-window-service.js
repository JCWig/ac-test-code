'use strict';

/* @ngInject */
module.exports = function($modal, $templateCache, $http, $rootScope, $q) {
    return {
        open: function(options) {
            var scope = (options.scope || $rootScope).$new();
            var deferred = $q.defer();
            var disabled = false;
            var instance;

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
                deferred.resolve(instance.close.bind(instance));
            };

            return instance;
        }
    };
};
