'use strict';

var angular = require('angular');

var sortableClass = 'column-sortable';

/* @ngInject */
module.exports = function($log) {
  return {
    template: getTableTemplate
  };

  /**
   * Method to fetch the template string representing the <table> element contained inside of
   * a data table. Transforms an `akam-table-row` into a HTML table
   *
   * @param {HTMLElement} element the DOM element to operate on
   * @param {Object} attributes attributes given to the `akam-table` directive.
   * @param {Boolean} selectable Whether or not to add checkbox columns
   * @returns {String} The template to compile
   */
  function getTableTemplate(element, attributes, selectable) {
    var template;

    template = '<table><thead><tr>' +
    getHeaderTemplate(element[0], attributes, selectable) +
    '</tr></thead><tbody><tr ng-repeat="row in table.filtered track by table.idProperty(row)" ' +
    'ng-class="table.rowSelectedClass(table.idProperty(row))">' +
    getRowTemplate(element[0], attributes, selectable) +
    '</tr></tbody></table>';

    return template;
  }

  /**
   * Configures the template for the table header, including `th` elements. This will strip out
   * ng-click and ng-class from the akam-table-column.
   * @param {HTMLElement} element the `akam-table-row` element to compile.
   * @param {Object} attributes attributes given to the `akam-table` directive.
   * @param {Boolean} selectable Whether or not to add checkbox columns
   * @returns {String} the template string to compile for the header
   */
  function getHeaderTemplate(element, attributes, selectable) {
    var template = '', headerHtml;

    // add select all checkbox
    if (selectable) {
      template += '<th class="column-checkbox"></th>';
    }

    angular.forEach(element.children, function(elem) {
      // clone the element because we will be modifying it with setAttribute and classList
      var elemClone = angular.element(elem).clone()[0],
        tpl;

      if (elemClone.nodeName.toLowerCase() !== 'akam-table-column') {
        $log.warn('Expected "akam-table-column" tag, found', elemClone.nodeName.toLowerCase());
        return;
      }

      // set up ng-click and ng-class for handling sorting
      if (isSortable(elemClone, attributes)) {
        elemClone.classList.add(sortableClass);

        elemClone.setAttribute('ng-class', 'table.sortDirectionClass("' +
          elemClone.getAttribute('row-property') + '")');

        elemClone.setAttribute('ng-click', 'table.sortColumn("' +
          elemClone.getAttribute('row-property') + '")');
      }

      headerHtml = '<span akam-translate="' +
        elemClone.getAttribute('header-name') +
        '"></span><i></i>';

      tpl = elemClone.outerHTML.replace('<akam-table-column', '<th');
      tpl = tpl.replace('akam-table-column>', 'th>');
      tpl = angular.element(tpl).html(headerHtml)[0].outerHTML;

      template += tpl;
    });

    return template;
  }

  /**
   * Configures the template for the table row, including `td` elements.
   * @param {HTMLElement} element the `akam-table-row` element to compile.
   * @param {Object} attributes attributes given to the `akam-table` directive.
   * @param {Boolean} selectable Whether or not to add checkbox columns
   * @returns {String} the template string to compile for the header
   */
  function getRowTemplate(element, attributes, selectable) {
    var template = '';

    if (selectable) {
      template += '<td class="column-checkbox">' +
      '<input type="checkbox" ng-model="table.selectedRowsMap[table.idProperty(row)]" ' +
      'ng-change="table.toggleSelected(row)" id="{{ table.id + \'-item-\' + $index }}">' +
      '<label for="{{ table.id + \'-item-\' + $index }}"></label></td>';
    }

    angular.forEach(element.children, function(elem) {
      var tpl, content;

      if (elem.nodeName.toLowerCase() !== 'akam-table-column') {
        $log.warn('Expected "akam-table-column" tag, found', elem.nodeName.toLowerCase());
        return;
      }

      // a monstrosity that is used to determine if the row is sortable or filterable and a row
      // property isn't defined.
      if (!elem.hasAttribute('row-property') &&
        (!angular.isDefined(attributes.noSort) && !elem.hasAttribute('no-sort') ||
        !angular.isDefined(attributes.noFilter) && !elem.hasAttribute('no-filter'))) {

        $log.debug('', elem, ' has no "row-property" attribute defined. The column will' +
        'be neither filterable nor sortable. Add "no-filter" and "no-sort" to suppress this ' +
        'message.');
      }

      tpl = elem.outerHTML.replace('<akam-table-column', '<td');
      tpl = tpl.replace('akam-table-column>', 'td>');

      if (elem.innerHTML.trim()) {
        content = elem.innerHTML;
      } else {
        content = '{{ row.' + elem.getAttribute('row-property') + '}}';
      }

      tpl = angular.element(tpl).html(content)[0].outerHTML;

      template += tpl;
    });

    return template;
  }

  function isSortable(element, attributes) {
    return !angular.isDefined(attributes.noSort) &&
      !element.hasAttribute('no-sort') &&
      element.hasAttribute('row-property');
  }
};