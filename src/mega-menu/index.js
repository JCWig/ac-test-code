var angular = require('angular'),
  contextModule = require('../context'),
  dataService = require('./mega-menu-data-service'),
  header = require('./mega-menu-header-directive'),
  footer = require('./mega-menu-footer-directive');

function run($rootScope, $window, context, LUNA_GROUP_QUERY_PARAM, LUNA_ASSET_QUERY_PARAM) {

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    var assetId;

    if (context.isGroupContext()) {
      if (!toParams[LUNA_GROUP_QUERY_PARAM]) {
        throw Error('Required query param "' + LUNA_GROUP_QUERY_PARAM + '" missing from URL');
      } else {
        assetId = $window.parseInt(toParams[LUNA_ASSET_QUERY_PARAM], 10);

        // set the property, which will implicitly set the group to the parent property for the
        // group this assumes that a property can only exist in one group. If that is not the case,
        // then the API will have to be adjusted to do lookups by both GID and AID.
        if (assetId) {
          context.property = assetId;
        } else {
          context.group = $window.parseInt(toParams[LUNA_GROUP_QUERY_PARAM], 10);
        }
      }
    }
  });

  if (!context.isOtherContext()) {
    require('./utils/ga');
    context.account = context.getAccountFromCookie();
  }
}
run.$inject = ['$rootScope', '$window', 'context',
  'LUNA_GROUP_QUERY_PARAM', 'LUNA_ASSET_QUERY_PARAM'];

/**
 * @ngdoc module
 * @name akamai.components.mega-menu
 * @requires akamai.components.context
 * @description a module for the old mega menu. Below is how you should structure your main file.
 *
 * @example index.html
 * <!DOCTYPE html>
 *   <html lang="en">
 *   <head>
 *     <base href="/apps/my-app-name/">
 *     <title>Luna Control Center</title>
 *     <meta charset="utf-8">
 *     <meta http-equiv="X-UA-Compatible" content="IE=edge">
 *     <meta name="viewport" content="width=device-width, initial-scale=1">
 *     <link rel="shortcut icon" type="image/x-icon"
 *        href="/totem/static/pulsar/megamenu/favicon.ico">
 *     <link rel="stylesheet" href="/totem/static/pulsar/megamenu/branding.css" />
 *     <link href="/libs/akamai-core/0.7.0/akamai-core.min.css" rel="stylesheet" />
 *     <link href="app.min.css" rel="stylesheet" />
 *   </head>
 * <body ng-app="akamai.my-app-name" translate-cloak ng-strict-di class="common-css luna">
 *
 *   <akamMenuHeader></akamMenuHeader>
 *
 *   <div class="container my-app-name">
 *     <div ui-view></div>
 *   </div>
 *
 *   <akamMenuFooter></akamMenuFooter>
 *
 *   <script src="/libs/akamai-core/0.7.0/akamai-core.js"></script>
 *   <script src="app.min.js"></script>
 * </body>
 * </html>
 *
 */
module.exports = angular.module('akamai.components.mega-menu', [
  contextModule.name
])
/**
 * @name megaMenuData
 * @description Private service. Used to fetch data needed to render the mega menu
 * @private
 */
  .service('megaMenuData', dataService)

/**
 * @ngdoc directive
 * @name akamMenuHeader
 * @restrict E
 * @description Renders the mega menu header
 */
  .directive('akamMenuHeader', header)

/**
 * @ngdoc directive
 * @name akamMenuFooter
 * @restrict E
 * @description Renders the mega menu footer
 */
  .directive('akamMenuFooter', footer)

/**
 * Tries to read the AKALASTMANAGEDACCOUNT cookie and set it as the current account. Also throws
 * an error if this application is group aware but doesn't provide a GID in the route params.
 */
  .run(run);
