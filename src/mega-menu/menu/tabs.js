var template = require('./tabs.hbs');

var selector = '#modular-mega-menu-header .tabs';

/**
 * @ngdoc object
 * @name menu.tabs
 */
module.exports = {
  /**
   * @ngdoc property
   * @name menu.tabs.selector
   * @propertyOf menu.tabs
   * @description
   * DOM selector for the mega menu tabs
   */
  selector: selector,

  /**
   * @ngdoc property
   * @name menu.tabs.template
   * @propertyOf menu.tabs
   * @description
   * Template for the mega menu tabs
   */
  template: template
};
