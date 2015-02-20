'use strict';

/* @ngInject */
module.exports = function($http, $q, $log, i18nToken, i18nConfig) {
    var locale = i18nToken.getCurrentLocale(),
        urls = i18nToken.getUrls();
    return function(options) {
        var deferred = $q.defer(), deferreds = [], n = urls.length, localeTable = {}, url;
        while (n > 0) {
            //att suffix name might be issue here
             url = urls[n - 1] + locale + ".json";
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
                //just resolve gracefully
                deferred.resolve({});
                //log by ourself
                $log.error("Couldn\'t find locale file!");
            });
        return deferred.promise;
    };
};
