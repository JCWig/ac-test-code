function noopLoader($q) {

  // simple i18n loader that resolves with no translation data. Useful in tests
  return () => {
    const deferred = $q.defer();

    deferred.resolve({});
    return deferred.promise;
  };
}

noopLoader.$inject = ['$q'];

export default noopLoader;