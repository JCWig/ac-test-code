import angular from 'angular';
import dropdown from '../dropdown';
import autocompleteDirective from './autocomplete-directive';

export default angular.module('akamai.components.autocomplete', [
  dropdown.name
])

.directive('akamAutocomplete', autocompleteDirective);
