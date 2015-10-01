angular.module('navApp', ['akamai.components.tabs'])
  .controller('NavAppController', NavAppController);

function NavAppController() {
  this.foo = 'bar';
}
