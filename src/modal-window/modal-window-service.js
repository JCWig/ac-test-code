'use strict';

/* @ngInject */
module.exports = function($modal, $templateCache, $http, $rootScope, $q) {
    function getBodyTemplate(options) {
        if (options.template) {
            return $q.when(options.template);
        } else {
            return $http.get(options.templateUrl, { cache: $templateCache })
                .then(function(result) {
                    return result.data;
                });
        }
    }

    return {
        open: function(options) {
            var scope = (options.scope || $rootScope).$new();

            return getBodyTemplate(options)
                .then(function(content) {
                    scope.bodyContent = content;
                    return $modal.open(angular.extend(options, {
                        scope: scope,
                        template: require('./templates/modal-window.tpl.html')
                    }));
                });
        }
    };
};
