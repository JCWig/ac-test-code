var VERSION = '0.7.1';

/**
 * @name utils.constants
 * @description
 * Collection of constants for this application
 */

module.exports = {
  /**
   * @name utils.constants.HIDE_CLASS
   * @propertyOf utils.constants
   * @description
   * Class name used to hide elements
   */
  HIDE_CLASS: 'util-hide',

  /**
   * @name utils.constants.SHOW_CLASS
   * @propertyOf utils.constants
   * @description
   * Class name used to show elements
   */
  SHOW_CLASS: 'util-show',

  /**
   * @name utils.constants.TIMEOUT_URL
   * @propertyOf utils.constants
   * @description
   * URL to navigate to when logging out because of an idle session timeout.
   */
  TIMEOUT_URL: '/EdgeAuth/login.jsp?reason=timeout',

  /**
   * @name utils.constants.TIMEOUT_URL
   * @propertyOf utils.constants
   * @description
   * URL to navigate to for logging in
   */
  LOGIN_URL: '/EdgeAuth/login.jsp',

  /**
   * @name utils.constants.VERSION
   * @propertyOf utils.constants
   * @returns {String} The current version number for this library.
   */
  VERSION: VERSION
};
