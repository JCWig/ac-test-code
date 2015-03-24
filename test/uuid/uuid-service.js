'use strict';
var utilities = require('../utilities');

describe('akamai.components.uuid-service', function() {
    describe('uuid service', function(){
        beforeEach(function() {
            var self = this;
            angular.mock.module(require('../../src/uuid').name);
            angular.mock.module(function ($controllerProvider) {
                $controllerProvider.register('Controller', function($scope) {
                });
            });
            inject(function(uuid, $rootScope, $timeout, $compile) {
                self.uuid = uuid;
                self.scope = $rootScope;
                self.timeout = $timeout;
                self.$compile = $compile;
            });
        });
        describe('when using uuid', function(){
            it('shoud return a uuid', function(){
                var uuid = this.uuid.uuid();
                expect(uuid.length).toEqual(36);
                expect(uuid.charAt(8)).toEqual('-');
                expect(uuid.charAt(13)).toEqual('-');
                expect(uuid.charAt(18)).toEqual('-');
                expect(uuid.charAt(23)).toEqual('-');
            });
        });
        describe('uuids should be unique', function(){
            it('shoud return a uuid', function(){
                var storingDictionary = {};
                for(var i = 0; i < 100; i++){
                    storingDictionary[this.uuid.uuid()] = 0;
                }
                expect(Object.keys(storingDictionary).length).toEqual(100);
            });
        });
    });
});