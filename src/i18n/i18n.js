(function() {
    'use strict';

    /**
     * I18nToken is object that instantiated from i18nToken service, use during run phase
     * @param {object} config default config defined in .constant
     * @param {string=} loc    a locale value to be used, if it empty, default locale "en_US" will be used
     * @param {array | string=} urls   array or string type of path and part if any to be added to component default path
     */
    function I18nToken(config, loc, urls) {
        var locale = loc || config.defaultLocale,
            localeUrls = [config.localePath],
            localeCookie = config.localeCookie;

        if (urls && urls.length) {
            localeUrls.push.apply(localeUrls, urls);
        }

        this.getUrls = function() {
            return localeUrls;
        };
        this.getLocale = function() {
            return locale;
        };
    }

    /**
     * module definition with dependencies
     */
    angular.module('akamai.components.i18n', ["pascalprecht.translate"])

    /**
     * 'i18nConfig' is a default config object with holding constant values
     */
    .constant("i18nConfig", {
        localeCookie: 'AKALOCALE',
        localePath: '../../../locales/component-locales/',
        defaultLocale: 'en_US'
    })

    /**
     * i18nToken is angular service for holding I18nToken object values set by provider in config phase, and used in run phase
     */
    .service('i18nToken', ["i18nConfig", I18nToken])

    /**
     * 'i18nToken' is a provider that exposes 2 methods for setting values in config phase,
     * and pass those values using service to create instance of  'I18nToken'
     */
    .provider('i18nToken', ["i18nConfig", function I18nTokenProvider(config) {
        var locale = config.defaultLocale,
            partName = config.defaultLocale,
            urls = [];

        this.useLocale = function(loc) {
            locale = loc;
        };
        this.usePathAndPart = function(path, part) {
            urls.push(path + part);
        };
        this.$get = function i18nTokenFactory() {
            return new I18nToken(config, locale, urls);
        };
    }])

    /**
     * "i18nLoader" is customLoader factory service for $translationProvider to load locale files.
     * It can load multiple files and combine them, return one translation table to use
     */
    .factory('i18nLoader', [
        "$http",
        "$q",
        "$rootScope",
        "i18nToken",
        function($http, $q, $rootScope, i18nToken) {
            var locale = i18nToken.getLocale(),
                urls = i18nToken.getUrls(),
                localeTable = [];
            return function(options) { //callback func option has: $http, key="en_US"
                var deferred = $q.defer(),
                    deferreds = [],
                    n = urls.length;
                while (n > 0) {
                    var url = urls[n - 1] + locale + ".json"; //assuming all json file name format has "...en_US.json"
                    deferreds.push($http.get(url, {}));
                    n--;
                }
                $q.all(deferreds).then(
                    function(responses) { //success
                        angular.forEach(responses, function(resp) {
                            angular.extend(localeTable, angular.copy(resp.data));
                        });
                        //console.log(localeTable);
                        deferred.resolve([localeTable]);
                    },
                    function(err) {
                        deferred.reject(err);
                        //var $translate = $injector.get("$translate"); //has to use $injector, circular dependency, $translate servcie not done yet
                        //throw new AkamException(err.data, err.statusText);
                    })
                return deferred.promise;
            };
        }
    ])

    /**
     * This module config block to set up the $translationProvider
     */
    .config(['$translateProvider', 'i18nConfig', function($translateProvider, config) {
        $translateProvider.useLoader('i18nLoader', {});
        $translateProvider.preferredLanguage(config.defaultLocale);
        $translateProvider.fallbackLanguage(config.defaultLocale);
        //$translateProvider.useLocalStorage();
        $translateProvider.determinePreferredLanguage();
    }])

    /**
     * "translationResolver" is factory service for looking up the translated values if $translate.instant(key) not available
     */
    .factory("translationResolver", [
            "$q",
            "$timeout",
            "$translate",
            "$rootScope",
            function($q, $timeout, $translate, $rootScope) {
                var resolver = {},
                    changed = false;
                $rootScope.$on('$translateChangeSuccess', function() {
                    changed = true;
                });
                var translate = function(props) {
                    var results = [];
                    if (changed) {
                        var deferred = $q.defer();
                        if (angular.isArray(props)) {
                            angular.forEach(props, function(prop, i) {
                                if (angular.isObject(prop)) {
                                    for (var k in prop) {
                                        if (prop.hasOwnProperty(k)) {
                                            results.push($translate.instant(k, prop[k]));
                                        }
                                    }
                                } else {
                                    results.push($translate.instant(prop));
                                }
                            });
                            $timeout(function() {
                                $rootScope.$apply(function() {
                                    deferred.resolve(results);
                                    changed = false;
                                });
                            }, 2);
                        }
                        return deferred.promise;
                    }
                };
                return {
                    getTranslations: translate
                };
            }
        ])
        /**
         * this run block sets up the locale value and fires up "translateChangeSuccess" event
         */
        .run([
            "$translate",
            "$timeout",
            "i18nToken",
            function($translate, $timeout, i18nToken) {
                $timeout(function() {
                    $translate.use(i18nToken.getLocale());
                });
            }
        ]);
}());
