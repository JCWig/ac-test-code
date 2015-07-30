var template = require('./tabs.hbs');

var selector = '#modular-mega-menu-header .tabs';

/**
 * @name menu.tabs
 */
module.exports = {
  /**
   * @name menu.tabs.selector
   * @propertyOf menu.tabs
   * @description
   * DOM selector for the mega menu tabs
   */
  selector: selector,

  /**
   * @name menu.tabs.template
   * @propertyOf menu.tabs
   * @description
   * Template for the mega menu tabs
   */
  template: template
};
