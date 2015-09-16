/* globals angular, beforeEach, afterEach, sinon, $ */

'use strict';

var menu = require('../../src/mega-menu/menu'),
  clickElement = require('./phantom-utils').clickElement,
  config = require('./phantom-utils').config,
  CONFIG_URL = require('./phantom-utils').CONFIG_URL,
  HIDE_CLASS = require('../../src/mega-menu/utils/constants').HIDE_CLASS,
  TABS_SELECTOR = require('../../src/mega-menu/menu/tabs').selector;

var data = {
  accounts: null,
  hasAccounts: 'true',
  contextTitle: 'Select Group or Property',
  currentAccount: 'Crinkle Ball Inc',
  tabs: [
    {
      active: true,
      tabId: 1,
      itemId: 1,
      englishName: 'MONITOR',
      url: null,
      name: 'MONITOR',
      columns: [
        {
          mainMenuItems: [
            {
              itemId: 16640,
              url: null,
              name: 'Site',
              subMenuItems: [
                {
                  itemId: 16819,
                  cps: null,
                  subMenuItems: null,
                  dps: null,
                  contextId: 0,
                  url: '/core-reports/views/user_traffic.do',
                  name: 'User Traffic'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      active: false,
      tabId: 2,
      itemId: 2,
      englishName: 'CONFIGURE',
      url: null,
      name: ',',
      columns: [
        {
          mainMenuItems: [
            {
              itemId: 16640,
              url: null,
              name: 'Site',
              subMenuItems: [
                {
                  itemId: 18579,
                  cps: null,
                  subMenuItems: null,
                  dps: null,
                  contextId: 0,
                  url: '',
                  name: 'Configure sub'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      url: null,
      englishName: 'RESOLVE',
      name: 'RESOLVE',
      tabId: 4,
      itemId: 4,
      columns: [
        {
          mainMenuItems: [
            {
              url: '/resolve/diagnostic_tools',
              cps: null,
              subMenuItems: [],
              dps: null,
              itemId: 18458,
              contextId: 0,
              name: 'Diagnostic Tools'
            }
          ]
        }
      ]
    }
  ],
  users: {
    textLoggedInAs: null,
    mainMenuItems: [
      {
        itemId: 0,
        contextId: 0,
        url: '/portal/profile/edit_profile.jsf',
        name: 'Settings'
      }
    ],
    current: 'Stella Cat',
    impersonator: null
  }
};

describe('menu', function() {

  var $scope, $compile;

  // cleanup mega menu mocking messiness.
  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  beforeEach(function() {

    angular.mock.inject.strictDi(true);
    angular.mock.module(require('../../src/mega-menu').name);
    angular.mock.module(function(contextProvider) {
      contextProvider.setApplicationContext(contextProvider.OTHER_CONTEXT);
    });
    angular.mock.inject(function($rootScope, _$compile_, $httpBackend) {
      $scope = $rootScope;
      $compile = _$compile_;
      $httpBackend.when('GET', CONFIG_URL).respond(config());
    });

    this.el = $compile('<akam-menu-header></akam-menu-header>' +
    '<akam-menu-footer></akam-menu-footer>')($scope);
    $scope.$digest();
    this.element = document.body.appendChild(this.el[0]);

    this.server = sinon.fakeServer.create();
  });

  afterEach(function() {
    this.server.restore();
  });

  it('should render on success', function() {
    var spy = jasmine.createSpy('spy');

    menu.render(data, spy);

    // this may cause the config call to be done for the first time
    this.server.respond();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should render on success, even with a bogus callback', function() {
    menu.render(data, 'BOGUS');

    // this will not cause the config call to fetch because the above test will (if it hasn't happened already)
    this.server.respond();
  });

  describe('tabs', function() {

    // checks all tabs for either hidden
    var tabsAllHidden = function() {
      $(TABS_SELECTOR + ' nav').each(function() {
        if (!$(this).hasClass(HIDE_CLASS)) {
          return false;
        }
      });
      return true;
    };

    // gets a <section> for a tab with a given name
    var getTab = function(name) {
      return $(TABS_SELECTOR + ' h1:contains("' + name + '")').parent();
    };

    beforeEach(function() {
      menu.render(data);
      this.server.respond();
    });

    it('should be hidden by default', function() {
      expect(tabsAllHidden()).toBe(true);
    });

    it('should be show tab when triggered', function() {
      var tab = getTab('MONITOR'),
        nav = tab.find('nav');

      expect(nav.hasClass(HIDE_CLASS)).toBe(true);
      // replace with tab.click() when we upgrade phantom to 2.0
      clickElement(tab);
      expect(nav.hasClass(HIDE_CLASS)).not.toBe(true);
    });

    it('should close a previous tab when opening a new one', function() {
      var monitorTab = getTab('MONITOR'),
        resolveTab = getTab('RESOLVE');

      clickElement(monitorTab);
      expect(monitorTab.find('nav').hasClass(HIDE_CLASS)).not.toBe(true);
      expect(resolveTab.find('nav').hasClass(HIDE_CLASS)).toBe(true);

      clickElement(resolveTab);
      expect(monitorTab.find('nav').hasClass(HIDE_CLASS)).toBe(true);
      expect(resolveTab.find('nav').hasClass(HIDE_CLASS)).not.toBe(true);
    });

    it('should hide all tabs when body is clicked', function() {
      var tab = getTab('MONITOR');

      clickElement(tab);
      clickElement($('body'));
      expect(tabsAllHidden()).toBe(true);
    });

    it('should toggle the tab when clicked multiple times', function() {
      var tab = getTab('MONITOR'),
        nav = tab.find('nav');

      clickElement(tab.find('h1:first'));
      expect(nav.hasClass(HIDE_CLASS)).not.toBe(true);

      clickElement(tab.find('h1:first'));
      expect(nav.hasClass(HIDE_CLASS)).toBe(true);
    });

    it('should keep the tab open when clicking its body', function() {
      var tab = getTab('MONITOR'),
        nav = tab.find('nav'),
        inside = tab.find('section:first');

      clickElement(tab);
      expect(nav.hasClass(HIDE_CLASS)).not.toBe(true);
      clickElement(inside);
      expect(nav.hasClass(HIDE_CLASS)).not.toBe(true);
    });

    // This test is triggering a page reload
    xit('should close the tab when clicking an menu item link', function() {
      var nav = getTab('CONFIGURE').find('nav');
      var menuItemLink = $(this.element.querySelector('a.mega-menu-item-link'));

      clickElement(menuItemLink);
      expect(nav.hasClass(HIDE_CLASS)).toBe(true);
    });


  });

});
