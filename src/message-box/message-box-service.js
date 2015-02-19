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
         * @description Opens a new message box to present general
         * information.
         *
         * @param {object} options A hash supporting a subset of
         * {@link akamai.components.modal-window `modalWindow`}
         * options, along with:
         *
         * - `headline` (string) A required headline for the message
         *   box, limited to 25 characters.
         *
         * - `text` (string) A required message, limited to 220
         *   characters.
         *
         * - `details` (string) Optional additional text, which
         *   appears collapsed by default.
         *
         * @return {object} A
         * {@link akamai.components.modal-window `modalWindow`}
         * instance.
         *
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
         * @description Opens a new message box that asks a question.
         *
         * @param {object} options A hash of options detailed above in
         * `showInfo()`
         *
         * @return {object} A
         * {@link akamai.components.modal-window `modalWindow`}
         * instance.
         *
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
         * @description Opens a new message box to acknowledge errors.
         *
         * @param {object} options A hash of options detailed below in
         * `showInfo()`
         *
         * @return {object} A
         * {@link akamai.components.modal-window `modalWindow`}
         * instance.
         *
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
