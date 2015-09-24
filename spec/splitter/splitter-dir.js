/*global angular, inject*/
'use strict';

import splitter from '../../src/splitter';

var utilities = require('../utilities');

describe('akamai.components.splitter', function() {
	var $scope, $compile, timeout;

	beforeEach(function() {
		angular.mock.inject.strictDi(true);
		angular.mock.module(splitter.name);

		inject(function($rootScope, _$compile_) {
			$scope = $rootScope.$new();
			$compile = _$compile_;
		});
	});

	afterEach(function(){
		if(self.element) {
			document.body.removeChild(self.element);
			self.element = null;
		}
	});

	function addElement(markup) {
		self.el = $compile(markup)($scope);
		$scope.$digest();
		self.element = document.body.appendChild(self.el[0]);
	}

	describe('splitter directive', function() {
		describe('vertical splitter', function() {
			beforeEach(function() {

			});
			it('should render splitter', function() {
                $scope.verticalProps = {
					collapsed: false,
                    freezeDivider: false,
                    freezeCollapse: false
                };

                var splitterTemplate = "<akam-splitter type='vertical' direction='left' collapsed='verticalProps.collapsed' freeze-divider='verticalProps.freezeDivider' freeze-collapse='verticalProps.freezeCollapse'>" +
                    "<akam-split-pane size='4'>Pane 1</akam-split-pane>" +
                    "<akam-split-pane size='8'>Pane 2</akam-split-pane>" +
                "</akam-splitter>";

                addElement(splitterTemplate);

				var splitterElem = document.querySelectorAll('.splitter');
				var splitPaneElems = document.querySelectorAll('.split-pane');
				var resizerElems = document.querySelectorAll('.splitter-resizer');

				expect(splitterElem.length).toEqual(1);
				expect(splitPaneElems.length).toEqual(2);
				expect(resizerElems.length).toEqual(1);
			});
		});

	});

});
