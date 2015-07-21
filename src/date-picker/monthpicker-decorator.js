module.exports = function($provide) {
  function monthPickerDirective($delegate) {
    var link;

    // since: directives could potentially share names, the provider returns an array
    // therefore: get the first item as we know we only have one.
    var directive = $delegate[0];

    // override the default template for monthpicker (template is evaluated before templateUrl)
    directive.template = require('./templates/date-picker-month-popup.tpl.html');

    //this is needed to prevent angular errors with double defined directives
    directive.templateUrl = undefined;

    // reference the original link function
    link = directive.link;

    //redefine the compile to do both the old link function and add additional scoped functions
    directive.compile = function() {
      return function(scope, element, attrs, ctrl) {
        link.apply(this, arguments);

        //disable navigation according to the range
        scope.monthpickerNavPrevDisabled = function() {
          var firstMonth = new Date(ctrl.activeDate.getFullYear(), 0, 1);

          return ctrl.minDate && firstMonth <= ctrl.minDate;
        };

        scope.monthpickerNavNextDisabled = function() {
          var lastMonth = new Date(ctrl.activeDate.getFullYear(), 11, 31);

          return ctrl.maxDate && lastMonth >= ctrl.maxDate;
        };
      };
    };

    return $delegate;
  }

  monthPickerDirective.$inject = ['$delegate'];

  $provide.decorator('monthpickerDirective', monthPickerDirective);
};

module.exports.$inject = ['$provide'];