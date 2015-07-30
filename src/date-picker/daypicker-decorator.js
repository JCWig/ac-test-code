module.exports = function($provide) {
  function datePickerDirective($delegate) {
    var link;

    // since: directives could potentially share names, the provider returns an array
    // therefore: get the first item as we know we only have one.
    var directive = $delegate[0];

    // override the default template for daypicker (template is evaluated before templateUrl)
    directive.template = require('./templates/date-picker-day-popup.tpl.html');
    directive.templateUrl = undefined;

    // reference the original link function
    link = directive.link;

    directive.compile = function() {
      return function(scope, element, attrs, ctrl) {
        link.apply(this, arguments);

        //disable navigation according to the range
        scope.daypickerNavPrevDisabled = function() {
          var firstDayOfMonth = new Date(ctrl.activeDate.getFullYear(),
            ctrl.activeDate.getMonth(), 1);

          return ctrl.minDate && firstDayOfMonth <= ctrl.minDate;
        };

        scope.daypickerNavNextDisabled = function() {
          // calculate last day of month by using the 0th day trick:
          // if values are greater/lesser than their logical range,
          // the adjacent value will be adjusted.
          var lastDayOfMonth =
            new Date(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth() + 1, 0);

          return ctrl.maxDate && lastDayOfMonth >= ctrl.maxDate;
        };
      };
    };

    return $delegate;
  }

  datePickerDirective.$inject = ['$delegate'];

  $provide.decorator('daypickerDirective', datePickerDirective);
};

module.exports.$inject = ['$provide'];