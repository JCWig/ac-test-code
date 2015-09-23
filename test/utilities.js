'use strict';

import angular from 'angular';

module.exports = {

  LIBRARY_PATH: /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/,

  CONFIG_PATH: '/apps/appname/locales/en_US.json',

  find: function(obj) {
    var el;
    if (typeof obj === 'string' || obj instanceof String) {
      el = document.querySelector(obj);
    } else {
      el = obj;
    }

    return el;
  },
  findElement: function(parent, selector) {
    let element;

    if (!parent || !selector) {
      return undefined;
    }
    let parentElem;

    if (parent.html) {
      parentElem = parent[0];
    }
    return angular.element(parentElem.querySelector(selector));
  },
  triggerMouseEvent: function(obj, eventType) {
    var el = this.find(obj);
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent(eventType, true);
    el.dispatchEvent(ev);
  },
  click: function(obj) {
    this.triggerMouseEvent(obj, 'click');
  },
  dblClick: function(obj) {
    this.triggerMouseEvent(obj, 'dblclick');
  },
  mouseHover: function(obj) {
    this.triggerMouseEvent(obj, 'mouseover');
  },
  mouseLeave: function(obj) {
    this.triggerMouseEvent(obj, 'mouseout');
  },
  triggerKeyboardEvent: function(obj, eventType, keyCode) {
    var el = this.find(obj);
    var e = document.createEvent('KeyboardEvent');
    e.initKeyboardEvent(eventType, true);
    e.which = keyCode;
    el.dispatchEvent(e);
  },
  keyDown: function(obj, keyCode) {
    this.triggerKeyboardEvent(obj, 'keydown', keyCode);
  },
  clickAwayCreationAndClick: function(ele) {
    var clickAwayArea = document.createElement(ele);
    clickAwayArea.setAttribute("id", "click-away");
    document.body.appendChild(clickAwayArea);
    var clickAwayButton = document.querySelector('#click-away');
    this.click(clickAwayButton);
    document.body.removeChild(clickAwayArea);
  },
  scroll: function(obj, distance) {
    var domEle = this.find(obj);

    domEle.scrollTop = distance;
    var element = angular.element(domEle);
    element.triggerHandler('scroll');
  },
  getMonthInEnglish: function(num) {
    var date = new Date();
    var month = (num || num === 0) ? num : date.getMonth();
    return moment.months(month);
  },
  getTodaysYear: function() {
    var date = new Date();
    return date.getFullYear();
  },
  getTodaysMonth: function() {
    var date = new Date();
    return date.getMonth();
  },
  formatInteger: function(length, numStr) {
    while (numStr.length < length) {
      numStr = "0" + numStr;
    }
    return numStr;
  },
  getFormattedDate: function(dateString) {
    var dateObject = moment(dateString);
    return dateObject.format("ddd, MMM DD, YYYY");
  },
  getTodaysDay: function() {
    var date = new Date();
    return date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  }
};