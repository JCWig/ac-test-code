import angular from 'angular';

const items = [];

class StatusMessageService {
  constructor($document, $compile, $rootScope) {
    this.$document = $document;
    this.$compile = $compile;
    this.$rootScope = $rootScope;

    this.body = this.$document.find('body').eq(0);
    this.initialized = false;
    this.itemCount = 0;
  }

  /**
   * @name initializeStatusMessageGroup
   * @public (supposed to be private)
   * @description A check to make sure we have something to wrap our status messages with
   * @return {boolean} true
   */
  initializeStatusMessageGroup() {
    let scope = this.$rootScope.$new(),
      wrapper = this.$compile('<akam-status-message-group></akam-status-message-group>')(scope);

    this.body.prepend(wrapper);
    return true;
  }

  getItems() {
    return items;
  }

  /**
   * @name clear
   * @description Removes all the messages showing
   */
  clear() {
    items.splice(0);
  }

  /**
   * @name remove
   * @description Removes the message with the specified itemId from the list of messages
   * @param {string} itemId the id of the item to be removed
   * @return {Number} the index of the message removed. -1 if the message could not be found
   */
  remove(itemId) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].itemId === itemId) {
        items.splice(i, 1);
        return i;
      }
    }

    return -1;
  }

  /**
   * @name showMessage
   * @public (supposed to be private)
   * @param {object} [options] A hash with the options specified below.
   * @description adds option info to the items
   * @return {String} message id
   */
  showMessage(options) {
    if (!this.initialized) {
      this.initialized = this.initializeStatusMessageGroup();
    }
    this.itemCount++;
    options.itemId = 'akam-status-message-' + this.itemCount;
    items.push(options);
    return options.itemId;
  }

  /**
   * @ngdoc method
   * @name statusMessage#show
   * @description shows a success message to the end user. This is an alias for showSuccess
   * @param {object} [options] A hash with the options specified below.
   * @param {string} [options.text=''] The text content to show within the status message
   * @param {string} [options.title=''] The title content to show within the status message
   * @param {number} [options.timeout=2000] The time (in ms) before the status message removes
   * itself from being shown.  *Note: Use timeout = 0 to force the user to close the message.*
   * @returns {string} id of status message being shown on the screen
   */
  show(options) {
    return this.showSuccess(options);
  }

  /**
   * @ngdoc method
   * @name statusMessage#showSuccess
   * @description shows a success message to the end user
   * @param {object} [options] A hash with the options specified below.
   * @param {string} [options.text=''] The text content to show within the status message
   * @param {string} [options.title=''] The title content to show within the status message
   * @param {number} [options.timeout=2000] The time (in ms) before the status message removes
   * itself from being shown.  *Note: Use timeout = 0 to force the user to close the message.*
   * @returns {string} id of status message being shown on the screen
   */
  showSuccess(options) {
    return this.showMessage(angular.extend({}, options || {}, {
      status: 'success'
    }));
  }

  /**
   * @ngdoc method
   * @name statusMessage#showInformation
   * @description shows an informational message to the end user
   * @param {object} [options] A hash with the options specified below.
   * @param {string} [options.text=''] The text content to show within the status message
   * @param {string} [options.title=''] The title content to show within the status message
   * @param {number} [options.timeout=2000] The time (in ms) before the status message removes
   * itself from being shown.  *Note: Use timeout = 0 to force the user to close the message.*
   * @returns {string} id of status message being shown on the screen
   */
  showInformation(options) {
    return this.showMessage(angular.extend({}, options || {}, {
      status: 'information'
    }));
  }

  /**
   * @ngdoc method
   * @name statusMessage#showError
   * @description shows an error message to the end user. *Note: The message must be closed by
   * the end user as there is no allowed timeout.*
   * @param {object} [options] A hash with the options specified below.
   * @param {string} [options.text=''] The text content to show within the status message
   * @param {string} [options.title=''] The title content to show within the status message
   * @returns {string} id of status message being shown on the screen
   */
  showError(options) {
    // errors must be closed, therefore set timeout to 0
    return this.showMessage(angular.extend({}, options || {}, {
      timeout: 0,
      status: 'error'
    }));
  }

  /**
   * @ngdoc method
   * @name statusMessage#showWarning
   * @description shows a warning message to the end user. *Note: The message must be closed by
   * the end user as there is no allowed timeout.*
   * @param {object} [options] A hash with the options specified below.
   * @param {string} [options.text=''] The text content to show within the status message
   * @param {string} [options.title=''] The title content to show within the status message
   * @returns {string} id of status message being shown on the screen
   */
  showWarning(options) {
    return this.showMessage(angular.extend({}, options || {}, {
      timeout: 0,
      status: 'warning'
    }));
  }
}

function statusMessageService($document, $compile, $rootScope) {
  return new StatusMessageService($document, $compile, $rootScope);
}

statusMessageService.$inject = ['$document', '$compile', '$rootScope'];
export default statusMessageService;
