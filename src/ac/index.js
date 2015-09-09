import angular from 'angular';
import dropdown from '../dropdown';
import acDirective from './ac-directive';

export default angular.module('akamai.components.ac', [
  dropdown.name
])

.directive('akamAc', acDirective);
