var jq = jQuery.noConflict();
var secondImg = 0;
var lengthOfImg;
var activeImg = 0;
var images = [], sizeImg = [];
var interval;
var speedOfScroll, speedAnimation, visibleButtons, visiblePoints, activeInterval, stopInterval, scrollStyle, clickedPoints;
var activeButtons = true;
var width, height;
var hoverInterval = true;

jq(document).ready(() => {
	var checkScrollStyle = ['flip', 'flash'];
	var boolcheck = false;
	lengthOfImg = jq('img').length;
	speedOfScroll = Number(jq('#galary').attr('speedOfScroll'));
	speedAnimation = Number(jq('#galary').attr('speedAnimation'));
	visibleButtons = jq('#galary').attr('visibleButtons');
	scrollInterval = jq('#galary').attr('scrollInterval');
	visiblePoints = jq('#galary').attr('visiblePoints');
	activeInterval = jq('#galary').attr('activeInterval');
	stopInterval = jq('#galary').attr('stopInterval');
	scrollStyle = jq('#galary').attr('scrollStyle');
	clickedPoints = jq('#galary').attr('clickedPoints');

	if(isNaN(speedOfScroll)) speedOfScroll = 3000;
	if(isNaN(speedAnimation)) speedAnimation = 1000;
	if(typeof(visibleButtons) == "undefined") visibleButtons = "true"; 
	if(typeof(visiblePoints) == "undefined") visiblePoints = "true"; 
	if(typeof(activeInterval) == "undefined") activeInterval = "true";
	if(typeof(stopInterval) == "undefined") stopInterval = "true";
	if(typeof(clickedPoints) == "undefined") clickedPoints = "true";
	for(var i = 0; i < checkScrollStyle.length; i++){
		if(scrollStyle == checkScrollStyle[i]){
			boolcheck = true;
			break;
		}
		else boolcheck = false;
	}
	if(boolcheck == false || typeof(scrollStyle) == "undefined") scrollStyle = 'flip';
	CreateButtons();
})

function CreateButtons(){

	for(let i = 0; i < lengthOfImg; i++){
		var img = jq('#galary').children('img').eq(i)
		images[i] = jq('img').eq(i).attr('src');
		if(i > 1) img.css('display', 'none');
		if(i == 0) img.css('z-index', '10');
		if(i == 1) img.css('z-index', '5');

		var helpImg = new Image();
		helpImg.onload = function() {
			height = this.height;
			width = this.width;
			if((width > height || width < height) && ((width / height) > (jq('#galary').width() / jq('#galary').height()))) sizeImg[i] = "0%";
			else sizeImg[i] = "50%";
			}
		helpImg.src = images[i];
	}

	ChangeSizeImg();

	for(var i = 0; i < 2; i++){
		var blurImg = jq('<img/>').attr('class', 'blurImgGalary').attr('src', images[i]);
		jq("#galary").append(blurImg);
		if(i == 0) blurImg.css('z-index', '5');
		if(i == 1) blurImg.css('z-index', '4');
	}

	if(visibleButtons == "true"){
		for(let i = 0; i < 2; i++){
			var button = jq('<div/>');
			button.attr("class", "buttonGalary");
			jq("#galary").append(button);
			if (i == 0) button.click(right);
			else button.click(left);
		}
	}

	var shadow = jq('<div/>');
	shadow.attr("class", "shadowboxGalary");
	jq("#galary").append(shadow);

	if(visiblePoints == "true"){
		var pointsBlock = jq('<div/>');
		pointsBlock.attr("class", "pointsBlockGalary");
		pointsBlock.attr("id", "pointsBlockGalary");
		jq("#galary").append(pointsBlock);
		
		for(let i = 0; i < lengthOfImg; i++){
			var point = jq('<div/>');
			point.attr("class", "pointGalary");
			point.attr("id", "pointGalary" + i);
			jq("#pointsBlockGalary").append(point);
			if(clickedPoints == "true") jq('#pointGalary' + i).click(() => changeImage(i))
			else point.css('cursor', 'default');
		}

		jq('.pointGalary').eq(0).css({
			'width': '40px',
			'height': '40px',
			'margin': '5px 15px 5px 15px',
		})
	}

	if(activeInterval == "true"){
		interval = setInterval(() => right(), speedOfScroll)
		if(stopInterval == "true"){
			jq('#galary').mouseover(() => {
				clearInterval(interval)
				hoverInterval = false;
			})
			jq('#galary').mouseout(() => {
				interval = setInterval(() => right(), speedOfScroll)
				hoverInterval = true;
			})
		}
	}

	jq(window).blur(function(){
		if(activeInterval == "true") clearInterval(interval)
	})
	

	jq(window).focus(function(){
		if(activeInterval == "true") interval = setInterval(() => right(), speedOfScroll)
	})

}

function left(){
	if(activeButtons == true){
		scrollPause();
		secondImg--;
		if(secondImg < 0) secondImg = lengthOfImg - 1;
		buttonClick(1)
	}
	
}

function right(){
	if(activeButtons == true){
		secondImg++;
		if(secondImg > lengthOfImg - 1) secondImg = 0;
		buttonClick(2)
		scrollPause();
	}
	
}

function changeImage(numberImg){
	if(activeButtons == true){
		if(secondImg != numberImg){
			var a;
			scrollPause();
			if(secondImg > numberImg) a = 1;
			else a = 2;
			secondImg = numberImg;
			buttonClick(a)
		}
	}
}

function buttonClick(a){
	if(activeInterval == "true"){
		clearInterval(interval)
		if(hoverInterval == true) interval = setInterval(() => right(), speedOfScroll)
	}
	imageActive();
	imageAnimation(a);
	if(visiblePoints) pointsAnimation();
}

function imageActive(){
	jq('#galary').children('img').eq(activeImg).css('z-index', '5');
	jq('.blurImgGalary').css('z-index', '4')
	activeImg++;
	if(activeImg > 1) activeImg = 0;
}

function imageAnimation(a){
	var img = jq('#galary').children('img').eq(activeImg);
	var blurImg = jq('.blurImgGalary').eq(activeImg);
	ChangeSizeImg();
	blurImg.attr('src', images[secondImg]);
	
	blurImg.css({'z-index': '6', 'opacity': '0'});
	blurImg.animate({opacity: 1}, speedAnimation);

	if(scrollStyle == "flash"){
		img.css({'z-index': '10', 'opacity': '0'});
		img.animate({opacity: 1}, speedAnimation);
	}
	else if(scrollStyle == "flip"){
		if(a == 1){
			if(sizeImg[secondImg] == "50%") img.css({'z-index': '10', 'opacity': '0', 'left': '-25%'});
			else img.css({'z-index': '10', 'opacity': '0', 'left': '-75%'});
			img.animate({left: sizeImg[secondImg], opacity: "1"}, speedAnimation);
		}
		else{
			if(sizeImg[secondImg] == "50%") img.css({'z-index': '10', 'opacity': '0', 'left': '125%'});
			else img.css({'z-index': '10', 'opacity': '0', 'left': '75%'});
			img.animate({left: sizeImg[secondImg], opacity: "1"}, speedAnimation);
		}
	}

}

function pointsAnimation(){
	for(var i = 0; i < lengthOfImg; i++){
		if(i == secondImg)
		jq('.pointGalary').eq(i).animate({
			width: '40px',
			height: '40px',
			margin: '5px 15px 5px 15px',
		}, speedAnimation)
		else
		jq('.pointGalary').eq(i).animate({
			width: '50px',
			height: '50px',
			margin: '0px 10px 0px 10px',
		}, speedAnimation)
	}
}

function scrollPause(){
	activeButtons = false;
	setTimeout(() => activeButtons = true, speedAnimation)
}

function ChangeSizeImg(){
	var img = jq('#galary').children('img').eq(activeImg);
	img.attr('src', images[secondImg]).removeAttr('class');

	var helpImg = new Image();
	helpImg.onload = function() {
		height = this.height;
		width = this.width;
		if((width > height || width < height) && ((width / height) > (jq('#galary').width() / jq('#galary').height()))){ img.attr('class', 'horisontalImgGalary');}
		else img.attr('class', 'verticalImgGalary');
	}
	helpImg.src = images[secondImg];
}