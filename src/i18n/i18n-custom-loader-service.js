'use strict';

/* @ngInject */
module.exports = function($http, $q, i18nToken, i18nConfig) {
    var locale = i18nToken.getLocale(),
        urls = i18nToken.getUrls();
    return function(options) {
        var deferred = $q.defer(), deferreds = [], n = urls.length, localeTable = {}, url;
        while (n > 0) {
            if (n===1) {
                url = urls[0] + i18nConfig.defaultLocale + ".json";
            }
            else {
                 url = urls[n - 1] + locale + ".json";
            }
            deferreds.push($http.get(url, {}));
            n--;
        }
        $q.all(deferreds).then(
            function(responses) {
                angular.forEach(responses, function(resp) {
                    var src = resp.data,
                        clone = src? angular.copy(src) : {};
                    angular.extend(localeTable, clone);
                });
                deferred.resolve([localeTable]);
            },
            function(err) {
                deferred.reject("Couldn\'t find locale file!");
            });
        return deferred.promise;
    };
};
