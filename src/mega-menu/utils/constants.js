var VERSION = '0.8.1';

/**
 * @name utils.constants
 * @description
 * Collection of constants for this application
 */

module.exports = {
  /**
   * @name utils.constants.HIDE_CLASS
   * @description
   * Class name used to hide elements
   */
  HIDE_CLASS: 'util-hide',

  /**
   * @name utils.constants.SHOW_CLASS
   * @description
   * Class name used to show elements
   */
  SHOW_CLASS: 'util-show',

  /**
   * @name utils.constants.TIMEOUT_URL
   * @description
   * URL to navigate to when logging out because of an idle session timeout.
   */
  TIMEOUT_URL: '/EdgeAuth/login.jsp?reason=timeout',

  /**
   * @name utils.constants.TIMEOUT_URL
   * @description
   * URL to navigate to for logging in
   */
  LOGIN_URL: '/EdgeAuth/login.jsp',

  /**
   * @name utils.constants.VERSION
   * @returns {String} The current version number for this library.
   */
  VERSION: VERSION
};
