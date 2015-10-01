import angular from 'angular';
import router from 'angular-ui-router';
import i18n from '../i18n';

import tabsDirective from './tabs-directive';
import tabDirective from './tab-directive';

/**
 * @ngdoc module
 * @name akamai.components.tabs
 * @requires ui-router
 * @image navigation
 *
 * @description Provides a directive that creates a Pulsar-compatible tabbed navigation component.
 * This component allows for either inline declarative tab content or tab content tied to routing.
 *
 * @example app.js - with routing
 * function configFunction($stateProvider) {
 *
 *   $stateProvider.state('tabs', {
 *     url:         '/',
 *     controller: 'TabsController',
 *     controllerAs: 'tabs',
 *     templateUrl: 'tabs/tabs.html'
 *   }).state('tabs.tab1', {
 *     url:  'tab1',
 *     templateUrl: 'tabs/tab1.html'
 *   }).state('tabs.tab2', {
 *     url: 'tab2',
 *     templateUrl: 'tabs/tab2.html'
 *   }).state('tabs.tab3', {
 *     url:         'tab3',
 *     templateUrl: 'tabs/tab3.html'
 *   });
 * }
 *
 * @example tabs.html - with routing
 * <akam-tabs routable>
 *   <akam-tab heading="Tab 1" state="tabs.tab1"></akam-tab>
 *   <akam-tab heading="Tab 2" state="tabs.tab2"></akam-tab>
 *   <akam-tab heading="Tab 3" state="tabs.tab3"></akam-tab>
 * </akam-tabs>
 *
 * @example tabs.html - without routing
 * <akam-tabs>
 *   <akam-tab heading="Tab 1" active="true">
 *     <p>Tab 1 Content</p>
 *   </akam-tab>
 *   <akam-tab heading="Tab 2">
 *     <p>Tab 2 Content</p>
 *   </akam-tab>
 *   <akam-tab heading="Tab 3">
 *     <p>Tab 3 Content</p>
 *   </akam-tab>
 * </akam-tabs>
 *
 */
export default angular.module('akamai.components.tabs', [
  router,
  i18n.name
])

/**
 * @ngdoc directive
 * @name akamTabs
 * @restrict E
 *
 * @description Creates a tabs control
 *
 * @param {*} [routable] Whether tabs are integrated with routing. If routable is defined tabs must
 * define a route attribute. Routing is turned off by default.
 *
 * @param {*} [secondary] Whether the tabs are secondary. Tabs are primary by default.
 *
 * @param {*} [vertical] Whether tabs are displayed vertically. Tabs are horizontal by default.
 *
 */
  .directive('akamTabs', tabsDirective)

/**
 * @ngdoc directive
 * @name akamTab
 * @restrict E
 *
 * @description Creates a tab control
 *
 * @param {String} [heading] The heading for the tab - i18n is supported for this property. If
 * a key is passed to heading, it will be translated.
 *
 * @param {String} [state] If the tabs are routable, the state must be defined for each tab.
 *
 * @param {Object} [state-params] If the tabs are routable, these are url params sent to
 * ui-router for the state (optional).
 *
 * @param {Object} [state-options] If the tabs are routable, these are the state options (optional).
 * Available options can be found here:
 * https://github.com/angular-ui/ui-router/wiki/Quick-Reference#stategoto--toparams--options
 *
 * @param {Boolean} [active=false] If the tab is active. If none of the tabs are active, the
 * the first tab will be activated by default. Note: This attribute must not be set on routable
 * tabs. For routable tabs, the active state is determined by the current route state of the
 * application.
 *
 * @param {Boolean} [disabled=false] If the tab is disabled.
 *
 */
  .directive('akamTab', tabDirective);