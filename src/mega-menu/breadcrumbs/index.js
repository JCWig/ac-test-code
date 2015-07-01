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

    while (current) {
      breadcrumbs.unshift({
        gid: current.gid,
        aid: current.aid,
        title: current.title
      });

      current = current.parent;
    }

    renderer.render(selector, template, breadcrumbs);
  }
};

