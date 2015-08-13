import angular from 'angular';
import cookies from 'angular-cookies';
import contextProvider from './context-provider';

/**
 * @ngdoc module
 * @name akamai.components.context
 * @requires ngCookies
 * @description a module that handles the various context switching methods in the portal.
 * For this version, we only handle group context switching.
 */
export default angular.module('akamai.components.context', [
  cookies
])

/**
 * @name LUNA_GROUP_QUERY_PARAM
 * @description Constant value representing the query parameter that should be sent to set the
 * group ID.
 */
  .constant('LUNA_GROUP_QUERY_PARAM', 'gid')

/**
 * @name LUNA_ASSET_QUERY_PARAM
 * @description Constant value representing the query parameter that should be sent to set the
 * asset (property) ID.
 */
  .constant('LUNA_ASSET_QUERY_PARAM', 'aid')

/**
 * @ngdoc provider
 * @name contextProvider
 * @description A injectable object that is used to get and set account, group and property
 * information in a Luna application. The provider is used to configure how the application will
 * behave with respect to Luna groups and properties. This is also used for applications that are
 * deployed outside of Luna. The default application type is `contextProvider.ACCOUNT_CONTEXT`.
 *
 * **Unit Testing**
 *
 * When unit testing, you may run into issues with unexpected HTTP requests being made and tests
 * failing. This is because the context component does some things auto-magically depending on what
 * context you define. Test modules should be defined to have the OTHER_CONTEXT. This can be
 * accomplished with the following snippet being placed inside a `beforeEach` block.
 *
 * <pre>
 * angular.mock.module(function(contextProvider) {
 *   contextProvider.setApplicationContext(contextProvider.OTHER_CONTEXT);
 * });
 * </pre>
 */

/**
 * @ngdoc method
 * @name contextProvider#setApplicationContext
 * @description Method to set the application context. It should be one of
 * `contextProvider.GROUP_CONTEXT`, `contextProvider.ACCOUNT_CONTEXT` or
 * `contextProvider.OTHER_CONTEXT`
 * @param {String} value The new type for this application.
 */

/**
 * @ngdoc property
 * @name contextProvider#GROUP_CONTEXT
 * @description Value for an application that is group aware. Applications that are group aware
 * must have a "gid" query parameter in all of their routes. Otherwise, an exception will be
 * thrown. Changes to this query parameter will change the current group. Also, any APIs that are
 * not in the {@link akamai.components.auth auth} blacklist will automatically have a "gid" and
 * "aid" query parameter appended to the request.
 * @type {String}
 */

/**
 * @ngdoc property
 * @name contextProvider#ACCOUNT_CONTEXT
 * @description Value for an application that does not care about groups, but exists in Luna.
 * Applications that set this value do not need the "gid" query parameter. The Mega Menu will not
 * render the breadcrumb trail. Note, that since this behaves independently from the auth module,
 * any API request that is not in the blacklist will still get "gid" and "aid" query parameters
 * added to the request.
 * @type {String}
 */

/**
 * @ngdoc property
 * @name contextProvider#OTHER_CONTEXT
 * @description Value for an application that is outside of Luna. This is used to prevent code
 * from running that doesn't make sense from outside of Luna. For example, this disables inclusion
 * of Google Analytics code, which is used for tracking purposes in Luna.
 * @type {String}
 */

/**
 * @ngdoc service
 * @requires $injector
 * @requires $q
 * @requires $window
 * @requires $cookies
 * @id contextService
 * @name context
 * @description This service is primarily used to get and set information about the current
 * group and property. This allows for applications to change group or property information without
 * having to reload the page. It will also, under the hood, handle making the calls necessary to
 * switch the current group or property from a Luna perspective.
 *
 * **General Usage**
 *
 * Typically, group or property information is fetched like the following:
 *
 * ```
 * context.group.then((group) => {
 *   // this callback has the current group information, including `id`, `name`, `parent`,
 *   // `parents`, `children` and `properties`
 * });
 * ```
 *
 * Property information is fetched in a similar fashion:
 *
 * ```
 * context.property.then((property) => {
 *   // this callback has information about the current property, including `id`, `name` and
 *   // `group`
 * });
 * ```
 *
 * Changing the current group or property is done by setting `context.group` or `context.property`
 * and providing the new group or property ID, which is a number.
 *
 * ```
 * // this will change the group to one with ID of 123
 * context.group = 123;
 * ```
 *
 * When either a group or a property is changed, the URL hash will be updated to reflect the
 * change. This allows for group aware applications to have more portable URLs. This implies that
 * group aware applications must include "gid" and "aid" as query parameters in their router
 * configuration. For example, if an application is using ui-router, the configuration should
 * have something of the form: `/myRoute?gid&aid` in the `url` field of the state configuration.
 */

/**
 * @ngdoc property
 * @name contextService#account
 * @description Gets or sets the current account. Currently, setting the account doesn't cause
 * anything special to happen on the backend. The Mega Menu will set the account on page load, by
 * reading the AKALASTMANAGED account cookie, so there is little reason for applications to change
 * this property at all. However, this is provided as a means to fetch information about the
 * current account if, needed. The account object has the following properties:
 *
 * - **id** - `String` - The account ID.
 * - **name** - `String` - The account name. Includes the current contract name separated by a
 * underscore.
 * - **cookieValue** - `String` - The raw, base64 encoded, cookie value. Includes the contract and
 * the ID.
 *
 * @type {Object} The account object
 */

/**
 * @ngdoc property
 * @name contextService#group
 * @description Gets or sets information about the current group. See above for usage. A Luna group
 * has the following properties:
 *
 * - **id** - `{Number}` - The ID for this group.
 * - **name** - `{String}` - The name for this group.
 * - **properties** - `{Object[]}` - An array of property objects that are contained within this
 * group. Only returns direct children.
 * - **parent** - `{Object}` - The object representing the parent for this group.
 * - **parents** - `{Object[]}` - An array of all parent groups. The first item in the array is
 * the immediate parent for the group. The last item in the array is the root node.
 * - **children** - `{Object[]}` - An array of all the child sub-groups for this group.
 *
 * @type {HttpPromise}
 */

/**
 * @ngdoc property
 * @name contextService#property
 * @description Gets or sets information about the current property. See above for usage. A Luna
 * property object has the following properties
 *
 * - **id** - `{Number}` - The ID for this property.
 * - **name** - `{String}` - The name of this property.
 * - **group** - `{Object}` - The object representing the group that this property belongs to.
 *
 * @type {HttpPromise}
 */

/**
 * @ngdoc method
 * @name contextService#isGroupContext
 * @description
 * Convenience method to determine if this is a group aware application or not.
 *
 * @returns {Boolean} True if this application is "group" aware. False otherwise.
 */

/**
 * @ngdoc method
 * @name contextService#isAccountContext
 * @description
 * Convenience method to determine if this is a account aware application or not.
 *
 * @returns {Boolean} True if this application is "account" aware. False otherwise.
 */

/**
 * @ngdoc method
 * @name contextService#isOtherContext
 * @description
 * Convenience method to determine if this is neither group nor account aware (i.e. a non-Portal
 * application).
 *
 * @returns {Boolean} True if this application is of the "other" type.. False otherwise.
 */

/**
 * @ngdoc method
 * @name contextService#getAccountFromCookie
 * @description Parses the AKALASTMANAGEDACCOUNT cookie and returns the account object.
 * @returns {Object} the account object. Returns a null account object if the cookie doesn't exist.
 */

/**
 * @ngdoc method
 * @name contextService#accountChanged
 * @description Determines if the user has switched accounts.
 * @returns {Boolean} true if the account cookie has changed since the first time the account
 * object is set. Rendering the mega menu calls `getAccountFromCookie` if the application is
 * group or account aware.
 */

/**
 * @ngdoc method
 * @name contextService#resetAccount
 * @description Resets the current account to the initial account.
 * @returns {HttpPromise} A promise to change the account
 */
  .provider('context', contextProvider);