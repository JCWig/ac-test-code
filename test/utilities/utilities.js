'use strict'
module.exports = function(){
	return {
		click : function(el) {
    		var ev = document.createEvent('MouseEvent');
    		ev.initMouseEvent('click', true);
    		el.dispatchEvent(ev);
    	}
    }
};