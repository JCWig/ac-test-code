import angular from 'angular';
import querystring from 'querystring';

// Static list of contexts that can  be applied to an application.
// It may be group or account aware.
const APP_CONTEXTS = {
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

function ContextProvider() {
  let applicationType = APP_CONTEXTS.account;
  let initialAccount, allGroups, allProperties, rawContext;

  this.setApplicationContext = (value) => applicationType = value;

  this.GROUP_CONTEXT = APP_CONTEXTS.group;
  this.ACCOUNT_CONTEXT = APP_CONTEXTS.account;
  this.OTHER_CONTEXT = APP_CONTEXTS.other;

  this.$get = Context;

  function Context($injector, $q, $window, $cookies,
                   LUNA_GROUP_QUERY_PARAM, LUNA_ASSET_QUERY_PARAM) {

    let $http;

    let currentAccount = {
      id: null,
      name: null,
      cookieValue: null
    };
    let currentGroup = $q.when({
      id: null,
      name: null,
      properties: [],
      parent: {},
      parents: [],
      children: []
    });
    let initialProperty = $q.when({
      id: null,
      name: null,
      group: {}
    }), currentProperty = initialProperty;

    let descriptor = {
      isGroupContext: angular.bind(this, isContext, APP_CONTEXTS.group),
      isAccountContext: angular.bind(this, isContext, APP_CONTEXTS.account),
      isOtherContext: angular.bind(this, isContext, APP_CONTEXTS.other),
      getAccountFromCookie: getAccountFromCookie,
      accountChanged: accountChanged,
      resetAccount: resetAccount
    };

    // for now we can only set the current account, but not do much else
    Object.defineProperty(descriptor, 'account', {
      get: () => {
        return currentAccount;
      },
      set: setAccount,
      enumerable: true
    });

    // current group
    Object.defineProperty(descriptor, 'group', {
      get: () => {
        return currentGroup;
      },
      set: setGroup,
      enumerable: true
    });

    // current property
    Object.defineProperty(descriptor, 'property', {
      get: () => {
        return currentProperty;
      },
      set: setProperty,
      enumerable: true
    });

    return descriptor;

    function accountChanged() {
      return !isContext(APP_CONTEXTS.other) &&
        initialAccount.cookieValue &&
        initialAccount.id !== getAccountFromCookie().id;
    }

    function resetAccount() {
      $http = $http || $injector.get('$http');

      $cookies.put(ACCOUNT_COOKIE, initialAccount.cookieValue, { path: '/' });
      currentAccount = initialAccount;
      return $http.get(ACCOUNT_CHANGE_URL + initialAccount.name)
        .catch(angular.noop);
    }

    // Parses the AKALASTMANAGEDACCOUNT cookie and returns the account object.
    // The name includes the current contract
    function getAccountFromCookie() {
      let cookie = $cookies.get(ACCOUNT_COOKIE),
        base64EncodedCookie, id = null, name = '';

      if (cookie) {
        base64EncodedCookie = $window.atob(cookie.replace(/^"|"$/g, '')).split('~~');
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
          let parsed;

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
      let contextCopy;

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
      let oldGroup = currentGroup;

      currentGroup = getAccountContext()
        .then( () => findGroupById(groupId) )
        .catch( () => oldGroup );

      // potentially reset property
      currentProperty.then((property) => {
        if (property.group.id !== groupId) {
          currentProperty = initialProperty;
        }
        changeGroupOrPropertyForLuna(groupId);
      });
    }

    /**
     * Sets the new property based on an asset id. Set the property to null to reset it to the
     * null property.
     * @param {Number|null} propertyId the id for the property
     */
    function setProperty(propertyId) {
      let oldProperty = currentProperty;

      if (!propertyId) {
        currentProperty = initialProperty;
        return;
      }

      currentProperty = getAccountContext()
        .then(() => {
          return findPropertyById(propertyId);
        })
        .catch(() => {
          return oldProperty;
        });

      // set current group to either be the parent of the current property, or leave it
      // unchanged
      currentGroup = $q.all([currentGroup, currentProperty])
        .then(function(items) {
          let group = items[0], property = items[1], match;

          // determine if the current property is contained within the current group
          match = property.group.id === group.id || property.group.parents.filter((p) => {
            return p.id === group.id;
          }).length;

          // change group to be the direct parent of the current property
          if (!match) {
            return findGroupById(property.group.id);
          }

          // leave group unchanged
          return group;
        })
        .then((group) => {
          changeGroupOrPropertyForLuna(group.id, propertyId);
          return group;
        });

    }

    // backwards compatibility method to set group and property cookies for luna applications
    function changeGroupOrPropertyForLuna(gid, aid) {
      let url = `${CHANGE_GROUP_URL}?${LUNA_GROUP_QUERY_PARAM}=${gid}`;
      $http = $http || $injector.get('$http');

      if (aid) {
        url += `&${LUNA_ASSET_QUERY_PARAM}=${aid}`;
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
      return list.filter( item => item.id === id )[0];
    }

    // simple factory method to make a group from the context.json schema
    function makeGroup(parentGroup, data) {
      return {
        id: data.itemId,
        name: data.name,
        parent: parentGroup,

        // calculate an array of all parents
        get parents() {
          let p = parentGroup, parentArray = [];

          while (p) {
            parentArray.unshift(p);
            p = p.parent;
          }

          return parentArray;
        },
        properties: [],
        children: []
      };
    }

    // factory method to make a property from the context.json schema
    function makeProperty(parentGroup, data) {
      let qs = querystring.parse(data.url.split('?')[1]),
        id = parseInt(qs[LUNA_ASSET_QUERY_PARAM], 10) || undefined;

      return {
        id: id,
        name: data.name,
        group: parentGroup
      };
    }

    // helper methods
    function isGroup(item) {
      return !isProperty(item);
    }

    function isProperty(item) {
      return item.itemId === 0;
    }

    // converts the absolute mess that is the context.json call into a flat list with parent
    // and child pointers so we can search it much more easily
    function parseGroupsAndProperties(items, parent) {
      let group, childItems;

      let totalItems = {
        groups: [],
        properties: []
      };

      items.forEach((item) => {
        if (isProperty(item)) {
          totalItems.properties.push(makeProperty(parent, item));
        } else {
          group = makeGroup(parent, item);

          group.children = (item.subMenuItems || [])
            .filter(isGroup)
            .map( (subMenuItem) => makeGroup(group, subMenuItem) );

          group.properties = (item.subMenuItems || [])
            .filter(isProperty)
            .map( (subMenuItem) => makeProperty(group, subMenuItem));

          totalItems.groups.push(group);
        }

        if (item.subMenuItems && item.subMenuItems.length) {
          childItems = parseGroupsAndProperties(item.subMenuItems, group);
          totalItems.groups = totalItems.groups.concat(childItems.groups);
          totalItems.properties = totalItems.properties.concat(childItems.properties);
        }
      });
      return totalItems;
    }
  }

  Context.$inject = ['$injector', '$q', '$window', '$cookies', 'LUNA_GROUP_QUERY_PARAM',
    'LUNA_ASSET_QUERY_PARAM'];
}

export default ContextProvider;