var angular = require('angular');

module.exports = function(modalWindow, translate, $rootScope) {

  function modalWindowController($scope) {
    var collapsed = true;

    $scope.toggle = function() {
      collapsed = !collapsed;
    };

    $scope.isCollapsed = function() {
      return collapsed;
    };
  }

  modalWindowController.$inject = ['$scope'];

  function show(options, type) {
    var title = translate.sync('components.message-box.title.information');

    if (options.headline == null) {
      throw new Error('headline option is required');
    }

    if (options.text == null) {
      throw new Error('text option is required');
    }

    if (type === 'question') {
      title = translate.sync('components.message-box.title.question');
    } else if (type === 'error') {
      title = translate.sync('components.message-box.title.error');
    }

    options.title = options.title ? options.title.substr(0, 20) : title;
    options.backdrop = 'static';
    options.scope = $rootScope.$new();
    options.scope.messageBox = {
      headline: options.headline.substr(0, 48),
      text: options.text.substr(0, 220),
      details: options.details
    };

    options.cancelLabel = options.cancelLabel || translate.sync('components.message-box.no');
    options.submitLabel = options.submitLabel || translate.sync('components.message-box.yes');

    return modalWindow.open(angular.extend(options, {
      template: require('./templates/message-box.tpl.html'),
      doNotShowMessage: true,
      controller: modalWindowController
    }));
  }

  return {
    show: show,

    /**
     * @ngdoc method
     * @name messageBox#showInfo
     *
     * @description Opens a new message box to present general
     * information.
     *
     * @param {object} options A hash supporting a subset of modalWindow options, along with:
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
     * @return {Object} A modalWindow instance.
     *
     */
    showInfo: function(options) {
      options = options || {};
      options.icon = 'svg-information';
      options.windowClass = 'information akam-message-box';
      return this.show(options, 'information');
    },

    /**
     * @ngdoc method
     * @name messageBox#showQuestion
     *
     * @description Opens a new message box that asks a question.
     *
     * @param {Object} options A hash of options detailed above in
     * `showInfo()`
     *
     * @return {Object} A modalWindow instance.
     *
     */
    showQuestion: function(options) {
      options = options || {};
      options.icon = 'svg-question';
      options.windowClass = 'question akam-message-box';
      return this.show(options, 'question');
    },

    /**
     * @ngdoc method
     * @name messageBox#showError
     *
     * @description Opens a new message box to acknowledge errors.
     *
     * @param {Object} options A hash of options detailed below in
     * `showInfo()`
     *
     * @return {Object} A modalWindow instance
     *
     */
    showError: function(options) {
      options = options || {};
      options.icon = 'svg-error';
      options.windowClass = 'error akam-message-box';
      return this.show(options, 'error');
    }
  };
};
module.exports.$inject = ['modalWindow', 'translate', '$rootScope'];
