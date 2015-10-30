import template from './templates/date-picker-month-popup.tpl.html';
import { eventNoopHanlder } from './daypicker-decorator';

function monthPickerDecorator($provide) {
  function monthPickerDirective($delegate) {
    let link;

    // since: directives could potentially share names, the provider returns an array
    // therefore: get the first item as we know we only have one.
    let directive = $delegate[0];

    // override the default template for monthpicker (template is evaluated before templateUrl)
    directive.template = template;

    //this is needed to prevent angular errors with double defined directives
    directive.templateUrl = undefined;

    // reference the original link function
    link = directive.link;

    //redefine the compile to do both the old link function and add additional scoped functions
    directive.compile = () => {
      return function(scope, element, attrs, ctrl) {
        let updateMin, updateMax;

        link.apply(this, arguments);

        //overrides datepicker.js keydown event
        element.bind('keydown', eventNoopHanlder.arrowKeysEventNoop);
        element.bind('click', eventNoopHanlder.anyEventNoop);

        //disable navigation according to the range
        scope.monthpickerNavPrevDisabled = () => {
          let firstMonth = new Date(ctrl.activeDate.getFullYear(), 0, 1);

          return ctrl.minDate && firstMonth <= ctrl.minDate;
        };

        scope.monthpickerNavNextDisabled = () => {
          let lastMonth = new Date(ctrl.activeDate.getFullYear(), 11, 31);

          return ctrl.maxDate && lastMonth >= ctrl.maxDate;
        };

        updateMax = scope.$on('monthpicker.updateMaxDate', (e, info) => {
          ctrl.maxDate = info.maxDate;
          if (info.reset || ctrl.activeDate.getTime() > ctrl.maxDate.getTime()) {
            ctrl.activeDate = info.selectedDate || new Date();
          }
          ctrl.refreshView();
        });

        updateMin = scope.$on('monthpicker.updateMinDate', (e, info) => {
          ctrl.minDate = info.minDate;
          if (info.reset || ctrl.activeDate.getTime() < ctrl.minDate.getTime()) {
            ctrl.activeDate = info.selectedDate || new Date();
          }
          ctrl.refreshView();
        });

        scope.$on('$destroy', () => {
          element.off('keydown');
          element.off('click');
          updateMax();
          updateMin();
        });
      };
    };
    return $delegate;
  }

  monthPickerDirective.$inject = ['$delegate'];
  $provide.decorator('monthpickerDirective', monthPickerDirective);
}

monthPickerDecorator.$inject = ['$provide'];
export default monthPickerDecorator;