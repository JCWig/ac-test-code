'use strict';


function click(el) {
    var ev = document.createEvent('MouseEvent');
    ev.initMouseEvent('click', true);
    el.dispatchEvent(ev);
};

describe('akamai.components.status-message', function() {
    describe('group status messages', function(){
        beforeEach(function() {
            var self = this;

            angular.mock.module(require('../../src/status-message').name);
            inject(function($compile, $rootScope) {
                var markup = '<div>'+
                            '<akam-status-message title="Title" id="identification" text="add a little bit more text" statusType="success"></akam-status-message>'+
                            '</div>';
                self.scope = $rootScope.$new();
                self.element = $compile(markup)(self.scope)[0];
                self.scope.$digest();
                document.body.appendChild(self.element);
            });
        });
        afterEach(function() {
            document.body.removeChild(this.element);
        });
        context('when rendering', function(){
            it('should display correct information', function(){
                expect(document.querySelector('li.status-message-item').id).to.not.be.nullppppppp;
                expect(document.querySelector('.status-message-content span').textContent).to.equal('Title');
                expect(document.querySelector('.status-message-content p').textContent).to.equal('add a little bit more text');
            });
        }); 
    });

});
