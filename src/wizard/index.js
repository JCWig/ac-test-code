import angular from 'angular';
import angularBootstrap from 'angular-bootstrap-npm';
import statusMessage from '../status-message';
import i18n from '../i18n';
import wizardService from './wizard-service';
import wizardContentDirective from './wizard-content-directive';
import spinnerButton from '../spinner-button';

/**
 * @ngdoc module
 * @name akamai.components.wizard
 * @image wizard
 *
 * @requires module:angular-bootstrap-npm
 * @requires module:ngSanitize
 * @requires module:akamai.components.status-message
 * @requires module:akamai.components.i18n
 *
 * @description Wizard is a type of modal window that presents a user with a sequence of
 * dialog boxes that lead the user through a series of well-defined steps.
 * Tasks that are complex, infrequently performed, or unfamiliar may be easier to perform using
 * a wizard.
 *
 * @guideline Use wizards for muiltstep workflows that need to be displayed in isolation from
 * parent page.
 *
 * @example index.js
 * function MyController(wizard, translate) {
 *   wizard.open({
 *     scope: wizardScope,
 *     controller: WizardController,
 *     title: 'Wizard Example',
 *     steps: [
 *       {
 *         // Example of translated text for the wizard steps
 *         name: $translate.instant('examples.wizard.step1'),
 *         templateId: 'step1',
 *         validate: function(scope) {
 *             return true;
 *         }
 *       },
 *       {
 *         name: $translate.instant('examples.wizard.step2'),
 *         templateId: 'step2',
 *         validate: function(scope) {
 *             return true;
 *         }
 *       }
 *     ]
 *   });
 * }
 */
module.exports = angular.module('akamai.components.wizard', [
  angularBootstrap,
  statusMessage.name,
  i18n.name,
  spinnerButton.name
])

/**
 * @ngdoc service
 * @name akamai.components.wizard.service:wizard
 *
 * @description
 * A service that opens a wizard
 */
  .factory('wizard', wizardService)

/**
 * @private
 * @name akamai.components.wizard.directive:akamWizardContent
 * @description
 * A simple directive that injects step templates into the body of the wizard
 */
  .directive('akamWizardContent', wizardContentDirective);