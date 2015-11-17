(function(window) {
  var document = window.document,
    cookieFilePath = 'utils/cookies.js';

  //if example file is in different location, like table component,
  //two cookie.js files will be loaded, and one is wrong path - unfortunately
  document.write('<script type=text/javascript src=' + cookieFilePath + '></script>');
  document.addEventListener("DOMContentLoaded", patchI18nConfig, false);

  function patchI18nConfig() {

    'use strict';

    function configFn(i18n, $translateProvider, $partialLoader, VERSION) {
      var loc = docCookies.getItem('AKALOCALE') || 'en_US';

      if (window.location.host == 'fee.akamai.com') {
        $partialLoader.addPart('../dist/locales/');
        $partialLoader.addPart('locales/json/messages/');
      } else {
        $partialLoader.addPart('/libs/akamai-core/' + VERSION + '/locales/');
        $partialLoader.addPart('/apps/akamai-core-examples/locales/');
      }
      $translateProvider.preferredLanguage(loc);
      i18n.setLocale(loc);
    }

    //it could be better not to get hard coded module name, but...
    angular.module('exampleApp').config(configFn);
    configFn.$inject = [
      'i18nLocaleProvider',
      '$translateProvider',
      '$translatePartialLoaderProvider',
      'AKAMAI_CORE_VERSION'
    ];
  }
})(this);
