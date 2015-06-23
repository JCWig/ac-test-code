'use strict';

var template = require('./user.hbs');
var selector = '#modular-mega-menu-header .akam-user';

/**
 * @ngdoc object
 * @name menu.user
 */
module.exports = {
  /**
   * @ngdoc property
   * @name menu.user.selector
   * @propertyOf menu.user
   * @description
   * DOM selector for the user info box in the top most nav
   */
  selector: selector,

  /**
   * @ngdoc property
   * @name menu.user.template
   * @propertyOf menu.user
   * @description
   * Template for the user info box.
   */
  template: template
};
