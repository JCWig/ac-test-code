var angular = require('angular');

module.exports = function($document, $compile, $rootScope) {

  var body = $document.find('body').eq(0),
    items = [],
    itemCount = 0,
    initialized = false,
    removeItemByItemId;

  /**
   * @name initializeStatusMessageGroup
   * @private
   * @description A check to make sure we have something to wrap our status messages with
   * @return {boolean} true
   */
  function initializeStatusMessageGroup() {
    var scope = $rootScope.$new(),
      wrapper;

    scope.items = items;
    wrapper =
      $compile('<akam-status-message-group items="items"></akam-status-message-group>')(scope);
    body.prepend(wrapper);
    return true;
  }

  function show(options) {
    if (!initialized) {
      initialized = initializeStatusMessageGroup();
    }
    options = options;
    itemCount++;
    options.itemId = 'akam-status-message-' + itemCount;
    items.push(options);
    return options.itemId;
  }

  function clear(itemId) {
    var i;

    if (!angular.isDefined(itemId)) {
      items.splice(0);
    } 
    else {
      for (i = 0; i < items.length; i++) {
        if (items[i].itemId === itemId) {
          items.splice(i, 1);
          return;
        }
      }
    }
  }

  return {
    clear : clear,

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
    show: function(options) {
      return this.showSuccess(options);
    },

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
    showSuccess: function(options) {
      return show(angular.extend({}, options || {}, {status: 'success'}));
    },

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
    showInformation: function(options) {
      return show(angular.extend({}, options || {}, {status: 'information'}));
    },

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
    showError: function(options) {
      // errors must be closed, therefore set timeout to 0
      return show(angular.extend({}, options || {}, {timeout: 0, status: 'error'}));
    },

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
    showWarning: function(options) {
      return show(angular.extend({}, options || {}, {timeout: 0, status: 'warning'}));
    }
  };
};
module.exports.$inject = ['$document', '$compile', '$rootScope'];
