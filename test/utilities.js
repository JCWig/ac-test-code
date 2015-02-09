
global.click = function(el) {
	var ev = document.createEvent('MouseEvent');
	ev.initMouseEvent('click', true);
	el.dispatchEvent(ev);
};

global.clickAwayCreationAndClick = function(ele){
	var clickAwayArea = document.createElement(ele);
	clickAwayArea.setAttribute("id", "click-away");
	document.body.appendChild(clickAwayArea);
	var clickAwayButton = document.querySelector('#click-away');
	click(clickAwayButton);
	document.body.removeChild(clickAwayArea);
};

global.getMonthInEnglish = function(num){
	var date = new Date();
	var month = (num || num == 0) ? num : date.getMonth();
	if(month == 0)
		return 'January'
	else if (month == 1 )
		return 'February'
	else if (month == 2 )
		return 'March'
	else if (month == 3 )
		return 'April'
	else if (month == 4 )
		return 'May'
	else if (month == 5 )
		return 'June'
	else if (month == 6 )
		return 'July'
	else if (month == 7 )
		return 'August'
	else if (month == 8 )
		return 'September'
	else if (month == 9 )
		return 'October'
	else if (month == 10 )
		return 'November'
	else if (month == 10 )
		return 'December'
}

global.getTodaysYear = function(){
	var date = new Date();
	return date.getFullYear();
}

global.getTodaysMonth = function(){
	var date = new Date();
	return date.getMonth();
}