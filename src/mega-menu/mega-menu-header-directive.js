var template = require('./header/header.html'),
  render = require('./utils/renderer').render,
  helpers = require('./helpers'),
  menu = require('./menu'),
  i18n = require('./helpers/i18n'),
  alerts = require('./alerts'),
  messages = require('./messages'),
  breadcrumbs = require('./breadcrumbs'),
  contextSelector = require('./contextSelector'),
  accountSelector = require('./accountSelector'),
  timeout = require('./timeout'),
  search = require('./search'),
  supportTemplate = require('./header/support.hbs');

module.exports = function($location, $q, context, LUNA_GROUP_QUERY_PARAM, LUNA_ASSET_QUERY_PARAM) {

  // whenever group or property changes, update breadcrumbs
  function contextChanged(data) {
    $q.all(data).then(function(items) {
      if (items[1].id) {
        breadcrumbs.render(items[1]);
      } else {
        breadcrumbs.render(items[0]);
      }
      menu.render();
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

    menu.render();
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
module.exports.$inject = ['$location', '$q', 'context', 'LUNA_GROUP_QUERY_PARAM',
  'LUNA_ASSET_QUERY_PARAM'];