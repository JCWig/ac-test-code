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
    template: `<div class="modal-body" ng-class="{'util-hidden-overflow': modalWindow.processing}">
                   <div ng-if="modalWindow.processing" class="backwash"></div>
               </div>`,
    link: function(scope, element) {
      getBodyTemplate(scope.modalWindow.templateModel)
        .then(content => element.append($compile(content)(scope.modalWindow.contentScope)));
    }
  };
}

modalWindowBody.$inject = ['$compile', '$http', '$templateCache', '$q'];

export default modalWindowBody;
