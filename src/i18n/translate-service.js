import angular from 'angular';

class TranslateService {
  constructor($translate) {
    this.$translate = $translate;
  }

  /**
   * @ngdoc method
   *
   * @name translate#async
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
   *   $scope.var = value;
   * })
   * </pre>
   *
   * This passes in a key and a variable that replaces any
   * instance of ``{{name}}`` within the key:
   *
   * <pre>
   * akamTranslate.async('key', {name:"xxx"}).then(function(value){
   *   $scope.var = value;
   * })
   * </pre>
   *
   * This passes in keys as an array, in which case variable
   * replacement is not possible:
   *
   * <pre>
   * akamTranslate.async([key1, key2, key3]).then(function(values){
   *   $scope.var1 = values[key1];
   *   $scope.var2 = values[key2];
   *   $scope.var3 = values[key3];
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
   *   akamTranslate.async('key').then(function(value){
   *     $scope.var = value;
   *   })
   * });
   * </pre>
   *
   * @param {String[] | String} keys String key or array of keys.
   * If it is an array, return values are available in
   * `values[key[index]]`.
   *
   * @param {Object} [args] A hash containing variable
   * replacements. This option is only available when the `key`
   * is a string.
   *
   * @param {String} [defaultKey] if [keys] is an undefined string
   * and [defaultKey] is a defined string, translate defaultKey
   *
   * @return {String} translated string
   */
  async(keys, args, defaultKey) {
    if (angular.isArray(keys)) {
      return this.$translate(keys);
    }

    if (angular.isDefined(keys) && keys !== '') {
      return this.$translate(keys, args);
    }

    if (angular.isDefined(defaultKey) && defaultKey !== '') {
      return this.$translate(defaultKey);
    }

    return this.$translate(keys, args);
  }

  /**
   * @ngdoc method
   * @name translate#sync
   *
   * @description Translates a key string immediately.
   *
   * **NOTE** If this method is called before the translations has been loaded, then the return
   * value will simply be the key that is input as an argument. By itself, this isn't so bad, but
   * if your application assigns the result of this call to a value that is only one-time bound
   * then it is possible to see untranslated values inside of your application. When possible,
   * favor the asynchronous method.
   *
   * Use this only once the translation table has loaded, otherwise the async method is more
   * appropriate. When blocking the application is not a problem, best practice is to assign
   * return values to non-`$scope` variables. For example:
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
   *   var value = akamTranslate.sync(key, args);
   *   // ...
   * });
   * </pre>
   *
   * @param {String} key string of key name.
   *
   * @param {Object} [args] is hash that contains variable
   * replacements.
   *
   * @param {String} [defaultKey] if [key] is an undefined string
   * and [defaultKey] is a defined string, translate defaultKey
   *
   * @return {String} translated string
   */
  sync(key, args, defaultKey) {
    if(angular.isDefined(key) && key !== '') {
      return this.$translate.instant(key, args);
    } else if (angular.isDefined(defaultKey) && defaultKey !== '') {
      return this.$translate.instant(defaultKey, args);
    }

    return this.$translate.instant(key, args);
  }
}

function translateServiceFactory($translate) {
  return new TranslateService($translate);
}

translateServiceFactory.$inject = ['$translate'];
export default translateServiceFactory;
