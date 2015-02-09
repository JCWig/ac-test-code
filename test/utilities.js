'use strict'
module.exports = {
	click : function(el) {
    	var ev = document.createEvent('MouseEvent');
    	ev.initMouseEvent('click', true);
    	el.dispatchEvent(ev);
    }
}