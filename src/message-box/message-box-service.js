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

    $translate(titleId, options.titleValues)
      .then(value => options.title = value);

    $translate(cancelId, options.cancelLabelValues)
      .then(value => options.cancelLabel = value);

    $translate(submitId, options.submitLabelValues)
      .then(value => options.submitLabel = value);

    $translate(options.headline, options.headlineValues)
      .then(value => options.contentScope.messageBox.headline = value);

    $translate(options.text, options.textValues)
      .then(value => options.contentScope.messageBox.text = value);
  }

  function show(options, type) {
    if (options.headline == null) {
      throw new Error('headline option is required');
    }

    if (options.text == null) {
      throw new Error('text option is required');
    }

    options.backdrop = 'static';
    options.scope = $rootScope.$new();
    options.scope.messageBox = {
      headline: options.headline,
      text: options.text,
      details: options.details
    };

    translateOptionLabels(options, type);

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
     *   box. Recommended to limit headline to 25 characters.
     *
     * - `text` (string) A required message. Recommended to limit text to 220
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
