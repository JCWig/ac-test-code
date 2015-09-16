import angular from 'angular';
import DropdownSelectedRenderer from './dropdown-renderers/dropdown-selected-renderer';
import DropdownMenuRenderer from './dropdown-renderers/dropdown-menu-renderer';

function DropdownTemplateService() {

  return {
    getCustomMarkup: function(tElem, tagName) {
      if (tElem.find(tagName).length) {
        return tElem.find(tagName).html();
      } else {
        return '';
      }
    },
    stashTemplate: function(tElem, dropdownTemplate, tagName, markup) {
      let dropdownTemplateElem = angular.element(dropdownTemplate);

      dropdownTemplateElem.find(tagName + '-placeholder').html(markup);
      return dropdownTemplateElem[0].outerHTML;
    },
    transformTemplate: function(tElem, template, selectedTagName, optionTagName) {
      let dropdownTemplate;
      let selectedMarkup = this.getCustomMarkup(tElem, selectedTagName);
      let optionMarkup = this.getCustomMarkup(tElem, optionTagName);

      /*
       * If custom markup is provided for both the selected and option elements, then stash the
       * markup in their respective placeholders.
       *
       * If custom markup is provided for only the option element, then stash the option markup
       * in both the selected and option placeholders.
       *
       * If custom markup is not provided at all, return the template.
       */
      if (selectedMarkup && optionMarkup) {
        dropdownTemplate = this.stashTemplate(tElem, template, selectedTagName, selectedMarkup);

        return this.stashTemplate(tElem, dropdownTemplate, optionTagName, optionMarkup);
      } else if (optionMarkup) {
        dropdownTemplate = this.stashTemplate(tElem, template, selectedTagName, optionMarkup);
        return this.stashTemplate(tElem, dropdownTemplate, optionTagName, optionMarkup);
      } else {
        return template;
      }
    },
    DropdownSelectedRenderer: DropdownSelectedRenderer,
    DropdownMenuRenderer: DropdownMenuRenderer
  };
}

export default DropdownTemplateService;