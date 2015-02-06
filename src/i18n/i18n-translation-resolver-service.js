'use strict';

/* @ngInject */
module.exports = function($q, $timeout, $translate, $rootScope) {
    var resolver = {},
        changed = false;
    $rootScope.$on('$translateChangeSuccess', function() {
        changed = true;
    });
    /**
     * @ngdoc method
     * @name akamai.components.i18n.i18nTranslationResolver#get
     * @methodOf akamai.components.i18n.i18nTranslationResolver
     *
     * @description translate with keys provided
     * @param {array | object} this param holds array of key(s) or object hash with key names and variable replacement.
     * @return {object} promise object, once translation done, it will be resolved.
     *
     * Usage:
     *
     * <pre>i18nTranslationResolver.get("arrayOfKeys").then(function(results) { ... })</pre>
     */
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
        get: translate
    };
};
