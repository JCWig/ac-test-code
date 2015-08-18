function modalWindowBody($compile, $http, $templateCache, $q) {

  function getBodyTemplate(modal) {
    if (modal.template) {
      return $q.when(modal.template);
    } else {
      return $http.get(modal.templateUrl, {cache: $templateCache})
        .then(result => result.data);
    }
  }

  return {
    restrict: 'E',
    replace: true,
    template: '<div class="modal-body"><div ng-if="isProcessing()" class="backwash"></div></div>',
    link: function(scope, element) {
      getBodyTemplate(scope.modalWindow)
        .then(content => element.append($compile(content)(scope)));
    }
  };
}

modalWindowBody.$inject = ['$compile', '$http', '$templateCache', '$q'];

export default modalWindowBody;
