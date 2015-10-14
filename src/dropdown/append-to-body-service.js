import angular from 'angular';
import debounce from 'lodash/function/debounce';

export default class appendToBodyService {
  static get $inject() {
    return ['$timeout', '$document'];
  }

  constructor($timeout, $document) {
    this.$timeout = $timeout;
    this.$document = $document;
  }

  setAppendToBodyCoords(elem, menuElem) {
    let menu = elem.children(0)[0];

    menuElem.css({
      left: menu.offsetLeft + 'px',
      top: menu.offsetTop + menu.offsetHeight + 'px'
    });
  }

  appendToBody(elem, menuElem, callBack) {
    this.$timeout(() => {
      menuElem.addClass('append-body util-hide');
      this.setAppendToBodyCoords(elem, menuElem);
      angular.element(this.$document.find('body')).append(menuElem);
      let windowElement = angular.element(window);

      windowElement.on('resize', debounce(() => {
        this.setAppendToBodyCoords(elem, menuElem);
      }, 200));
      elem.on('$destroy', function() {
        windowElement.off('resize');
      });

      if (angular.isFunction(callBack)) {
        callBack();
      }

    });

  }
}