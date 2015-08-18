var template = require('./tabs.hbs');

var selector = '#modular-mega-menu-header .tabs';

/**
 * @name menu.tabs
 */
module.exports = {
  /**
   * @name menu.tabs.selector
   * @description
   * DOM selector for the mega menu tabs
   */
  selector: selector,

  /**
   * @name menu.tabs.template
   * @description
   * Template for the mega menu tabs
   */
  template: template
};
