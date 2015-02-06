
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
	if(num == 0)
		return 'January'
	else if (num == 1 )
		return 'February'
	else if (num == 2 )
		return 'March'
	else if (num == 3 )
		return 'April'
	else if (num == 4 )
		return 'May'
	else if (num == 5 )
		return 'June'
	else if (num == 6 )
		return 'July'
	else if (num == 7 )
		return 'August'
	else if (num == 8 )
		return 'September'
	else if (num == 9 )
		return 'October'
	else if (num == 10 )
		return 'November'
	else if (num == 10 )
		return 'December'

}