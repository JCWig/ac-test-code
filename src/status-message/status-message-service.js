'use strict';

/* @ngInject */
module.exports = function($document, $compile, $rootScope, $log) {

    var body = $document.find('body').eq(0);
    var items = [];
    var itemCount = 0;
    var wrapper = null;
    
    /**
     * A check to make sure we have something to wrap our notices with
     */
    function _getWrapper () {        
        if (wrapper == null) {
            $rootScope.items = items;
            wrapper = $compile('<akam-status-message-group items="items"></akam-status-message-group>')($rootScope);
            body.prepend(wrapper);
        }
        
        return wrapper;
    }
    
    function _show(options) {
        _getWrapper();
        options = options || {};
        options.itemId = 'akam-status-message-' + (++itemCount);
        items.push(options);
    }
    
    return {
        show : function(options){
            return this.showSuccess(options);
        },
        
        showSuccess : function(options){
            return _show(angular.extend({}, options || {}, { status : 'success'}));
        },
        
        showInformation : function(options){
            return _show(angular.extend({}, options || {}, { status : 'information'}));
        },
        
        showError: function(options){
            // errors must be closed, therefore set timeout to 0
            return _show(angular.extend({}, options || {}, { timeout : 0, status : 'error'}));
        },
        
        showWarning: function(options){
            return _show(angular.extend({}, options || {}, { status : 'warning'}));
        }
    };
};