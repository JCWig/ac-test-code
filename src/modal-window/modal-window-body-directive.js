module.exports = function($compile, $http, $templateCache, $q) {
  function getBodyTemplate(modal) {
    if (modal.template) {
      return $q.when(modal.template);
    } else {
      return $http.get(modal.templateUrl, {cache: $templateCache})
        .then(function(result) {
          return result.data;
        });
    }
  }

  return {
    restrict: 'E',
    replace: true,
    template: '<div class="modal-body"><div ng-if="isProcessing()" class="backwash"></div></div>',
    link: function(scope, element) {
      getBodyTemplate(scope.modalWindow)
        .then(function(content) {
          element.append($compile(content)(scope));
        });
    }
  };
};
module.exports.$inject = ['$compile', '$http', '$templateCache', '$q'];
