import template from './templates/date-picker-day-popup.tpl.html';

export function arrowUpDownEventNoop(e) {
  let key = e.which || e.keyCode;

  if (key === 38 || key === 40) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function daypickerDecorator($provide) {
  function datePickerDirective($delegate) {
    let link;

    // since: directives could potentially share names, the provider returns an array
    // therefore: get the first item as we know we only have one.
    let directive = $delegate[0];

    // override the default template for daypicker (template is evaluated before templateUrl)
    directive.template = template;
    directive.templateUrl = undefined;

    // reference the original link function
    link = directive.link;

    directive.compile = () => {
      return function(scope, element, attrs, ctrl) {
        let updateMin, updateMax;

        link.apply(this, arguments);

        //overrides datepicker.js keydown event
        element.bind('keydown', arrowUpDownEventNoop);

        //disable navigation according to the range
        scope.daypickerNavPrevDisabled = () => {
          let firstDayOfMonth = new Date(ctrl.activeDate.getFullYear(),
            ctrl.activeDate.getMonth(), 1);

          return ctrl.minDate && firstDayOfMonth <= ctrl.minDate;
        };

        scope.daypickerNavNextDisabled = () => {
          // calculate last day of month by using the 0th day trick:
          // if values are greater/lesser than their logical range,
          // the adjacent value will be adjusted.
          let lastDayOfMonth =
            new Date(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth() + 1, 0);

          return ctrl.maxDate && lastDayOfMonth >= ctrl.maxDate;
        };

        updateMax = scope.$on('datepicker.updateMax', (e, info) => {
          ctrl.maxDate = info.max;
        });

        updateMin = scope.$on('datepicker.updateMin', (e, info) => {
          ctrl.minDate = info.min;
        });

        scope.$on('$destroy', () => {
          updateMin();
          updateMax();
          element.off('keydown');
        });
      };
    };
    return $delegate;
  }

  datePickerDirective.$inject = ['$delegate'];
  $provide.decorator('daypickerDirective', datePickerDirective);
}

daypickerDecorator.$inject = ['$provide'];
export default daypickerDecorator;
