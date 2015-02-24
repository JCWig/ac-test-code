'use strict';

/* @ngInject */
module.exports = function($http, $q, $log, i18nToken, i18nConfig) {
    var locale = i18nToken.getCurrentLocale(),
        urls = i18nToken.getUrls();
    return function(options) {
        var deferred = $q.defer(), deferreds = [], n = urls.length, localeTable = {}, url;
        while (n > 0) {
            //locale value is decoded locale from cookie AKALOCALE, it also can be special one: en_US_att
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
                //log for ourself in console: Object {message: "Cannot GET /locales/en_US.json↵", status: 404}
                $log.error({"message": err.data, "status": err.status});
                //just resolve gracefully
                deferred.resolve({});
            });
        return deferred.promise;
    };
};
