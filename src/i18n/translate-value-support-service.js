import angular from 'angular';

function translateValueSupport($parse) {
  return {
    forDirective: (ctrl, name, values) => {
      let getValues = $parse(values);

      if (getValues !== angular.noop) {
        ctrl[name + 'Values'] = getValues();
      }
    },
    forService: () => {} //TBI
  };
}
translateValueSupport.$inject = ['$parse'];
export default translateValueSupport;
