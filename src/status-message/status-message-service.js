'use strict';

/* @ngInject */
module.exports = function($document, $compile, $rootScope, $log) {

    var body = $document.find('body').eq(0);
    var itemCount = 0;
    var wrapperId = "akam-status-message-wrapper";
    
    /**
     * A check to make sure we have something to wrap our notices with
     */
    function _getWrapper () {
        var wrapper = null;
        var e = document.getElementById(wrapperId);
        
        if (e == null) {
            wrapper = $compile('<div class="common-css" id="' + wrapperId + '"><ul></ul></div>')($rootScope);
            body.prepend(wrapper);
        }else{
            wrapper = angular.element(e);
        }
        
        return wrapper.find('ul');
    }
    
    function _show(options) {
        itemCount++;
        options = options || {};
        
        var wrapper = _getWrapper();
        
        var newStatusMessage = $compile('<akam-status-message itemId="{{itemId}}" text="{{text}}" title="{{title}}" timeout="{{timeout}}"></akam-status-message>');
        
        var scope = $rootScope.$new();
        scope.itemCount = itemCount;
        
        scope.itemId = options.itemId || 'akam-status-message-' + itemCount;
        scope.text = options.text;
        scope.title = options.title;
        scope.timeout = options.timeout;
        
        wrapper.append(newStatusMessage(scope));
    }
    
    return {
        show : function(options){
            return this.showSuccess(options);
        },
        
        showSuccess : function(options){
            return _show(options, angular.extend({}, options || {}, { statusType : 'success'}));
        },
        
        showInfo : function(options){
            return _show(options, angular.extend({}, options || {}, { statusType : 'info'}));
        },
        
        showError: function(options){
            // errors must be closed, therefore set timeout to 0
            return _show(options, angular.extend({}, options || {}, { timeout : 0, statusType : 'error'}));
        },
        
        showWarning: function(options){
            return _show(options, angular.extend({}, options || {}, { statusType : 'warning'}));
        }
    };
};