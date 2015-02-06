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

        options.backdrop = 'static';
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
                var collapsed = true;

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

        /**
         * @ngdoc method
         *
         * @name messageBox#showInfo
         *
         * @methodOf akamai.components.message-box.service:messageBox
         *
         * @description
         * Open a new information message box with a headline and message.
         *
         * @param {object} options A hash supporting a subset of the
         *   `modalWindow` options and additionally:
         *   - **headline** - `{string}` - A headline for the message box.
         *   - **text** - `{string}` - A short message.
         *   - **details** - `{string=}` - Additional text that is collapsed by
         *     default.
         *
         * @return {object} A `modalWindow` instance
         */
        showInfo: function(options) {
            options = options || {};
            options.title = options.title || 'Information';
            options.icon = 'svg-information';
            options.windowClass = 'information akam-message-box';
            return this._show(options);
        },

        /**
         * @ngdoc method
         *
         * @name messageBox#showQuestion
         *
         * @methodOf akamai.components.message-box.service:messageBox
         *
         * @description
         * Open a new question message box with a headline and message.
         *
         * @param {object} options A hash of options documented with
         *   `messageBox#showInfo`
         *
         * @return {object} A `modalWindow` instance
         */
        showQuestion: function(options) {
            options = options || {};
            options.title = options.title || 'Question';
            options.icon = 'svg-question';
            options.windowClass = 'question akam-message-box';
            return this._show(options);
        },

        /**
         * @ngdoc method
         *
         * @name messageBox#showError
         *
         * @methodOf akamai.components.message-box.service:messageBox
         *
         * @description
         * Open a new error message box with a headline and message.
         *
         * @param {object} options A hash of options documented with
         *   `messageBox#showInfo`
         *
         * @return {object} A `modalWindow` instance
         */
        showError: function(options) {
            options = options || {};
            options.title = options.title || 'Error';
            options.icon = 'svg-error';
            options.windowClass = 'error akam-message-box';
            return this._show(options);
        }
    };
};
