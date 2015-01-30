'use strict';

/* @ngInject */
module.exports = function($document, $compile, $rootScope, $log) {

    var body = $document.find('body').eq(0);
    var itemCount = 0;
    
    /**
     * A check to make sure we have something to wrap our notices with
     */
    function _getWrapper () {
        var wrapper = null;
        var e = document.getElementById('status-message-wrapper');
        
        if (e == null) {
            wrapper = $compile('<ul id="status-message-wrapper"></ul>')($rootScope);
            body.prepend(wrapper);
        }else{
            wrapper = angular.element(e);
        }
        
        return wrapper;
    }
    
    function _show(options) {
        itemCount++;
        options = options || {};
        
        var wrapper = _getWrapper();
        
        var newStatusMessage = $compile('<akam-status-message text="{{text}}" title="{{title}}"></akam-status-message>');
        
        var scope = $rootScope.$new();
        options.itemCount = itemCount;
        options.text = "Test Test 123";
        options.title = "This is my Title";
        
        wrapper.append(newStatusMessage(scope));
    }
    
    return {
        show : function(options){
            return this.showSuccess(options);
        },
        
        showSuccess : function(options){
            return _show(options);
        },
        
        showInfo : function(options){
            return _show(options);
        },
        
        showError: function(options){
            return _show(options);
        },
        
        showWarning: function(options){
            return _show(options);
        }
    };
};