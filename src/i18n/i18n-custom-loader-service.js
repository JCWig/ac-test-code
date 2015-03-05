'use strict';

/* @ngInject */
module.exports = function($http, $q, $timeout, $log, i18nToken, i18nConfig) {
    var locale = i18nToken.getCurrentLocale(),
        urls = i18nToken.getUrls(),
        dirty = false,
        errorList = [],
        localeTable = [];

    function invalid(r) {
        $log.error({
            "message": r.data,
            "status": r.status
        });
        errorList.push(r.data);
    }

    function valid(r) {
        var src = r.data,
            clone = src ? angular.copy(src) : {};
        angular.extend(localeTable, clone);
    }

    var loadTranslations = function(locale, urls) {
        var deferreds = [],
            n = urls.length,
            url,
            deferred = $q.defer();
        while (n > 0) {
            url = urls[n - 1] + locale + ".json";
            deferreds.push($http.get(url).then(valid).catch(invalid));
            n--;
        }
        $q.all(deferreds).then(function(results) {
            if (errorList.length) {
                if (locale !== i18nConfig.defaultLocale) {
                    errorList = [];
                    localeTable = [];
                    deferred.resolve(loadTranslations(i18nConfig.defaultLocale, urls));
                } else {
                    $timeout(function() {
                        deferred.resolve([localeTable]);
                    }, 10);
                }
            } else {
                deferred.resolve([localeTable]);
            }
        });
        return deferred.promise;
    };
    return function(options) {
        return loadTranslations(locale, urls);
    };
};
