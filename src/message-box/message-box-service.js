'use strict';

var angular = require('angular');

/* @ngInject */
module.exports = function(modalWindow, akamTranslate, $rootScope, $filter) {
    function show(options) {
        if (options.headline == null) {
            throw new Error('headline option is required');
        }

        if (options.text == null) {
            throw new Error('text option is required');
        }

        options.title = options.title ? options.title.substr(0, 20) : '';
        options.backdrop = 'static';
        options.scope = $rootScope.$new();
        options.scope.messageBox = {
            headline: options.headline.substr(0, 25),
            text: options.text.substr(0, 220),
            details: options.details
        };

        options.cancelLabel = options.cancelLabel || akamTranslate.instant('components.message-box.no');
        options.submitLabel = options.submitLabel || akamTranslate.instant('components.message-box.yes');

        return modalWindow.open(angular.extend(options, {
            template: require('./templates/message-box.tpl.html'),

            /* @ngInject */
            controller: function($scope) {
                var collapsed = true;

                $scope.submitted.then(function(close) {
                    close(true);
                });

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
         *   - **headline** - `{string}` - A headline for the message box. (limited to 25 characters)
         *   - **text** - `{string}` - A short message. (limited to 220 characters)
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
