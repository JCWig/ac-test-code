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

  setSize(size) {
    if (size && !isNaN(parseFloat(size))){
      this.size = parseFloat(size);
    }
  }

  getSize() {
    return this.size;
  }
};

export default PaneController;
