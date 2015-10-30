angular.module('navApp', ['akamai.components.constants', 'akamai.components.tabs'])
  .controller('NavAppController', NavAppController)
  .config(configFunction);

function NavAppController() {
  this.foo = 'bar';
}

function configFunction($translatePartialLoaderProvider, VERSION, $translateProvider,
                        i18nLocaleProvider) {

  // need to overwrite locales path on fee.akamai.com
  if (window.location.host == 'fee.akamai.com') {
    $translatePartialLoaderProvider.addPart('../dist/locales/');
    $translatePartialLoaderProvider.addPart('locales/json/messages/');
  } else {
    $translatePartialLoaderProvider.addPart('/libs/akamai-core/'+VERSION+'/locales/');
    $translatePartialLoaderProvider.addPart('/apps/akamai-core-examples/locales/');
  }

  var locale = docCookies.getItem('AKALOCALE') || 'en_US';

  $translateProvider.preferredLanguage(locale);
  i18nLocaleProvider.setLocale(locale);
}
configFunction.$inject = ['$translatePartialLoaderProvider', 'AKAMAI_CORE_VERSION',
  '$translateProvider', 'i18nLocaleProvider'];
