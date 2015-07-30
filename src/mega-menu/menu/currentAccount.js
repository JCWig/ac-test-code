var template = require('./currentAccount.hbs');
var selector = '#modular-mega-menu-header .account-selector';

/**
 * @name menu.currentAccount
 */
module.exports = {
  /**
   * @name menu.currentAccount.selector
   * @propertyOf menu.currentAccount
   * @description
   * DOM selector for the current account dropdown
   */
  selector: selector,

  /**
   * @name menu.currentAccount.template
   * @propertyOf menu.currentAccount
   * @description
   * Template for the current account dropdown
   */
  template: template
};
