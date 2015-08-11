import angular from 'angular';

function standaloneDirective() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      let wrapperDiv;
      let regex = /^akam-/;

      angular.forEach(element[0].classList, className => {
        // Needed for directives with replace = true
        if (className.match(regex)) {
          wrapperDiv = element[0];
        }
      });
      if (!wrapperDiv) {
        wrapperDiv = element[0].querySelector('[class^="akam-"]');
      }
      angular.element(wrapperDiv).addClass('standalone');
    }
  };
}

export default standaloneDirective;