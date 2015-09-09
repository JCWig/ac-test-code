function TranslateDirective(translate) {
  return {
    restrict: 'A',
    link: (scope, elem, attr) => {
      let key = attr.akamTranslate;

      translate.async(key).then((value) => {
        elem.text(value);
      });
    }
  };
}

TranslateDirective.$inject = ['translate'];
export default TranslateDirective;
