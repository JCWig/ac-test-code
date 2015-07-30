/*global angular, inject*/

import navigation from '../../src/navigation';

describe('akamai.components.navigation', function() {

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

      this.$scope.tabData   = [
        {
          heading: 'Tab 1',
          route: 'tabs.tab1'
        },
        {
          heading: 'Tab 2',
          route: 'tabs.tab2'
        },
        {
          heading: 'Tab 3',
          route: 'tabs.tab3'
        }
      ];
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

  describe('given a set of tab data', function() {
    describe('when rendering', function() {
      beforeEach(function() {

        spyOn(stateSpy, 'includes').and.callFake(function(tabRoute, tabParams, tabOptions) {
          return tabRoute === 'tabs.tab1';
        });

        spyOn(this.$scope, '$on').and.returnValue(function() {});

        addElement.call(this, '<akam-navigation data="tabData"></akam-navigation>');
      });

      it('should render the tab container', function() {
        expect(this.element.querySelector('.tab-container')).toBeDefined();

      });

      it('should render the individual tabs', function() {
        var tab = this.element.querySelector('.nav-tabs');
        expect(tab.getElementsByTagName('li').length).toBe(3);
      });

      it('should have called $state.includes for each tab', function() {
        expect(stateSpy.includes.calls.count()).toEqual(this.$scope.tabData.length);
      });

      it('should have registered tabs with state events', function() {
        let allCalls = this.$scope.$on.calls.allArgs().slice();

        expect(allCalls[0]).toEqual(['$stateChangeSuccess', jasmine.any(Function)]);
        expect(allCalls[1]).toEqual(['$stateChangeError', jasmine.any(Function)]);
        expect(allCalls[2]).toEqual(['$stateChangeCancel', jasmine.any(Function)]);
        expect(allCalls[3]).toEqual(['$stateNotFound', jasmine.any(Function)]);
      });
    });
  });

  describe('given a set of tab data', function() {
    describe('when clicking on an inactive tab', function() {
      beforeEach(function() {

        spyOn(stateSpy, 'includes').and.callFake(function(tabRoute, tabParams, tabOptions) {
          return tabRoute === 'tabs.tab1';
        });

        spyOn(stateSpy, 'is').and.returnValue(false);
        spyOn(stateSpy, 'go');

        addElement.call(this, '<akam-navigation data="tabData"></akam-navigation>');

        this.el.controller('akamNavigation').go(this.$scope.tabData[1]);
      });

      it('should call $state.go with the inactive tab\'s route', function() {
        expect(stateSpy.go).toHaveBeenCalledWith(this.$scope.tabData[1].route, {}, {})
      })

    });

    describe('when clicking on an active tab', function() {
      beforeEach(function() {

        spyOn(stateSpy, 'includes').and.callFake(function(tabRoute, tabParams, tabOptions) {
          return tabRoute === 'tabs.tab1';
        });

        spyOn(stateSpy, 'is').and.returnValue(true);
        spyOn(stateSpy, 'go');

        addElement.call(this, '<akam-navigation data="tabData"></akam-navigation>');

        this.el.controller('akamNavigation').go(this.$scope.tabData[0]);
      });

      it('should not call $state.go with the active tab\'s route', function() {
        expect(stateSpy.go).not.toHaveBeenCalledWith(this.$scope.tabData[1].route, {}, {})
      })

    });

    describe('when clicking on a disabled tab', function() {
      beforeEach(function() {

        spyOn(stateSpy, 'includes').and.callFake(function(tabRoute, tabParams, tabOptions) {
          return tabRoute === 'tabs.tab1';
        });

        spyOn(stateSpy, 'is').and.returnValue(false);
        spyOn(stateSpy, 'go');

        this.$scope.tabData[1].disabled = true;
        addElement.call(this, '<akam-navigation data="tabData"></akam-navigation>');

        this.el.controller('akamNavigation').go(this.$scope.tabData[1]);
      });

      it('should not call $state.go with the active tab\'s route', function() {
        expect(stateSpy.go).not.toHaveBeenCalledWith(this.$scope.tabData[1].route, {}, {})
      })

    });
  });
});








