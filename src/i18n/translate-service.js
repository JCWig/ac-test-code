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
         * ngdoc method
         *
         * @name akamai.components.i18n.akamTranslate#async
         *
         * @methodOf akamai.components.i18n.akamTranslate
         *
         * @description async method provides atlernative usage in trasnlating the keys in non-blocking fashion
         * It depends on the styles of programing, but best practice will be to use with scope veriavles in controllers and directives
         * , so it can display dom content in non-blocking fashion
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
         * if it requires 2 way binding, then wrap around the events like "translateChangeEnd" or "translationLoadingSucces" are suggested
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
         * ngdoc method
         *
         * @name akamai.components.i18n.akamTranslate#sync
         *
         * @methodOf akamai.components.i18n.akamTranslate
         *
         * @description sync method provides atlernative usage in translating the keys in blocking fashion
         * It depends on the styles of programing, but best situations to use this is to have translated value right away, and they are not $scope variables.
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
