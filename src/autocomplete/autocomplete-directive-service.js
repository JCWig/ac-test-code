'use strict';

var angular = require('angular');

module.exports = function($q, $log, $templateCache) {

  var consts = {
    ITEM_TEMPLATE_URL_PARTIAL: '/templates/',
    DEFAULT_TEMPLATE_NAME: 'autocomplete-item.tpl.html',
    CUSTOM_CONTENT: 'akam-autocomplete-item',
    SEARCH_MINIMUM: 1
  };

  /**
   * extract a common method used in child directive to
   * get content element from trnasclude clone element
   * @param  {function} transcludeFn a clone attched function
   * @return {element} return cloned element
   */
  function extract(transcludeFn) {
    var content = '',
      contentElem;

    transcludeFn(function(cloneElements) {
      angular.forEach(cloneElements, function(elem) {
        if (elem.nodeType !== 3) { //remove space node
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
   * addTo a method adds a child controller to parent controller list
   * use this way to access child controler in linkFn function to get content
   * @param {array} arrCtrls array of controller list
   * @param {string} name child contrller name
   */
  function addTo(arrCtrls, name) {
    var childCtrl = arrCtrls[0],
      parentCtrl = arrCtrls[1];

    childCtrl.name = name;
    parentCtrl.register(childCtrl);
  }

  /**
   * search a method used for async server call
   * @param  {object} ctrl directive controller
   * @param  {string} term search term
   * @return {object} a promise object
   */
  function search(ctrl, term) {
    return new Promise(function(resolve, reject) {
      var asyncSearch = ctrl.onSearch({
        term: term
      });

      $q.when(asyncSearch)
        .then(function(rawData) {
          resolve(normalizeData(ctrl, rawData));
        })
        .catch(function(reason) {
          ctrl.items = [];
          $log.error('onSearch call to the server return error: ' + reason.message);
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
  function normalizeData(ctrl, rawData) {
    var data = rawData,
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
    //hide loading

    //add new property to be used as combined display text
    //and text-property is required
    angular.forEach(data, function(item) {
      if (ctrl.textProperties && ctrl.textProperties.length) {
        angular.forEach(ctrl.textProperties, function(name, i) {
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
   * setItems a method that determines 2 things depends on where custom content provided or not
   * if provided, it will use provided, else use from default static file as basic format
   * @param {object} ctrl directive controller
   * @param {string} contentHtml html items content from child directive
   */
  function setItems(ctrl, contentHtml) {
    var contentUrl = consts.ITEM_TEMPLATE_URL_PARTIAL + consts.DEFAULT_TEMPLATE_NAME;

    if (contentHtml.length) {
      contentUrl = consts.ITEM_TEMPLATE_URL_PARTIAL + ctrl.autocompleteId + '.html';
    } else {
      contentHtml = require('./templates/autocomplete-items.tpl.html');
    }
    $templateCache.put(contentUrl, contentHtml.trim());
    ctrl.contentTemplateUrl = contentUrl;
  }

  /**
   * setSelected a method do a few tsks here:
   * 1. Add hasContentProvided state to directive controller
   * 2. Insert custom content to second span's innerHTML
   * 3. Return selected element to caller for insert to main element
   * @param {object} ctrl directive controller
   * @param {type} contentHtml html item content from child directive
   * @return {element} selectedContentElement
   */
  function setSelected(ctrl, contentHtml) {
    var selectedContentElement =
      angular.element(require('./templates/autocomplete-selected.tpl.html')),
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

  return {
    extractContent: extract,
    addToParent: addTo,
    asyncSearch: search,
    setItemsTemplate: setItems,
    setSelectedItemTemplate: setSelected
  };
};

module.exports.$inject = ['$q', '$log', '$templateCache'];
