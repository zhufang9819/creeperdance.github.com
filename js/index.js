$(function() {
	$('#totoro_fixed img').mouseenter(function(){
		$('#right_sidebar').animate({right:"+=300px"},300);
		$('#content').animate({left:'-=150px'},300);
	});
	$('#right_sidebar').mouseleave(function(){
		$('#right_sidebar').animate({right:"-=300px"},300);
		$('#content').animate({left:'+=150px'},300);
	});
	$('.list-category h2').hover(function(){
		$(this).css('border-bottom','2px solid #555');
	});
});