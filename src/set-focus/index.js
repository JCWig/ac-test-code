import angular from 'angular';
import setFocusDirective from './set-focus-directive';

export default angular.module('akamai.components.set-focus', [])
  
  .directive('akamSetFocus', setFocusDirective);
