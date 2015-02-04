'use strict';

/* @ngInject */
module.exports = function($document, $compile, $rootScope, $log) {

    var body = $document.find('body').eq(0);
    var items = [];
    var itemCount = 0;
    var wrapper = null;
    
    /**
     * A check to make sure we have something to wrap our status messages with
     */
    function getWrapper () {        
        if (wrapper == null) {
            var scope = $rootScope.$new();
            scope.items = items;
            wrapper = $compile('<akam-status-message-group items="items"></akam-status-message-group>')(scope);
            body.prepend(wrapper);
        }
        
        return wrapper;
    }
    
    function show(options) {
        getWrapper();
        options = options || {};
        options.itemId = 'akam-status-message-' + (++itemCount);
        items.push(options);
    }
    
    return {
        show : function(options){
            return this.showSuccess(options);
        },
        
        showSuccess : function(options){
            return show(angular.extend({}, options || {}, { status : 'success'}));
        },
        
        showInformation : function(options){
            return show(angular.extend({}, options || {}, { status : 'information'}));
        },
        
        showError: function(options){
            // errors must be closed, therefore set timeout to 0
            return show(angular.extend({}, options || {}, { timeout : 0, status : 'error'}));
        },
        
        showWarning: function(options){
            return show(angular.extend({}, options || {}, { timeout : 0, status : 'warning'}));
        }
    };
};