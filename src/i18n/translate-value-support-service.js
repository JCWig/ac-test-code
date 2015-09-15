import angular from 'angular';

function translateValueSupport($parse) {
  return {
    setValues: (ctrl, name, values) => {
      let getValues = $parse(values);

      if (getValues !== angular.noop) {
        ctrl[name + 'Values'] = getValues();
      }
    }
  };
}
translateValueSupport.$inject = ['$parse'];
export default translateValueSupport;
