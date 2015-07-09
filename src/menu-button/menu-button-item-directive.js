module.exports = function(options) {
  return function() {
    return {
      restrict: 'E',
      replace: true,
      require: '^' + options.require,
      scope: {
        text: '@'
      },
      template: '<li><a href="javascript:void(0);">{{ text }}</a></li>'
    };
  };
};
