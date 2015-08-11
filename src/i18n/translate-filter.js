import angular from 'angular';

function translateFilter($parse, translate) {
  let akamTranslateFilter = (translationId, params) => {
    if (!angular.isObject(params)) {
      params = $parse(params)(this);
    }
    return translate.sync(translationId, params);
  };

  akamTranslateFilter.$stateful = true;
  return akamTranslateFilter;
}

translateFilter.$inject = ['$parse', 'translate'];
export default translateFilter;
