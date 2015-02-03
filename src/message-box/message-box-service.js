'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function(modalWindow, $rootScope) {
    function show(options) {
        if (!angular.isDefined(options.headline)) {
            throw new Error('headline option is required');
        }

        if (!angular.isDefined(options.text)) {
            throw new Error('text option is required');
        }

        options.scope = $rootScope.$new();
        options.scope.messageBox = {
            headline: options.headline,
            text: options.text,
            details: options.details
        };

        options.cancelLabel = options.cancelLabel || 'No';
        options.submitLabel = options.submitLabel || 'Yes';

        return modalWindow.open(angular.extend(options, {
            template: require('./templates/message-box.tpl.html'),

            /* @ngInject */
            controller: function($scope) {
                var collapsed = false;

                $scope.toggle = function() {
                    collapsed = !collapsed;
                };

                $scope.isCollapsed = function() {
                    return collapsed;
                };
            }
        }));
    }

    return {
        _show: show,

        showInfo: function(options) {
            options.title = options.title || 'Information';
            options.icon = 'svg-information';
            options.windowClass = 'information';
            return show(options);
        },

        showQuestion: function(options) {
            options.title = options.title || 'Question';
            options.icon = 'svg-question';
            options.windowClass = 'information';
            return show(options);
        },

        showError: function(options) {
            options.title = options.title || 'Error';
            options.icon = 'svg-error';
            options.windowClass = 'error';
            return show(options);
        }
    };
};
