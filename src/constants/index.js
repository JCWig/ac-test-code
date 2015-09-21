import angular from 'angular';

//TODO: Remember to update this if the version in package.json ever changes
// Also remember to update mega-menu -> utils -> constants.js with the exact same info
export const VERSION = '0.9.1';

/**
 * @ngdoc module
 * @name akamai.components.constants
 *
 * @description Provides global injectable services used for both inside the akamai-core
 * and outside of its bundle.
 *
 */
export default angular.module('akamai.components.constants', [])

/**
 * @ngdoc service
 *
 * @name coreVersion
 *
 * @description The version string value for core component
 *
 * An example of usage from outside bundle like example app:
 * angular.module('spinner-button', ['akamai.components', 'akamai.components.spinner-button']);
 * configFunction.$inject = ['$translatePartialLoaderProvider', 'coreVersion'];
 * function configFunction($translatePartialLoaderProvider, VERSION) {...
 *   ...
 *   $translatePartialLoaderProvider.addPart('/libs/akamai-core/'+VERSION+'/locales/');
 *   ...
 * }
 *
 */
.constant('AKAMAI_CORE_VERSION', VERSION);
