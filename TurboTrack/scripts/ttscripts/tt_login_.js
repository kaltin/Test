$(document).ready(function(){
	$("input").placeholder();
});
function acceptCookies(){
	$.getJSON("/jscalls/acceptCookies.php", function(data){
		if(data.success==true) $(".cookiesTop").slideUp();
	});
}