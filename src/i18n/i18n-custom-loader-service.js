'use strict';

/* @ngInject */
module.exports = function($http, $q, i18nToken, i18nConfig) {
    var locale = i18nToken.getLocale(),
        urls = i18nToken.getUrls();
    return function(options) { //callback func option has: $http, key="en_US"
        var deferred = $q.defer(), deferreds = [], n = urls.length, localeTable = {}, url;
        while (n > 0) {
            if (n===1) {
                url = urls[0] + i18nConfig.defaultLocale + ".json"; //component locale always en_US for now
            }
            else {
                 url = urls[n - 1] + locale + ".json"; //assuming all json file, and file format has "...en_US.json"
            }
            deferreds.push($http.get(url, {}));
            n--;
        }
        $q.all(deferreds).then(
            function(responses) { //success
                angular.forEach(responses, function(resp) {
                    var src = resp.data,
                        clone = src? angular.copy(src) : {};
                    angular.extend(localeTable, clone);
                });
                deferred.resolve([localeTable]);
            },
            function(err) {
                deferred.reject("Couldn\'t find locale file!");
                //var $translate = $injector.get("$translate"); //has to use $injector, circular dependency, $translate servcie not done yet
                //throw new AkamException(err.data, err.statusText);
            });
        return deferred.promise;
    };
};
