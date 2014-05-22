$(document).ready(function(){
	/*Show bottombar on hover*/
	$(".bottombarWrap").mouseenter(function(){
		$(".bottombar").stop().animate({bottom: 0}, 500);
		$(".arrow-bb").stop().animate({bottom: "300px"}, 500);
		setTimeout(function(){
			$(".arrow-bb").css("background-image", "url('images/arrow-down.png')");
		}, 500);
	});
	
	/*Hide bottombar on exit*/
	$(".bottombarWrap").mouseleave(function(){
		$(".bottombar").stop().animate({bottom: "-300px"}, 500);
		$(".arrow-bb").stop().animate({bottom: "0px"}, 500);
		setTimeout(function(){
			$(".arrow-bb").css("background-image", "url('images/arrow-up.png')");
		}, 500);
	});
});