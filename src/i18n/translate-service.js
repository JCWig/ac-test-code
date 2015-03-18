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
         *
         * @name translate#async
         *
         * @methodOf akamai.components.i18n.service:translate
         *
         * @description Asynchronously translates a key or sets of
         * keys.
         *
         * Best practice is to use scope variables in controllers and
         * directives to display DOM content in a non-blocking fashion.
         * For example, this passes in a key:
         *
         * <pre>
         * akamTranslate.async('key').then(function(value){
         *     $scope.var = value;
         * })
         * </pre>
         *
         * This passes in a key and a variable that replaces any
         * instance of ``{{name}}`` within the key:
         *
         * <pre>
         * akamTranslate.async('key', {name:"xxx"}).then(function(value){
         *     $scope.var = value;
         * })
         * </pre>
         *
         * This passes in keys as an array, in which case variable
         * replacement is not possible:
         *
         * <pre>
         * akamTranslate.async([key1, key2, key3]).then(function(values){
         *     $scope.var1 = values[key1];
         *     $scope.var2 = values[key2];
         *     $scope.var3 = values[key3];
         * })
         * </pre>
         *
         * If two-way binding is necessary, wrap the method within
         * event handlers for `translateChangeEnd` or
         * `translationLoadingSuccess`, which only fire on the
         * `$rootScope`:
         *
         * <pre>
         * $rootScope.$on('$translateChangeEnd', function() {
         *     akamTranslate.async('key').then(function(value){
         *         $scope.var = value;
         *     })
         * });
         * </pre>
         *
         * @param {array | string} keys String key or array of keys.
         * If it is an array, return values are available in
         * `values[key[index]]`.
         *
         * @param {object=} args A hash containing variable
         * replacements. This option is only available when the `key`
         * is a string.
         *
         */
        async: asyncMethod,

        /**
         * @ngdoc method
         *
         * @name translate#sync
         *
         * @methodOf akamai.components.i18n.service:translate
         *
         * @description Translates a key string immediately.
         *
         * Use this only once the translation table has loaded,
         * otherwise the
         * {@link akamai.components.i18n.service:translate#methods_async async}
         * method is more appropriate.
         * When blocking the application is not a problem, best
         * practice is to assign return values to non-`$scope`
         * variables. For example:
         *
         * <pre>
         * var value = akamTranslate.sync(key, args);
         * </pre>
         *
         * If two-way binding is necessary, wrap the method within
         * event handlers for `translateChangeEnd` or
         * `translationLoadingSuccess`, which only fire on the
         * `$rootScope`:
         *
         * <pre>
         * $rootScope.$on('$translateChangeEnd', function() {
         *     var value = akamTranslate.sync(key, args);
         *     // ...
         * });
         * </pre>
         *
         * @param {string} key string of key name.
         *
         * @param {object=} args is hash that contains variable
         * replacements.
         *
         */
        sync: syncMethod
    };
};
