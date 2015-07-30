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
    show: function(options) {
      return this.showSuccess(options);
    },

    showSuccess: function(options) {
      return show(angular.extend({}, options || {}, {status: 'success'}));
    },

    showInformation: function(options) {
      return show(angular.extend({}, options || {}, {status: 'information'}));
    },

    showError: function(options) {
      // errors must be closed, therefore set timeout to 0
      return show(angular.extend({}, options || {}, {timeout: 0, status: 'error'}));
    },

    showWarning: function(options) {
      return show(angular.extend({}, options || {}, {timeout: 0, status: 'warning'}));
    }
  };
};
module.exports.$inject = ['$document', '$compile', '$rootScope'];