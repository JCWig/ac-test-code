'use strict';

/**
 * @ngdoc object
 * @name breadcrumbs
 * @requires utils.renderer
 * @description
 * Module for showing the breadcrumbs
 */
var renderer = require('../utils/renderer'),
  template = require('./breadcrumbs.hbs');

var selector = '#modular-mega-menu-header .mega-menu-breadcrumb';

/**
 * @ngdoc function
 * @methodOf breadcrumbs
 * @name breadcrumbs.render
 * @param {GroupInfo} group Object representing the current group.
 * @description
 * Renders the message count
 */
module.exports = {
  render: function(group) {
    var breadcrumbs = [], current = group;

    while (current && current.id) {

      // is a property
      if (current.group) {
        breadcrumbs.unshift({
          gid: current.group.id,
          aid: current.id,
          title: current.name
        });
        current = current.group;
      } else {
        breadcrumbs.unshift({
          gid: current.id,
          title: current.name
        });
        current = current.parent;
      }
    }

    renderer.render(selector, template, breadcrumbs);
  }
};

