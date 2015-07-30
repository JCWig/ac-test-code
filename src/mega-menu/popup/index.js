var HIDE_CLASS = require('../utils/constants').HIDE_CLASS;

/**
 * @name popup
 * @requires util.constants
 * @description
 * Module for showing and hiding individual popups in the Mega Menu. Since there can be many
 * popups, we export a constructor function. While we do expect proper CSS to be written to
 * absolutely position the target element relative to its parent, we still need to do some pixel
 * math in order to make the arrow point to the proper place. In most cases, we want the tip of the
 * arrow to be pointing at the bottom edge of its parent element.
 * @param {HTMLElement} el This element. Will toggle class state on this element.
 * @param {HTMLElement} parent Relative DOM parent element. This is used to calculate where the
 * arrow will be placed so that it horizontally aligned with the width of this element.
 * @returns {popup} An instance of this class.
 */
function Popup(el, parent) {
  // nice shorthand for those who hate 'new'
  if (!(this instanceof Popup)) {
    return new Popup(el, parent);
  }

  this.el = el;
  this.arrow = el.querySelector('.util-arrow-up');
  this.parent = parent;
}

/**
 * @methodOf popup
 * @name popup.show
 * @description
 * Shows this popup
 */
Popup.prototype.show = function() {
  this.hide();
  this.toggle();
};

/**
 * @methodOf popup
 * @name popup.toggle
 * @description
 * Toggles the shown state of this popup
 */
Popup.prototype.toggle = function() {
  var thisRect, parentRect, arrowWidth, toMoveX;

  this.el.classList.toggle(HIDE_CLASS);

  // these have to come after we show the nav element or else the variables are all 0
  thisRect = this.el.getBoundingClientRect();
  parentRect = this.parent.getBoundingClientRect();
  arrowWidth = this.arrow.getBoundingClientRect().width;

  // calculate where the arrow should be horizontally.
  toMoveX = parentRect.left - thisRect.left - arrowWidth + parentRect.width / 2;
  this.arrow.style['margin-left'] = toMoveX + 'px';
};

/**
 * @methodOf popup
 * @name popup.hide
 * @description
 * Hides this popup
 */
Popup.prototype.hide = function() {
  this.el.classList.add(HIDE_CLASS);
};

module.exports = Popup;
