var template = require('./header/header.html'),
  render = require('./utils/renderer').render,
  helpers = require('./helpers'),
  menu = require('./menu'),
  config = require('./utils/config'),
  i18n = require('./helpers/i18n'),
  alerts = require('./alerts'),
  messages = require('./messages'),
  breadcrumbs = require('./breadcrumbs'),
  contextSelector = require('./contextSelector'),
  accountSelector = require('./accountSelector'),
  timeout = require('./timeout'),
  search = require('./search'),
  supportTemplate = require('./header/support.hbs');

module.exports = function($location, $q, context, $http,
                          LUNA_GROUP_QUERY_PARAM, LUNA_ASSET_QUERY_PARAM) {

  function renderMenu(property) {
    let tabs = 'grp.json';

    if (property.id) {
      tabs = 'asset.json';
    }

    config(function(data) {
      $http.get(`/ui/services/nav/megamenu/${encodeURIComponent(data.username)}/${tabs}`)
        .then(function(response) {
          menu.render(response.data);
        });
    });
  }

  // whenever group or property changes, update breadcrumbs
  // items[0] is the current group
  // items[1] is the current property.
  // See the `watchGroup` statement below.
  function contextChanged(data) {
    $q.all(data).then(function(items) {
      if (items[1].id) {
        breadcrumbs.render(items[1]);
      } else {
        breadcrumbs.render(items[0]);
      }
      renderMenu(items[1]);
      updateLocation(items[0].id, items[1].id);
    });
  }

  function updateLocation(gid, aid) {
    $location.search(LUNA_GROUP_QUERY_PARAM, gid);
    $location.search(LUNA_ASSET_QUERY_PARAM, aid);
  }

  function renderAll(data) {
    var group = context.group, accountContext = context.account.context;

    i18n.setData(data.i18n);
    // append locale as a class name to body -- used for some CSS hackery
    document.querySelector('body').classList.add(data.config.locale);

    render('#modular-mega-menu-header .help.marketplace', supportTemplate, {
      viewStore: data.config.displayStorePage && data.partner.displayStore,
      supportUrl: data.partner.supportUrl
    });

    group.then(breadcrumbs.render);
    accountContext.then(contextSelector.render);

    alerts.render();
    messages.render();
    accountSelector.render();
    search.render();
    timeout();
  }

  function MegaMenu($scope, megaMenuData) {

    helpers.register();

    megaMenuData.fetch()
      .then(renderAll)
      .then(function() {
        $scope.$watchGroup([function() {
          return context.group;
        }, function() {
          return context.property;
        }], contextChanged);
      });
  }

  MegaMenu.$inject = ['$scope', 'megaMenuData'];

  return {
    restrict: 'E',
    scope: {},
    controller: MegaMenu,
    controllerAs: 'menuHeader',
    template: template
  };
};
module.exports.$inject = ['$location', '$q', 'context', '$http', 'LUNA_GROUP_QUERY_PARAM',
  'LUNA_ASSET_QUERY_PARAM'];