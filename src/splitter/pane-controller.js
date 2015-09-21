class PaneController{
  static get $inject() {
    return ['$scope'];
  }

  hide() {
    this.collapse = true;
  }

  show() {
    this.collapse = false;
  }
};

export default PaneController;
