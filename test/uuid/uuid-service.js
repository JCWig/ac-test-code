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
        context('when using uuid', function(){
            it('shoud return a uuid', function(){
                var uuid = this.uuid.uuid();
                expect(uuid).to.have.length(36);
                expect(uuid.charAt(8)).to.equal('-');
                expect(uuid.charAt(13)).to.equal('-');
                expect(uuid.charAt(18)).to.equal('-');
                expect(uuid.charAt(23)).to.equal('-');
            });
        });
        context('uuids should be unique', function(){
            it('shoud return a uuid', function(){
                var storingDictionary = {};
                for(var i = 0; i < 100; i++){
                    storingDictionary[this.uuid.uuid()] = 0;
                }
                expect(Object.keys(storingDictionary).length).to.equal(100);
            });
        });
    });
});