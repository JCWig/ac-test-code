/*global angular, inject*/
/* eslint-disable max-nested-callbacks */

import navigation from '../../src/tabs';
import utils from '../utilities';

const TABS_NAME = 'akamTabs';

describe('akamai.components.tabs', function() {

  var stateSpy;

  beforeEach(angular.mock.module(navigation.name, function($provide) {
    inject.strictDi(true);

    stateSpy = {
      includes: function() {},
      go: function() {},
      is: function() {},
      $current: { locals: {} }
    };

    $provide.value('$state', stateSpy);
  }));

  beforeEach(function() {
    inject(function($rootScope, $compile) {
      this.$scope = $rootScope;
      this.$compile = $compile;
    });
  });

  afterEach(function() {
    if (this.element) {
      document.body.removeChild(this.element);
      this.element = null;
    }
  });

  function addElement(markup) {
    this.el = this.$compile(markup)(this.$scope);
    this.$scope.$digest();
    this.element = document.body.appendChild(this.el[0]);
  }

  describe('given a set of basic tabs', function() {
    describe('when rendering', function() {
      beforeEach(function() {

        let template = `
          <akam-tabs>
            <akam-tab heading="Tab 1">Tab 1 Content</akam-tab>
            <akam-tab heading="Tab 2">Tab 2 Content</akam-tab>
            <akam-tab heading="Tab 3">Tab 3 Content</akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);
      });

      it('should activate the first tab by default', function() {
        expect(this.el.controller(TABS_NAME).tabs[0].active).toBe(true);
      });
    });

    describe('when a tab is declared as active', function() {
      beforeEach(function() {

        let template = `
          <akam-tabs>
            <akam-tab heading="Tab 1">Tab 1 Content</akam-tab>
            <akam-tab heading="Tab 2" active="true">Tab 2 Content</akam-tab>
            <akam-tab heading="Tab 3">Tab 3 Content</akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);
      });

      it('should activate the tab', function() {
        expect(this.el.controller(TABS_NAME).tabs[1].active).toBe(true);
      })
    });

    describe('when a tab is declared as disabled', function() {
      beforeEach(function() {

        let template = `
          <akam-tabs>
            <akam-tab heading="Tab 1">Tab 1 Content</akam-tab>
            <akam-tab heading="Tab 2">Tab 2 Content</akam-tab>
            <akam-tab heading="Tab 3" disabled="true">Tab 3 Content</akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);
      });

      it('should disable the tab', function() {
        expect(this.el.controller(TABS_NAME).tabs[2].disabled).toBe(true);
      })
    });

    describe('when tabs are declared as secondary', function() {
      beforeEach(function() {

        let template = `
          <akam-tabs secondary>
            <akam-tab heading="Tab 1">Tab 1 Content</akam-tab>
            <akam-tab heading="Tab 2">Tab 2 Content</akam-tab>
            <akam-tab heading="Tab 3">Tab 3 Content</akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);
      });

      it('should render a secondary set of tabs', function() {
        expect(utils.findElement(this.el, 'ul.nav-pills')).toBeTruthy();
      })
    });

    describe('when tabs are declared as vertical', function() {
      beforeEach(function() {

        let template = `
          <akam-tabs vertical>
            <akam-tab heading="Tab 1">Tab 1 Content</akam-tab>
            <akam-tab heading="Tab 2">Tab 2 Content</akam-tab>
            <akam-tab heading="Tab 3">Tab 3 Content</akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);
      });

      it('should render a vertical set of tabs', function() {
        expect(utils.findElement(this.el, 'ul.nav-stacked')).toBeTruthy();
      })
    });

    describe('when an inactive tab is activated', function() {
      let tabsCtrl, activeTab, inactiveTab;
      beforeEach(function() {

        let template = `
          <akam-tabs>
            <akam-tab heading="Tab 1">Tab 1 Content</akam-tab>
            <akam-tab heading="Tab 2">Tab 2 Content</akam-tab>
            <akam-tab heading="Tab 3">Tab 3 Content</akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);
        tabsCtrl = this.el.controller(TABS_NAME);
        activeTab = tabsCtrl.tabs[0];
        inactiveTab = tabsCtrl.tabs[1];
        spyOn(activeTab.transcludeClone, 'remove');
        spyOn(activeTab.transcludeScope, '$destroy');
        tabsCtrl.tabContentElem.empty();
        inactiveTab.activate();
      });

      it('should remove the previously active tab\'s content', function() {
        expect(activeTab.transcludeClone.remove).toHaveBeenCalled();
      });

      it('should destroy the previously active tab\'s transclusion scope', function() {
        expect(activeTab.transcludeScope.$destroy).toHaveBeenCalled();
      });

      it('should  activate the tab', function() {
        expect(tabsCtrl.tabs[1].active).toBe(true);
      });

      it('should append the newly active tab\'s content', function() {
        expect(tabsCtrl.tabContentElem.children(0).html()).toBe('Tab 2 Content');
      });
    });

    describe('when a disabled tab is activated', function() {
      let tabsCtrl, inactiveTab;
      beforeEach(function() {

        let template = `
          <akam-tabs>
            <akam-tab heading="Tab 1">Tab 1 Content</akam-tab>
            <akam-tab heading="Tab 2" disabled="true">Tab 2 Content</akam-tab>
            <akam-tab heading="Tab 3">Tab 3 Content</akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);
        tabsCtrl = this.el.controller(TABS_NAME);
        inactiveTab = tabsCtrl.tabs[1];
        inactiveTab.activate();
      });

      it('should not activate the disabled tab', function() {
        expect(tabsCtrl.tabs[1].active).toBe(false);
      });
    });
  });

  describe('given a set of routable tabs', function() {
    describe('when rendering', function() {
      beforeEach(function() {

        spyOn(stateSpy, 'includes').and.callFake(function(tabRoute) {
          return tabRoute === 'tabs.tab1';
        });

        spyOn(this.$scope, '$on').and.returnValue(function() {});

        let template = `
          <akam-tabs routable>
            <akam-tab heading="Activity" state="tabs.tab1"></akam-tab>
            <akam-tab heading="Nutrition" state="tabs.tab2"></akam-tab>
            <akam-tab heading="Sleep" state="tabs.tab3"></akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);
      });

      it('should set the routable property', function() {
        expect(this.el.controller(TABS_NAME).routable).toBe(true);
      });

      it('should render the tab container', function() {
        expect(this.element.querySelector('.tab-container')).toBeDefined();
      });

      it('should render the individual tabs', function() {
        var tab = this.element.querySelector('.nav-tabs');
        expect(tab.getElementsByTagName('li').length).toBe(3);
      });

      it('should activate the first tab', function() {
        expect(this.el.controller(TABS_NAME).tabs[0].active).toBe(true);
      });

      it('should have called $state.includes for each tab', function() {
        expect(stateSpy.includes.calls.count()).toEqual(3);
      });

      it('should have registered tabs with state events', function() {
        let allCalls = this.$scope.$on.calls.allArgs().slice();

        expect(allCalls[4]).toEqual(['$stateChangeSuccess', jasmine.any(Function)]);
        expect(allCalls[5]).toEqual(['$stateChangeError', jasmine.any(Function)]);
        expect(allCalls[6]).toEqual(['$stateChangeCancel', jasmine.any(Function)]);
        expect(allCalls[7]).toEqual(['$stateNotFound', jasmine.any(Function)]);
      });
    });

    describe('when clicking on an inactive tab', function() {
      beforeEach(function() {

        spyOn(stateSpy, 'includes').and.callFake(function(tabRoute) {
          return tabRoute === 'tabs.tab1';
        });

        spyOn(stateSpy, 'is').and.returnValue(false);
        spyOn(stateSpy, 'go');

        let template = `
          <akam-tabs routable>
            <akam-tab heading="Activity" state="tabs.tab1"></akam-tab>
            <akam-tab heading="Nutrition" state="tabs.tab2"></akam-tab>
            <akam-tab heading="Sleep" state="tabs.tab3"></akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);

        let ctrl = this.el.controller(TABS_NAME);
        ctrl.activate(ctrl.tabs[1]);
      });

      it('should call $state.go with the inactive tab\'s route', function() {
        expect(stateSpy.go).toHaveBeenCalledWith('tabs.tab2', {}, {})
      });
    });

    describe('when clicking on an active tab', function() {
      beforeEach(function() {

        spyOn(stateSpy, 'includes').and.callFake(function(tabRoute) {
          return tabRoute === 'tabs.tab1';
        });

        spyOn(stateSpy, 'is').and.returnValue(true);
        spyOn(stateSpy, 'go');

        let template = `
          <akam-tabs routable>
            <akam-tab heading="Activity" state="tabs.tab1"></akam-tab>
            <akam-tab heading="Nutrition" state="tabs.tab2"></akam-tab>
            <akam-tab heading="Sleep" state="tabs.tab3"></akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);

        let ctrl = this.el.controller(TABS_NAME);
        ctrl.activate(ctrl.tabs[0]);
      });

      it('should not call $state.go with the active tab\'s route', function() {
        expect(stateSpy.go).not.toHaveBeenCalledWith('tabs.tab2', {}, {})
      });

    });

    describe('when clicking on a disabled tab', function() {
      beforeEach(function() {

        spyOn(stateSpy, 'includes').and.callFake(function(tabRoute) {
          return tabRoute === 'tabs.tab1';
        });

        spyOn(stateSpy, 'is').and.returnValue(false);
        spyOn(stateSpy, 'go');

        let template = `
          <akam-tabs routable>
            <akam-tab heading="Activity" state="tabs.tab1"></akam-tab>
            <akam-tab heading="Nutrition" state="tabs.tab2" disabled="true"></akam-tab>
            <akam-tab heading="Sleep" state="tabs.tab3"></akam-tab>
          </akam-tabs>`;

        addElement.call(this, template);

        let ctrl = this.el.controller(TABS_NAME);
        ctrl.activate(ctrl.tabs[1]);
      });

      it('should not call $state.go with the active tab\'s route', function() {
        expect(stateSpy.go).not.toHaveBeenCalledWith('tabs.tab2', {}, {})
      });

    });
  });
});
