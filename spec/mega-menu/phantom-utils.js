'use strict';

// collection of utilities for use in phantom tests
var fs = require('fs');

// needs to be done for phantom because jQuery.click doesn't get properly called because there is no Function.prototype.bind
// remove when we upgrade to phantom 2.0
function clickElement($el) {
  var el = $el.get(0);
  var ev = document.createEvent('MouseEvent');
  ev.initMouseEvent(
    'click',
    true /* bubble */, true /* cancelable */,
    window, null,
    0, 0, 0, 0, /* coordinates */
    false, false, false, false, /* modifier keys */
    0 /*left*/, null
  );
  el.dispatchEvent(ev);
}

// borrowed from http://stackoverflow.com/a/12522769. This uses a generic event to trigger the keyup event
function keyup($el, code) {
  var el = $el.get(0);
  var eventObj = document.createEventObject ?
    document.createEventObject() : document.createEvent('Events');

  if (eventObj.initEvent) {
    eventObj.initEvent('keyup', true, true);
  }
  eventObj.keyCode = code;
  eventObj.which = code;

  el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent('onkeyup', eventObj);
}

function keydown($el, code) {
  var el = $el.get(0);
  var eventObj = document.createEventObject ?
    document.createEventObject() : document.createEvent('Events');

  if (eventObj.initEvent) {
    eventObj.initEvent('keydown', true, true);
  }
  eventObj.keyCode = code;
  eventObj.which = code;

  el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent('onkeydown', eventObj);
}

var translations = fs.readFileSync('assets/locales/mega-menu/en_US.json', 'utf-8');

module.exports = {
  clickElement: clickElement,
  keyup: keyup,
  keydown: keydown,
  translations: translations
};
