var angular = require('angular');

/**
 * @ngdoc overview
 * @name akamai.components
 *
 * @description UI Core Components have been enhanced with small but significant interaction
 * + visual changes and rewritten using the modern front end technology stack selected for
 * Project Pular.  This first release includes 21 components in 5 categories:
 *   * Navigational components provide ways to get around in the interface
 *   * Input Components provide controls to enter information and make selections
 *   * Informational Components give the user feedback and guidance
 *   * Content Containers structure data and present application content
 * We look forward to growing and evolving the component roster.
 */
angular.module('akamai.components', [
  require('./uuid').name,
  require('./i18n').name,
  require('./indeterminate-progress').name,
  require('./content-panel').name,
  require('./menu-button').name,
  require('./modal-window').name,
  require('./message-box').name,
  require('./status-message').name,
  require('./date-picker').name,
  require('./pagination').name,
  require('./list-box').name,
  require('./table').name,
  require('./spinner').name,
  require('./utils').name,
  require('./switch-button').name,
  require('./popover').name,
  require('./tree-view').name,
  require('./time-picker').name,
  require('./tag-input').name,
  require('./dropdown').name,
  require('./auth').name,
  require('./autocomplete').name,
  require('./mega-menu').name,
  require('./wizard').name,
  require('./date-range').name,
  require('./navigation').name
]);
