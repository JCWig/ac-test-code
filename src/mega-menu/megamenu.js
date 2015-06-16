'use strict';

/**
 * @ngdoc object
 * @name megamenu
 * @requires helpers
 * @requires menu
 * @description
 * Main object exposed by the Mega Menu library. The name is exposed as a global only if
 * developers aren't using a module loader (such as RequireJS). Otherwise, it can be included as
 * `require('path/to/megamenu')`.
 */

var angular = require('angular');

var header = require('./header/header.hbs'),
  footerWrapper = require('./footer/footerWrapper.hbs'),
  renderer = require('./utils/renderer'),
  helpers = require('./helpers'),
  menu = require('./menu'),
  alerts = require('./alerts'),
  messages = require('./messages'),
  breadcrumbs = require('./breadcrumbs'),
  contextSelector = require('./contextSelector'),
  accountSelector = require('./accountSelector'),
  timeout = require('./timeout'),
  search = require('./search'),
  i18n = require('./helpers/i18n'),
  config = require('./utils/config'),
  constants = require('./utils/constants'),
  i18nLoader = require('./utils/i18n-loader'),
  ajax = require('./utils/ajax');

var PARTNER_URL = '/totem/static/pulsar/megamenu/branding.json';

// make google analytics call
require('./utils/ga');

// Attaches the header at the start of the body and the footer at the end of the body
function firstRender() {
  var wrapper = document.createElement('div'),
    el = document.querySelector('body');

  wrapper.innerHTML = header();
  el.insertBefore(wrapper.firstChild, el.firstChild);

  wrapper.innerHTML = footerWrapper();
  el.appendChild(wrapper.firstChild);
}

function contextChanged(e, data) {
  breadcrumbs.render(data);
}

function contextLoaded(e, data) {
  i18nLoader(function(i18nData) {
    i18n.setData(i18nData);
    contextSelector.render(data);
  });
}

helpers.register();

// NOTE: i18n data won't be available here so we should avoid putting translation data in the
// header/footer templates
firstRender();

// element binding has to be done here because otherwise we may miss the event from the angular
// context component. This introduces some extra complexity because the mega menu previously
// assumed availability of i18n and configuration data by the time we render the sub modules.
angular.element(document.querySelector('body'))
  .on('akamai.components.context.changed', contextChanged);
angular.element(document.querySelector('body'))
  .on('akamai.components.context.loaded', contextLoaded);

// load i18n data before rendering the application.
i18nLoader(function(i18nData) {
  i18n.setData(i18nData);

  // render extra stuff in the header and footer that needs i18n and config data. The config
  // callback should resolve immediately because it is implicitly called by i18nLoader
  config(function(configData) {

    // append locale as a class name to body -- used for some CSS hackery
    document.querySelector('body').classList.add(configData.locale);

    // moving this logic to a promise is a good idea.
    ajax.get(PARTNER_URL, function(err, partnerData) {
      if (err) {
        return;
      }

      renderer.render('#modular-mega-menu-header .help.marketplace',
        require('./header/support.hbs'), {
          viewStore: configData.displayStorePage && partnerData.displayStore,
          supportUrl: partnerData.supportUrl
      });

      // render either the normal footer or the internal footer depending on whether or not
      // the attempt to get footer data returns a 403. The internal footer renders the normal
      // footer as a hbs partial
      ajax.get('/totem/api/pulsar/megamenu/footer.json', function(footerError, internalFooterData) {
        var footerTpl = require('./footer/internalFooter.hbs');

        var footerSel = '#modular-mega-menu-footer',
          footerData = {
            currentYear: (new Date()).getFullYear(),
            feedbackUrl: partnerData.feedbackUrl,
            policyUrl: i18n.i18n('policies.' + configData.locale.toLowerCase()),
            internalLinks: internalFooterData
          };

        if (footerError) {
          footerTpl = require('./footer/_footer.hbs');
        }

        renderer.render(footerSel, footerTpl, footerData);
      });

    });
  });

  // render all -- some of these will spawn more AJAX requests
  menu.render();
  alerts.render();
  messages.render();
  accountSelector.render();
  search.render();
  timeout();
});

module.exports = {

  /**
   * @ngdoc property
   * @name VERSION
   * @propertyOf megamenu
   * @returns {String} The current version number for this library.
   */
  VERSION: constants.VERSION
};
