'use strict';

var template = require('./currentAccount.hbs');
var selector = '#modular-mega-menu-header .account-selector';

/**
 * @ngdoc object
 * @name menu.currentAccount
 */
module.exports = {
  /**
   * @ngdoc property
   * @name menu.currentAccount.selector
   * @propertyOf menu.currentAccount
   * @description
   * DOM selector for the current account dropdown
   */
  selector: selector,

  /**
   * @ngdoc property
   * @name menu.currentAccount.template
   * @propertyOf menu.currentAccount
   * @description
   * Template for the current account dropdown
   */
  template: template
};
