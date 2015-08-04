var template = require('./currentAccount.hbs');
var selector = '#modular-mega-menu-header .account-selector';

/**
 * @name menu.currentAccount
 */
module.exports = {
  /**
   * @name menu.currentAccount.selector
   * @description
   * DOM selector for the current account dropdown
   */
  selector: selector,

  /**
   * @name menu.currentAccount.template
   * @description
   * Template for the current account dropdown
   */
  template: template
};
