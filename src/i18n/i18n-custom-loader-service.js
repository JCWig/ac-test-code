'use strict';

/* @ngInject */
module.exports = function($http, $q, i18nTokenService) {
    var locale = i18nTokenService.getLocale(),
        urls = i18nTokenService.getUrls(),
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
};
