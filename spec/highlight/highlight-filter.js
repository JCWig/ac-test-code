'use strict';
var utilities = require('../utilities');

describe('akamai-components.highlight', function() {
    var compile = null;
    var scope = null;
    var filter = null;
    var self = this;
    beforeEach(function() {
        self = this;
        angular.mock.module(require('../../src/modules/highlight').name);
        inject(function($compile, $rootScope,$timeout, $filter) {
            compile = $compile;
            scope = $rootScope.$new();
            filter = $filter;
        });
    });
    afterEach(function() {
        if(self.element){
            document.body.removeChild(self.element);
            self.element = null;
        }
    });
    describe('when highlighting', function(){
        it('should be able to highlight the start', function(){
            var highlightedString = filter("highlight")("abcdvxyz", "abcd").$$unwrapTrustedValue();
            expect(highlightedString).toEqual('<span class="highlighted">abcd</span>vxyz');
        });
        it('should be able to highlight the middle', function(){
            var highlightedString = filter("highlight")("abcdvxyz", "cdvx").$$unwrapTrustedValue();
            expect(highlightedString).toEqual('ab<span class="highlighted">cdvx</span>yz');
        });
        it('should be able to highlight the end', function(){
            var highlightedString = filter("highlight")("abcdvxyz", "vxyz").$$unwrapTrustedValue();
            expect(highlightedString).toEqual('abcd<span class="highlighted">vxyz</span>');
        });
        it('should not edit DOM elements', function(){
            var highlightedString = filter("highlight")("<span>abcdvxyz</span>", "vxyz").$$unwrapTrustedValue();
            expect(highlightedString).toEqual("<span>abcdvxyz</span>");
        });
    }); 
});