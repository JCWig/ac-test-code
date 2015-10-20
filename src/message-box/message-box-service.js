import angular from 'angular';
import template from './templates/message-box.tpl.html';

function messageBox(modalWindow, $translate, $rootScope) {

  function modalWindowController($scope) {
    let collapsed = true;

    $scope.toggle = function() {
      collapsed = !collapsed;
    };

    $scope.isCollapsed = function() {
      return collapsed;
    };
  }

  modalWindowController.$inject = ['$scope'];

  /**
   * translateOptionLabels translate title, cancelLabel and submitLabel text
   * @param  {object} options contains properties that may require translation
   * @param  {string} type title type as information, error, question
   */
  function translateOptionLabels(options, type) {
    let titleId, cancelId, submitId;

    switch (type) {
      case 'information':
        titleId = options.title || 'components.message-box.title.information';
        break;
      case 'question':
        titleId = options.title || 'components.message-box.title.question';
        break;
      case 'error':
        titleId = options.title || 'components.message-box.title.error';
        break;
      default:
        titleId = options.title || 'components.message-box.title.information';
    }

    cancelId = options.cancelLabel || 'components.message-box.no';
    submitId = options.submitLabel || 'components.message-box.yes';

    options.title = $translate.instant(titleId, options.titleValues);
    options.cancelLabel = $translate.instant(cancelId, options.cancelLabelValues);
    options.submitLabel = $translate.instant(submitId, options.submitLabelValues);
  }

  function show(options, type) {
    if (options.headline == null) {
      throw new Error('headline option is required');
    }

    if (options.text == null) {
      throw new Error('text option is required');
    }

    translateOptionLabels(options, type);

    options.title = options.title.substr(0, 20);
    options.backdrop = 'static';
    options.scope = $rootScope.$new();
    options.scope.messageBox = {
      headline: options.headline.substr(0, 48),
      text: options.text.substr(0, 220),
      details: options.details
    };

    return modalWindow.open(angular.extend(options, {
      template: template,
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
     * - `hideSubmit` (boolean) Optional A flag to hide the submit button and only allow
     *    the message box to be dismissed.
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
}

messageBox.$inject = ['modalWindow', '$translate', '$rootScope'];

export default messageBox;
