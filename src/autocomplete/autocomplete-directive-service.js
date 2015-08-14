import angular from 'angular';
import itemsTemplate from './templates/autocomplete-items.tpl.html';
import selectedItemTemplate from './templates/autocomplete-selected.tpl.html';

class AutocompleteService {
  constructor($q, $log, $templateCache, autocompleteConfig) {
    this.$q = $q;
    this.Promise = Promise;
    this.$log = $log;
    this.$templateCache = $templateCache;
    this.autocompleteConfig = autocompleteConfig;
  }

  /**
   * extractContent a common method used in child directive to
   * get content element from trnasclude clone element
   * @param  {function} transcludeFn a clone attched function
   * @return {element} return cloned element
   */
  extractContent(transcludeFn) {
    let content = '',
      contentElem;

    transcludeFn((cloneElements) => {
      angular.forEach(cloneElements, (elem) => {
        if (elem.nodeType === 1) { //only interested in element node
          contentElem = elem;
        }
      });
      if (contentElem) {
        content = contentElem.outerHTML;
      }
    });
    return content;
  }

  /**
   * asyncSearch a method used for async server call
   * @param  {object} ctrl directive controller
   * @param  {string} term search term
   * @return {object} a promise object
   */
  asyncSearch(ctrl, term) {
    return new this.Promise((resolve, reject) => {
      let asyncSearch = ctrl.onSearch({
        term: term
      });

      this.$q.when(asyncSearch)
        .then((rawData) => {
          resolve(this.normalizeData(ctrl, rawData));
        })
        .catch((reason) => {
          ctrl.items = [];
          this.$log.error(`onSearch call to the server return error: ${reason.message}`);
          reject(reason.message);
        });
    });
  }

  /**
   * normalizeData a provate function to massage the returned data
   * @param  {object} ctrl autocomplete directive controller
   * @param  {Array} rawData data return from server
   * @return {Array} modified data
   */
  normalizeData(ctrl, rawData) {
    let data = rawData,
      hasData = false,
      names = [];

    if (angular.isArray(data)) {
      hasData = data.length > 0;
    } else if (angular.isObject(data) || angular.isString(data) && data.length) {
      data = [data];
      hasData = true;
    } else {
      data = [];
    }

    ctrl.isOpen = hasData;

    //add new property to be used as combined display text
    //and text-property is required
    angular.forEach(data, (item) => {
      if (ctrl.textProperties && ctrl.textProperties.length) {
        angular.forEach(ctrl.textProperties, (name, i) => {
          names.push(item[name]);
          if (ctrl.textProperties.length - 1 === i) {
            item.selectedText = names.join(' ');
            names = [];
          }
        });
      }
    });
    return data;
  }

  /**
   * setItemsTemplate a method that determines 2 things depends on where custom content
   * provided or not. if provided, it will use provided one, else use from default static
   * file as basic format
   * @param {object} ctrl directive controller
   * @param {string} contentHtml html items content from child directive
   */
  setItemsTemplate(ctrl, contentHtml) {
    let contentUrl = this.autocompleteConfig.ITEM_TEMPLATE_URL_PARTIAL +
      this.autocompleteConfig.DEFAULT_TEMPLATE_NAME;

    if (contentHtml.length) {
      contentUrl = this.autocompleteConfig.ITEM_TEMPLATE_URL_PARTIAL +
        ctrl.autocompleteId + '.html';
    } else {
      contentHtml = itemsTemplate;
    }
    this.$templateCache.put(contentUrl, contentHtml.trim());
    ctrl.contentTemplateUrl = contentUrl;
  }

  /**
   * setSelectedItemTemplate a method do a few tsks here:
   * 1. Add hasContentProvided state to directive controller for render purpose
   * 2. Insert custom content to selected span's innerHTML
   * 3. Return selected element to caller for insert to main element
   * @param {object} ctrl directive controller
   * @param {type} contentHtml html item content from child directive
   * @return {element} selectedContentElement
   */
  setSelectedItemTemplate(ctrl, contentHtml) {
    var selectedContentElement =
      angular.element(selectedItemTemplate),
      customSelectedElem;

    if (contentHtml.length) {
      ctrl.hasContentProvided = true;
      //not ideal way locating that second span element
      customSelectedElem = selectedContentElement.children().find('span');
      customSelectedElem.html(contentHtml);
    } else {
      ctrl.hasContentProvided = false;
    }

    return selectedContentElement;
  }
}

function autocompleteServiceFactory($q, $log, $templateCache, autocompleteConfig) {
  if (angular.isUndefined(AutocompleteService.instance)) {
    AutocompleteService.instance =
      new AutocompleteService($q, $log, $templateCache, autocompleteConfig);
  }
  return AutocompleteService.instance;
}

autocompleteServiceFactory.$inject = ['$q', '$log', '$templateCache', 'autocompleteConfig'];
export default autocompleteServiceFactory;
