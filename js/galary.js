var jq = jQuery.noConflict();
var secondImg = 0;
var lengthOfImg;
var activeImg = 0;
var images = [];
var interval;
var speedOfScroll, speedAnimation, visibleButtons, visiblePoints, activeInterval, stopInterval;
var activeButtons = true;
var width, height;

jq(document).ready(() => {
	lengthOfImg = jq('img').length;
	speedOfScroll = Number(jq('#galary').attr('speedOfScroll'));
	speedAnimation = Number(jq('#galary').attr('speedAnimation'));
	visibleButtons = jq('#galary').attr('visibleButtons');
	scrollInterval = jq('#galary').attr('scrollInterval');
	visiblePoints = jq('#galary').attr('visiblePoints');
	activeInterval = jq('#galary').attr('activeInterval');
	stopInterval = jq('#galary').attr('stopInterval');
	if(isNaN(speedOfScroll)) speedOfScroll = 3000;
	if(isNaN(speedAnimation)) speedAnimation = 1000;
	if(typeof(visibleButtons) == "undefined") visibleButtons = "true"; 
	if(typeof(visiblePoints) == "undefined") visiblePoints = "true"; 
	if(typeof(activeInterval) == "undefined") activeInterval = "true";
	if(typeof(stopInterval) == "undefined") stopInterval = "true";
	CreateButtons();
});

function CreateButtons(){

	for(var i = 0; i < lengthOfImg; i++){
		var img = jq('#galary').children('img').eq(i)
		images[i] = jq('img').eq(i).attr('src');
		if(i > 1) img.css('display', 'none');
		if(i == 0) img.css('z-index', '10');
		if(i == 1) img.css('z-index', '5');
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
			if (i == 0) button.click(function(){right()});
			else button.click(function(){left()});

			
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
			jq('#pointGalary' + i).click(() => changeImage(i))
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
			jq('#galary').mouseover(() => clearInterval(interval))
			jq('#galary').mouseout(() => interval = setInterval(() => right(), speedOfScroll))
		}
	}
}

function left(){
	if(activeButtons == true){
		scrollPause();
		secondImg--;
		if(secondImg < 0) secondImg = lengthOfImg - 1;
		buttonClick()
	}
	
}

function right(){
	if(activeButtons == true){
		secondImg++;
		if(secondImg > lengthOfImg - 1) secondImg = 0;
		buttonClick()
		scrollPause();
	}
	
}

function changeImage(numberImg){
	if(activeButtons == true){
		if(secondImg != numberImg){
			scrollPause();
			secondImg = numberImg;
			buttonClick()
		}
	}
}

function buttonClick(){
	imageActive();
	imageAnimation();
	if(visiblePoints) pointsAnimation();
}

function imageActive(){
	jq('#galary').children('img').eq(activeImg).css('z-index', '5');
	jq('.blurImgGalary').css('z-index', '4')
	activeImg++;
	if(activeImg > 1) activeImg = 0;
}

function imageAnimation(){
	var img = jq('#galary').children('img').eq(activeImg);
	var blurImg = jq('.blurImgGalary').eq(activeImg);
	ChangeSizeImg();
	blurImg.attr('src', images[secondImg]);
	img.css({'z-index': '10', 'opacity': '0'});
	img.animate({opacity: 1}, speedAnimation);
	blurImg.css({'z-index': '6', 'opacity': '0'});
	blurImg.animate({opacity: 1}, speedAnimation);
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
		
		console.log(width / height,  jq('#galary').width() / jq('#galary').height())
		if(width > height && ((width / height) > (jq('#galary').width() / jq('#galary').height()))) img.attr('class', 'horisontalImgGalary');
		else img.attr('class', 'verticalImgGalary');
		console.log(width, height, img.attr('class'))
	}
	helpImg.src = images[secondImg];

	
	
}