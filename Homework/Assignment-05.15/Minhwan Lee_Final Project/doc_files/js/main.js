$(function(){
	
	$('.menuBtn').on('click',function(){
		if($('html').is('.navOpen')){
			$('html').removeClass('navOpen');
		}else{
			setTimeout(function(){
				$('html').addClass('navOpen');
			},100);
		}
		return false;
	});
	
	$('a',$('.navWrap')).on('click',function(){
		$('html').removeClass('navOpen');
	});
	
	
	var pathMas = window.location.pathname.split('/');
	var href = pathMas[pathMas.length-1]
	if(href === ""){
		href = 'index.html';
	}
	
	var curLink = $('a[href="'+href+'"]');

	curLink.addClass('cur');

	if('ontouchstart' in window){
		$('html').addClass('touch');
	}else{
		$('html').addClass('no-touch');
	}
	$('a[href^="#"]:not(.btn):not([href="#"])').on('click',function(){
		$('html, body').animate({scrollTop:$($(this).attr('href')).offset().top});
		
		if(history.pushState){
			history.pushState('', '', $(this).attr('href'));
		}
		return false;	
	});
});