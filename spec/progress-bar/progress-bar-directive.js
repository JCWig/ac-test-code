/*global angular, inject*/
'use strict';

import progressBar from '../../src/progress-bar';

var utilities = require('../utilities');
var LIBRARY_PATH = /\/libs\/akamai-core\/[0-9]*.[0-9]*.[0-9]*\/locales\/en_US.json/;
var CONFIG_PATH = '../../_appen_US.json';
var enUsMessagesResponse = require("../i18n/i18n_responses/messages_en_US.json");
var enUsResponse = require("../i18n/i18n_responses/en_US.json");

describe('akamai.components.progress-bar', function() {
	var $scope, $compile, timeout;
	var translationMock = {
	    'components': {
	    	'progress-bar': {
	        	'label': 'Progress Bar Label'
	      	}
	  	}
	};

	beforeEach(function() {
		angular.mock.inject.strictDi(true);
		angular.mock.module(progressBar.name);
		angular.mock.module(function($translateProvider) {
	      	$translateProvider.translations('en_US', translationMock);
	      	$translateProvider.useLoader('translateNoopLoader');
	    });
		inject(function($rootScope, _$compile_, $httpBackend) {
			$scope = $rootScope;
			$compile = _$compile_;
			$httpBackend.when('GET', LIBRARY_PATH).respond(enUsMessagesResponse);
      		$httpBackend.when('GET', CONFIG_PATH).respond(enUsResponse);
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
	describe('given a progress bar', function() {
		describe('when the progress bar is rendered', function() {
			beforeEach(function() {
				$scope.pb = {
					value: '50',
					max: '100',
					label: 'progress bar label'
				};
				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" label="pb.label"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should render a progress bar', function() {
				var progress = document.querySelector('.progress');
				var progressBar = document.querySelector('.progress-bar');
				var progresBarLabel = document.querySelector('.progress-bar-label');

				expect(progress).not.toBe(null);
				expect(progressBar.getAttribute('aria-valuenow')).toEqual($scope.pb.value);
				expect(progressBar.getAttribute('aria-valuemax')).toEqual($scope.pb.max);
				expect(progresBarLabel.innerHTML).toEqual($scope.pb.label);
			});
		});
		describe('when the progress bar is rendered', function() {
			beforeEach(function() {
				$scope.pb = {
					value: '50',
					max: '100',
					label: 'components.progress-bar.label'
				};
				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" label="pb.label"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should translate label if it is a valid key', function() {
				var progresBarLabel = document.querySelector('.progress-bar-label');
				expect(progresBarLabel.innerHTML).toMatch('Progress Bar Label');
			});
		});
		describe('when max value is not provided', function(){
			beforeEach(function() {
				$scope.pb = {
					value: '50',
					label: 'components.progress-bar.label'
				};
				var progressBarTemplate = '<akam-progress-bar value="pb.value" label="pb.label"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should set default value for max', function(){
				let ctrl = self.el.controller('akamProgressBar');
				expect(ctrl.max).toEqual(100);
			})
		})
	});

	describe('when the progress bar is rendered', function() {
		describe('given a value for label-align attribute', function() {
			beforeEach(function() {
				$scope.pb = {
					'value': '50',
					'max': '100',
					'label': 'progress bar label',
					'labelAlign': 'center'
				};

				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" label="pb.label" label-align="{{ pb.labelAlign }}"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should center align progress bar label', function() {
				var progresBarLabel = document.querySelector('.align-center');
				expect(progresBarLabel).not.toBe(null);
			});
		});
		describe('given a value for label-align attribute', function() {
			beforeEach(function() {
				$scope.pb = {
					'value': '50',
					'max': '100',
					'label': 'progress bar label',
					'labelAlign': 'right'
				};

				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" label="pb.label" label-align="{{ pb.labelAlign }}"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should right align progress bar label', function() {
				var progresBarLabel = document.querySelector('.align-right');
				expect(progresBarLabel).not.toBe(null);
			});
		});
	});

	describe('given state of progress bar', function() {
		describe('when the progress bar is rendered', function() {
			beforeEach(function() {
				$scope.pb = {
					value: '100',
					max: '100',
					label: 'progress bar label'
				};
				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" label="pb.label"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should render completed progress bar', function() {
				expect(document.querySelector('.progress-bar-success')).not.toBe(null);
			});
		});
		describe('when the progress bar is rendered', function() {
			beforeEach(function() {
				$scope.pb = {
					value: '90',
					max: '100',
					label: 'progress bar label',
					state: 'error'
				};
				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" state="pb.state" label="pb.label"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should render error progress bar', function() {
				expect(document.querySelector('.progress-bar-danger')).not.toBe(null);
			});
		});
	});

	describe('given a static progress bar', function() {
		describe('when animate is false and progress not completed', function(){
			beforeEach(function() {
				$scope.pb = {
					value: '50',
					max: '100',
					label: 'progress bar label',
				};
				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" label="pb.label" animate="{{ pb.animate }}"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should render no strips', function() {
				var progress = document.querySelector('.progress');

				expect(progress.classList).not.toContain('progress-striped');
				expect(progress.classList).not.toContain('active');
			});
		});
	});

	describe('given an animated progress bar', function() {
		describe('when animate is true and progress not completed', function() {
			beforeEach(function() {
				$scope.pb = {
					value: '50',
					max: '100',
					label: 'progress bar label',
					animate: 'true'
				};
				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" label="pb.label" animate="{{ pb.animate }}"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should render moving strips', function() {
				var progress = document.querySelector('.progress');

				expect(progress.classList).toContain('progress-striped');
				expect(progress.classList).toContain('active');
			});
		});
	});

	describe('given a progress bar', function(){
		describe('when progress value goes from in progress to 100% complete', function(){
			beforeEach(function() {
				$scope.pb = {
					value: '99',
					max: '100',
					label: 'progress bar label',
				};
				var progressBarTemplate = '<akam-progress-bar value="pb.value" max="pb.max" label="pb.label" animate="{{ pb.animate }}"></akam-progress-bar>';
				addElement(progressBarTemplate);
			});
			it('should change state of progress bar to completed', function(){
				var progressBar = document.querySelector('.progress-bar');
				expect(progressBar.classList).not.toContain('progress-bar-success');

				$scope.pb.value = '100';
				$scope.$digest();

				progressBar = document.querySelector('.progress-bar');
				expect(progressBar.classList).toContain('progress-bar-success');
			});
		});
	});
});