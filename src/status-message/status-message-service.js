var angular = require('angular');

module.exports = function($document, $compile, $rootScope) {

  var body = $document.find('body').eq(0),
    items = [],
    itemCount = 0,
    initialized = false;

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
  }

  return {
    /**
     * @ngdoc method
     * @name statusMessage#show
     * @description goes here
     */
    show: function(options) {
      return this.showSuccess(options);
    },

    /**
     * @ngdoc method
     * @name statusMessage#showSuccess
     * @description goes here
     */
    showSuccess: function(options) {
      return show(angular.extend({}, options || {}, {status: 'success'}));
    },

    /**
     * @ngdoc method
     * @name statusMessage#showInformation
     * @description goes here
     */
    showInformation: function(options) {
      return show(angular.extend({}, options || {}, {status: 'information'}));
    },

    /**
     * @ngdoc method
     * @name statusMessage#showError
     * @description goes here
     */
    showError: function(options) {
      // errors must be closed, therefore set timeout to 0
      return show(angular.extend({}, options || {}, {timeout: 0, status: 'error'}));
    },

    /**
     * @ngdoc method
     * @name statusMessage#showWarning
     * @description goes here
     */
    showWarning: function(options) {
      return show(angular.extend({}, options || {}, {timeout: 0, status: 'warning'}));
    }
  };
};
module.exports.$inject = ['$document', '$compile', '$rootScope'];
