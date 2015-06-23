'use strict';

var querystring = require('querystring'),
  angular = require('angular');

// static list of contexts that can  be applied to an application. It may be group or account
// aware.
var APP_CONTEXTS = {
  account: 'account',
  group: 'group',
  standalone: 'standalone'
},
  ACCOUNT_COOKIE = 'AKALASTMANAGEDACCOUNT',
  GID_STORAGE_KEY = 'akamai.components.context.groupId',
  AID_STORAGE_KEY = 'akamai.components.context.assetId',
  CHANGED_EVENT = 'akamai.components.context.changed',
  LOADED_EVENT = 'akamai.components.context.loaded',
  GROUPS_URL = '/ui/services/nav/megamenu/ccare2/context.json',
  CHANGE_GROUP_URL = '/core/services/session/username/extend',
  GID_QUERY_PARAM = 'gid',
  AID_QUERY_PARAM = 'aid';

module.exports = function ContextProvider() {

  // sets the application context type. Some applications care about groups and some do not
  var applicationType = APP_CONTEXTS.account, currentAccount, groups, rawContext;

  /**
   * Sets the application context to be either account centric or group centric.
   * @param {String} newType Should be 'account', 'group' or 'standalone' (for non luna apps).
   */
  this.setApplicationContext = function(newType) {

    if (APP_CONTEXTS[newType]) {
      applicationType = APP_CONTEXTS[newType];
    }

  };

  /* @ngInject */
  this.$get = function Context($rootScope, $injector, $window, $location, $cookies) {

    return {
      getApplicationContext: getApplicationContext,
      setContextId: setContextId,
      getContextForAccount: getContextForAccount,
      getGroupInfo: getGroupInfo,
      getGroupId: getGroupId,
      getAssetId: getAssetId,
      accountChanged: accountChanged,
      setAccountCookie: setAccountCookie,
      setContextIdFromUrl: setContextIdFromUrl,
      GID_QUERY_PARAM: GID_QUERY_PARAM,
      APP_CONTEXTS: APP_CONTEXTS
    };

    /**
     * Returns the current group with parent and children info attached.
     * @returns {GroupInfo} The current group with `title`, `id`, `parents`, and `children` keys.
     */
    function getGroupInfo() {
      return findGroupInfoById(getGroupId(), getAssetId());
    }

    /**
     * Fetches the current group ID
     * @returns {Number} the current group ID. Returns undefined if it doesn't exist.
     */
    function getGroupId() {
      return parseInt($window.sessionStorage.getItem(GID_STORAGE_KEY), 10) || undefined;
    }

    /**
     * Fetches the current asset ID
     * @returns {Number} the current asset ID or undefined if it doesn't exist.
     */
    function getAssetId() {
      return parseInt($window.sessionStorage.getItem(AID_STORAGE_KEY), 10) || undefined;
    }

    /**
     * Results of calling context.json.
     * @returns {Object} The raw JSON response from fetching context.json
     */
    function getContextForAccount() {
      return rawContext;
    }

    /**
     * Sets the new group and asset IDs. Notifies the mega menu so it will update the breadcrumb.
     * Call with no arguments to unset both values.
     * @param {Number} [gid] the new group ID.
     * @param {Number} [aid] the new asset ID
     */
    function setContextId(gid, aid) {
      var group = findGroupInfoById(gid, aid),
        gidChanged = angular.isDefined(gid) && gid !== getGroupId(),
        aidChanged = angular.isDefined(aid) && aid !== getAssetId(),
        $http = $injector.get('$http');

      if (gidChanged || aidChanged) {
        $http.get(CHANGE_GROUP_URL);
      }

      $location.search(GID_QUERY_PARAM, gid);
      $location.search(AID_QUERY_PARAM, aid);

      $window.sessionStorage.setItem(GID_STORAGE_KEY, gid);
      $window.sessionStorage.setItem(AID_STORAGE_KEY, aid);

      $rootScope.$broadcast(CHANGED_EVENT, group);
    }

    /**
     * Meant to be called as an init method. Shouldn't be used directly by consumers of this
     * module.
     */
    function setContextIdFromUrl() {
      var qs = $location.search();

      // setting the breadcrumb trail to null will cause the mega menu to hide the breadcrumbs
      if (applicationType === APP_CONTEXTS.account) {
        setContextId();
      } else if (!qs[GID_QUERY_PARAM]) {
        setContextId();
        throw Error('Required query param "' + GID_QUERY_PARAM + '" missing from URL');
      }

      fetchGroupContext()
        .then(function(data) {
          var gid = parseInt(qs[GID_QUERY_PARAM], 10) || undefined,
            aid = parseInt(qs[AID_QUERY_PARAM], 10) || undefined;

          rawContext = data.data;
          groups = parseGroups(data.data.context.mainMenuItems);
          setContextId(gid, aid);
        });
    }

    /**
     * Gets the application context type
     * @returns {string} Usually either 'account' or 'group'
     */
    function getApplicationContext() {
      return applicationType;
    }

    /**
     * Determines if we have switched accounts
     * @returns {boolean} true if the account cookie has changed since `setAccountCookie` was
     * last called.
     */
    function accountChanged() {
      return $cookies.get(ACCOUNT_COOKIE) !== currentAccount;
    }

    /**
     * Sets the initial account from the AKALASTMANAGEDACCOUNT cookie. This includes the account
     * name and the account ID separated by a double tilde "~~". The whole string is base64
     * encoded. This will also fetch the group context tree since it is possible that the
     * account has been changed.
     */
    function setAccountCookie() {
      currentAccount = $cookies.get(ACCOUNT_COOKIE);
    }

    // ------------ utility methods below ------------

    // returns the group hierarchy for a given GID. Includes parents and children.
    function findGroupInfoById(gid, aid) {

      if (!gid || !groups) {
        return null;
      }

      return groups.filter(function(group) {
        if (angular.isDefined(aid)) {
          return group.gid === gid && group.aid === aid;
        }
        return group.gid === gid && angular.isUndefined(group.aid);
      })[0];
    }

    function fetchGroupContext() {
      // prevent a circular reference in the auth component
      var $http = $injector.get('$http');

      return $http.get(GROUPS_URL)
        .then(notifyMegaMenu);
    }

    function notifyMegaMenu(data) {
      $rootScope.$broadcast(LOADED_EVENT, data.data);
      return data;
    }

    // converts the absolute mess that is the context.json call into a flat list with parent
    // and child pointers so we can search it much more easily
    function parseGroups(items, parent) {
      var i, item, group, children, makeGroup, totalItems = [];

      // simple factory method to create a group
      makeGroup = function(parentGroup, data) {
        var gid = data.itemId, qs, aid;

        if (data.itemId === 0) {
          qs = querystring.parse(data.url.split('?')[1]);
          aid = parseInt(qs[AID_QUERY_PARAM], 10) || undefined;
          gid = parseInt(qs[GID_QUERY_PARAM], 10) || undefined;
        }
        return new GroupInfo(gid, aid, data.contextId, data.name, parentGroup, null, data.dps);
      };

      for (i = 0; i < items.length; i++) {
        item = items[i];
        group = makeGroup(parent, item);

        children = (item.subMenuItems || [])
          .map(angular.bind(this, makeGroup, group));

        group.children = children;
        totalItems.push(group);

        if (item.subMenuItems && item.subMenuItems.length) {
          totalItems = totalItems.concat(parseGroups(item.subMenuItems, group));
        }
      }
      return totalItems;
    }

  };

};

/**
 * Object to hold group info. Could be a group or a property.
 * @param {Number} gid the group id. Should always exist.
 * @param {Number|undefined} aid the asset id. Will be undefined if this really is a group.
 * @param {Number} contextId Identifier for this item. 0 for group, anything else for property
 * @param {String} title the name of this group
 * @param {GroupInfo} parent pointer to the parent. Null if the top level group.
 * @param {GroupInfo[]} children array of children groups
 * @param {String[]} properties list of digital properties
 * @constructor
 */
function GroupInfo(gid, aid, contextId, title, parent, children, properties) {
  this.gid = gid;
  this.aid = aid;
  this.contextId = contextId;
  this.title = title;
  this.parent = parent;
  this.children = children;
  this.properties = properties;

  this.isProperty = function() {
    return this.contextId !== 0;
  };
}