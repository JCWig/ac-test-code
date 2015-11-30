import angular from 'angular';

const sortableClass = 'column-sortable';

function TableTemplateService($log) {

  function getHeaderTemplate(element, attributes, selectable) {
    let template = '', headerHtml;

    // add select all checkbox
    if (selectable) {
      template += '<th class="column-checkbox"></th>';
    }

    if (!element || element.children.length === 0) {
      $log.warn('Expected "akam-table-column" tag found nothing');
    } else {
      angular.forEach(element.children, (elem) => {
        // clone the element because we will be modifying it with setAttribute and classList
        let elemClone = angular.element(elem).clone()[0];

        if (elemClone.nodeName.toLowerCase() !== 'akam-table-column') {
          $log.warn('Expected "akam-table-column" tag, found',
            elemClone.nodeName.toLowerCase());
          return;
        }

        // set up ng-click and ng-class for handling sorting
        if (isSortable(elemClone, attributes)) {
          elemClone.classList.add(sortableClass);

          elemClone.setAttribute('ng-class',
            `table.sortDirectionClass("${elemClone.getAttribute('row-property')}")`);

          elemClone.setAttribute('ng-click',
            `table.sortColumn("${elemClone.getAttribute('row-property')}")`);

          // akam-text-overflow expects a fully translated string already, so if the user
          // defines an akam-text-overflow for a table row, we will replace it with a title tag
          // with the translated value (using the translate filter). This is a trade-off
          // between adding unnecessary watches for every <th> item and delaying compiling this
          // element until we can translate the table header string.
          if (elemClone.hasAttribute('akam-text-overflow')) {
            elemClone.removeAttribute('akam-text-overflow');

            elemClone.setAttribute('title',
              `{{ \'${elemClone.getAttribute('header-name')}\' | translate}}`);
          }

        }

        headerHtml = `<span translate="${elemClone.getAttribute('header-name')}"></span>
                      <i ng-class="{
                        'aci-arrow-bottom': table.isAscending(),
                        'aci-arrow-top': !table.isAscending()}"></i>`;

        let tpl = elemClone.outerHTML.replace('<akam-table-column', '<th');

        tpl = tpl.replace('akam-table-column>', 'th>');
        tpl = angular.element(tpl).html(headerHtml)[0].outerHTML;

        template += tpl;
      });
    }
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
    let template = '';

    if (selectable) {
      template += `
        <td class="column-checkbox">
          <input type="checkbox" ng-model="table.selectedItemsMap[table.idPropertyFn(row)]"
                 ng-change="table.toggleSelected(row)" id="{{ table.id + \'-item-\' + $index }}">
          <label for="{{ table.id + \'-item-\' + $index }}"></label>
        </td>`;
    }

    if (!element || element.children.length === 0) {
      $log.warn('Expected "akam-table-row" tag found nothing');
    } else {
      angular.forEach(element.children, (elem) => {
        let content;

        if (elem.nodeName.toLowerCase() !== 'akam-table-column') {
          $log.warn('Expected "akam-table-column" tag, found', elem.nodeName.toLowerCase());
          return;
        }

        // a monstrosity that is used to determine if the row is sortable or filterable and a row
        // property isn't defined.
        if (!elem.hasAttribute('row-property') &&
          (!angular.isDefined(attributes.notSortable) && !elem.hasAttribute('not-sortable') ||
          !angular.isDefined(attributes.notFilterable) && !elem.hasAttribute('not-filterable'))) {

          $log.debug('', elem, ' has no "row-property" attribute defined. The column will' +
            'be neither filterable nor sortable. Add "not-filterable" and "not-sortable"' +
            'to suppress this message.');
        }

        let tpl = elem.outerHTML.replace('<akam-table-column', '<td');

        tpl = tpl.replace('akam-table-column>', 'td>');

        if (elem.innerHTML.trim()) {
          content = elem.innerHTML;
        } else {
          content = `{{ row.${elem.getAttribute('row-property')}}}`;
        }

        tpl = angular.element(tpl).html(content)[0].outerHTML;

        template += tpl;
      });
    }
    return template;
  }

  function isSortable(element, attributes) {
    return !angular.isDefined(attributes.notSortable) && !element.hasAttribute('not-sortable') &&
      element.hasAttribute('row-property');
  }

  return {
    template: function(element, attributes, selectable) {
      return `<table class="table table-striped table-hover">
              <thead><tr>${getHeaderTemplate(element[0], attributes, selectable)}</tr></thead>
              <tbody>
                <tr ng-repeat="row in table.filtered track by table.idPropertyFn(row)"
                    ng-class="table.rowSelectedClass(table.idPropertyFn(row))">
                    ${getRowTemplate(element[0], attributes, selectable)}
                </tr>
              </tbody>
            </table>`;
    }
  };

}

TableTemplateService.$inject = ['$log'];

export default TableTemplateService;
