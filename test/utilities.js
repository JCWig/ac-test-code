'use strict'
module.exports = {
	click : function(el) {
    	var ev = document.createEvent('MouseEvent');
    	ev.initMouseEvent('click', true);
    	el.dispatchEvent(ev);
    },
    clickAwayCreationAndClick : function(ele){
		var clickAwayArea = document.createElement(ele);
		clickAwayArea.setAttribute("id", "click-away");
		document.body.appendChild(clickAwayArea);
		var clickAwayButton = document.querySelector('#click-away');
		this.click(clickAwayButton);
		document.body.removeChild(clickAwayArea);
	},
	getMonthInEnglish : function(num){
		var date = new Date();
		var month = (num || num == 0) ? num : date.getMonth();
		return moment.months(month);
	},
	getTodaysYear : function(){
		var date = new Date();
		return date.getFullYear();
	},
	getTodaysMonth : function(){
		var date = new Date();
		return date.getMonth();
	},
	formatInteger: function(length, numStr){
		while(numStr.length < length){
			numStr = "0"+numStr;
		}
		return numStr;
	}
}