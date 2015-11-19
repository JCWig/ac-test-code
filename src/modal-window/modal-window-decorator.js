import overrideModalWindowTemplate from './templates/window.tpl.html';

function modalWindowDecorator($provide) {
  function modalWindowDirective($delegate) {

    let directive = $delegate[0];
    directive.template = overrideModalWindowTemplate;
    directive.templateUrl = undefined;

    let link = directive.link;

    directive.compile = () => {
      return function() {
        link.apply(this, arguments);
      };
    };

    return $delegate;
  }
  modalWindowDirective.$inject = ['$delegate'];
  $provide.decorator('modalWindowDirective', modalWindowDirective);
}

modalWindowDecorator.$inject = ['$provide'];
export default modalWindowDecorator;