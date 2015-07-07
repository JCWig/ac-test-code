'use strict';

var querystring = require('querystring'),
  angular = require('angular');

// static list of contexts that can  be applied to an application. It may be group or account
// aware.
var APP_CONTEXTS = {
  account: 'account',
  group: 'group',
  other: 'other'
},
  // This includes the account name and the account ID, concatenated with the contract name,
  // separated by a double tilde "~~". The whole string is base64 encoded.
  ACCOUNT_COOKIE = 'AKALASTMANAGEDACCOUNT',
  GROUPS_URL = '/ui/services/nav/megamenu/username/context.json',
  CHANGE_GROUP_URL = '/core/services/session/username/extend',
  ACCOUNT_CHANGE_URL = '/ui/home/manage?idaction=set_customer&newProvisioningAcct=';

module.exports = function ContextProvider() {

  var applicationType = APP_CONTEXTS.account, initialAccount, allGroups, allProperties, rawContext;

  /**
   * Sets the application context to be either account centric or group centric.
   * @param {String} newType Should be 'this.ACCOUNT_CONTEXT', 'this.GROUP_CONTEXT'
   * or 'this.OTHER_CONTEXT' (for non luna apps).
   */
  this.setApplicationContext = function(newType) {
    applicationType = newType;
  };

  /**
   * Value for an application that is group aware
   * @type {String}
   */
  this.GROUP_CONTEXT = APP_CONTEXTS.group;

  /**
   * Value for an application that does not care about groups, but exists in Luna.
   * @type {String}
   */
  this.ACCOUNT_CONTEXT = APP_CONTEXTS.account;

  /**
   * Value for an application that is outside of luna.
   * @type {String}
   */
  this.OTHER_CONTEXT = APP_CONTEXTS.other;

  /* @ngInject */
  this.$get = function Context($injector, $q, $window, $cookies,
                               LUNA_GROUP_QUERY_PARAM, LUNA_ASSET_QUERY_PARAM) {
    var $http;

    var currentAccount = {
      id: null,
      name: null,
      cookieValue: null
    };
    var currentGroup = $q.when({
      id: null,
      name: null,
      properties: [],
      parent: {},
      children: []
    });
    var initialProperty = $q.when({
      id: null,
      name: null,
      group: {}
    }), currentProperty = initialProperty;

    var descriptor = {
      isGroupContext: angular.bind(this, isContext, APP_CONTEXTS.group),
      isAccountContext: angular.bind(this, isContext, APP_CONTEXTS.account),
      isOtherContext: angular.bind(this, isContext, APP_CONTEXTS.other),
      getAccountFromCookie: getAccountFromCookie,
      accountChanged: accountChanged,
      resetAccount: resetAccount
    };

    // for now we can only set the current account, but not do much else
    Object.defineProperty(descriptor, 'account', {

      get: function() {
        return currentAccount;
      },
      set: setAccount,
      enumerable: true
    });

    // current group
    Object.defineProperty(descriptor, 'group', {
      get: function() {
        return currentGroup;
      },
      set: setGroup,
      enumerable: true
    });

    // current property
    Object.defineProperty(descriptor, 'property', {
      get: function() {
        return currentProperty;
      },
      set: setProperty,
      enumerable: true
    });

    return descriptor;

    /**
     * Determines if we have switched accounts
     * @returns {boolean} true if the account cookie has changed since `setAccountCookie` was
     * last called.
     */
    function accountChanged() {
      return !isContext(APP_CONTEXTS.other) &&
        initialAccount.cookieValue &&
        initialAccount.id !== getAccountFromCookie().id;
    }

    /**
     * Resets the current account to the initial account
     * @returns {HttpPromise} A promise to change the account
     */
    function resetAccount() {
      $http = $http || $injector.get('$http');
      $cookies.put(ACCOUNT_COOKIE, initialAccount.cookieValue, {
        path: '/'
      });
      currentAccount = initialAccount;
      return $http.get(ACCOUNT_CHANGE_URL + initialAccount.name);
    }

    /**
     * Parses the AKALASTMANAGEDACCOUNT cookie and returns the account object. The name includes
     * the current contract
     * @returns {{id: String, name: String}} the account object, as read from the appropriate
     * cookie. Returns a null account if the cookie doesn't exist.
     */
    function getAccountFromCookie() {
      var cookie = $cookies.get(ACCOUNT_COOKIE),
        base64EncodedCookie, id = null, name = '';

      if (cookie) {
        base64EncodedCookie = $window.atob(cookie).split('~~');
        id = base64EncodedCookie[1];
        name = base64EncodedCookie[0];
      }

      return {
        id: id,
        name: name,
        cookieValue: cookie
      };
    }

    // ------------ utility methods below ------------

    function isContext(context) {
      return applicationType === context;
    }

    function fetchGroupContext() {
      // prevent a circular reference in the auth component
      $http = $http || $injector.get('$http');

      return $http.get(GROUPS_URL, {cache: true})
        .then(function(data) {
          var parsed;

          if (!rawContext) {
            rawContext = data.data;
          }
          if (!allGroups || !allProperties) {
            parsed = parseGroupsAndProperties(data.data.context.mainMenuItems);
            allGroups = parsed.groups;
            allProperties = parsed.properties;
          }

          return rawContext;
        });
    }

    function setAccount(newAccount) {
      currentAccount.id = newAccount.id;
      currentAccount.name = newAccount.name;
      currentAccount.cookieValue = newAccount.cookieValue;

      // used to detect if account changed
      if (!initialAccount) {
        initialAccount = currentAccount;
      }

      // set other pointers as well
      currentAccount.context = getAccountContext();
    }

    // gets the contents of context.json
    function getAccountContext() {
      var contextCopy;

      if (rawContext) {
        contextCopy = angular.copy(rawContext);
        return $q.when(contextCopy);
      }

      return fetchGroupContext();
    }

    /**
     * Changes the group to have the new group id. Does not perform. Sets the current group to
     * a promise that may resolve as the previous group if any of the requests in the promise
     * chain throw an exception.
     * @param {Number} groupId the new group ID
     */
    function setGroup(groupId) {
      var oldGroup = currentGroup;

      currentGroup = getAccountContext()
        .then(function() {
          return findGroupById(groupId);
        })
        .catch(function() {
          return oldGroup;
        });

      // potentially reset property
      currentProperty.then(function(property) {
        if (property.group.id !== groupId) {
          currentProperty = initialProperty;
        }
        changeGroupOrPropertyForLuna(groupId);
      });
    }

    /**
     * Sets the new property based on an asset id
     * @param {Number} propertyId the id for the property
     */
    function setProperty(propertyId) {
      var oldProperty = currentProperty;

      currentProperty = getAccountContext()
        .then(function() {
          return findPropertyById(propertyId);
        })
        .catch(function() {
          return oldProperty;
        });

      // set current group to either be the parent of the current property, or leave it
      // unchanged
      currentGroup = $q.all([currentGroup, currentProperty])
        .then(function(items) {
          var group = items[0], property = items[1], match = false, current = property.group;

          // determine if the current property is contained within the current group
          while (current.parent) {
            if (group.id === current.id) {
              match = true;
              break;
            }
            current = current.parent;
          }

          // change group to be the direct parent of the current property
          if (!match) {
            return findGroupById(property.group.id);
          }

          // leave group unchanged
          return group;
        })
        .then(function(group) {
          changeGroupOrPropertyForLuna(group.id, propertyId);
          return group;
        });

    }

    // backwards compatibility method to set group and property cookies for luna applications
    function changeGroupOrPropertyForLuna(gid, aid) {
      var url = CHANGE_GROUP_URL + '?' + LUNA_GROUP_QUERY_PARAM + '=' + gid;

      $http = $http || $injector.get('$http');

      if (aid) {
        url += '&' + LUNA_ASSET_QUERY_PARAM + '=' + aid;
      }

      return $http.get(url);
    }

    // returns the group hierarchy for a given GID. Includes parents and children.
    function findGroupById(id) {
      return findGenericById(allGroups, id);
    }

    function findPropertyById(id) {
      return findGenericById(allProperties, id);
    }

    function findGenericById(list, id) {
      return list.filter(function(item) {
        return item.id === id;
      })[0];
    }

    // simple factory method to make a group from the context.json schema
    function makeGroup(parentGroup, data) {
      var id = data.itemId;

      return {
        id: id,
        name: data.name,
        parent: parentGroup,
        properties: [],
        children: []
      };
    }

    // factory method to make a property from the context.json schema
    function makeProperty(parentGroup, data) {
      var qs = querystring.parse(data.url.split('?')[1]),
        id = parseInt(qs[LUNA_ASSET_QUERY_PARAM], 10) || undefined;

      return {
        id: id,
        name: data.name,
        group: parentGroup
      };
    }

    // helper methods
    function isGroup(item) {
      return item.itemId !== 0;
    }

    function isProperty(item) {
      return item.itemId === 0;
    }

    // converts the absolute mess that is the context.json call into a flat list with parent
    // and child pointers so we can search it much more easily
    function parseGroupsAndProperties(items, parent) {
      var i, item, group, childItems;

      var totalItems = {
        groups: [],
        properties: []
      };

      for (i = 0; i < items.length; i++) {
        item = items[i];

        if (isProperty(item)) {
          totalItems.properties.push(makeProperty(parent, item));
        } else {
          group = makeGroup(parent, item);

          group.children = (item.subMenuItems || [])
            .filter(isGroup)
            .map(angular.bind(this, makeGroup, group));

          group.properties = (item.subMenuItems || [])
            .filter(isProperty)
            .map(angular.bind(this, makeProperty, group));

          totalItems.groups.push(group);
        }

        if (item.subMenuItems && item.subMenuItems.length) {
          childItems = parseGroupsAndProperties(item.subMenuItems, group);
          totalItems.groups = totalItems.groups.concat(childItems.groups);
          totalItems.properties = totalItems.properties.concat(childItems.properties);
        }
      }
      return totalItems;
    }

  };

};