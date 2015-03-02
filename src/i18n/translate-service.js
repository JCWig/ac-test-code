'use strict';

/* @ngInject */
module.exports = function($translate) {
    // use sync
    var syncMethod = function(key, args) {
        return $translate.instant(key, args);
    };
    //use async
    var asyncMethod = function(keys, args) {
        if (angular.isArray(keys)) {
            return $translate(keys);
        } else {
            return $translate(keys, args);
        }
    };
    return {
        /**
         * @ngdoc method
         * @name translate#async
         * @methodOf akamai.components.i18n.service:translate
         *
         * @description async method provides alternative usage in translating the keys in non-blocking fashion
         * It depends on the styles of programming, but best practice will be to use with scope variables in controllers and directives
         * , so it can display DOM content in non-blocking fashion
         *
         * Examples of usages:
         *
         * passing key only:
         * <pre>
         * akamTranslate.async('key').then(function(value){
         * $scope.var = value;
         * })
         * </pre>
         *
         * passing key and variable replacement:
         * <pre>
         * akamTranslate.async('key', {name:"xxx"}).then(function(value){
         * $scope.var = value;
         * })
         * </pre>
         *
         * passing keys as array(no variable replacement):
         * <pre>
         * akamTranslate.async([key1, key2, key3]).then(function(values){
         * $scope.var1 = values[key1];
         * $scope.var2 = values[key2];
         * $scope.var3 = values[key3];
         * })
         * </pre>
         *
         * If it requires two-way binding, then wrap around the events
         * like `translateChangeEnd` or `translationLoadingSuccess`.
         *
         * <pre>
         * $rootScope.$on('$translateChangeEnd', function() {
         * akamTranslate.async('key').then(function(value){
         * $scope.var = value;
         * })
         * });
         *
         * </pre>
         * *NOTE* The event is on the $rootScope only
         *
         * @param {array | string} keys if it is array type - it contains keys, return access values will be values[key[0]]
         * @param {object=} args is hash that contains variable replacements
         *
         */
        async: asyncMethod,

        /**
         * @ngdoc method
         * @name translate#sync
         * @methodOf akamai.components.i18n.service:translate
         *
         * @description sync method provides alternative usage in translating the keys in blocking fashion
         * It depends on the styles of programming, but best situations to use this is to have translated value right away, and they are not $scope variables.
         *
         * Examples of usages:
         *
         * <pre>
         * var value = akamTranslate.sync(key, args);
         * ...
         * })
         * </pre>
         *
         * <pre>
         * $rootScope.$on('$translateChangeEnd', function() {
         * var value = akamTranslate.sync(key, args);
         * ...
         * });
         *
         * </pre>
         * *NOTE* The event is on the $rootScope only
         * *NOTE* In most cases, the translation table has been loaded, this blocking call should return correct translated value,
         * but if uncertain, we suggest you need to look into non-blocking call which is to use async method
         *
         * @param {string} key string of key name
         * @param {object=} args is hash that contains variable replacements
         *
         */
        sync: syncMethod
    };
};
