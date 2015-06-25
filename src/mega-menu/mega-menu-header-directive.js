'use strict';

var template = require('./header/header.html');

var render = require('./utils/renderer').render;

var helpers = require('./helpers'),
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

/* @ngInject */
module.exports = function($rootScope, context) {
  return {
    restrict: 'E',
    scope: { },
    controller: MegaMenu,
    controllerAs: 'menuHeader',
    template: template
  };

  function contextChanged(e, data) {
    breadcrumbs.render(data);
  }

  function contextLoaded(e, data) {
    contextSelector.render(data);
  }

  function renderAll(data) {
    var group = context.getGroupInfo(), accountContext = context.getContextForAccount();

    i18n.setData(data.i18n);
    // append locale as a class name to body -- used for some CSS hackery
    document.querySelector('body').classList.add(data.config.locale);

    render('#modular-mega-menu-header .help.marketplace', supportTemplate, {
      viewStore: data.config.displayStorePage && data.partner.displayStore,
      supportUrl: data.partner.supportUrl
    });

    // handle the case when the mega menu renders before the context selector fetches group
    // information. In this case, the events defined on root scope won't be triggered when
    // this directive is initially rendered
    if (group) {
      breadcrumbs.render(group);
    }

    if (accountContext) {
      contextSelector.render(accountContext);
    }

    menu.render();
    alerts.render();
    messages.render();
    accountSelector.render();
    search.render();
    timeout();
  }

  /* @ngInject */
  function MegaMenu(megaMenuData) {
    $rootScope.$on('akamai.components.context.changed', contextChanged);
    $rootScope.$on('akamai.components.context.loaded', contextLoaded);

    helpers.register();

    megaMenuData.fetch().then(renderAll);
  }
};