
jQuery(function(){
	"use strict";
	
	if(jQuery('[data-pause]').length){
	
		var isIE = function() {
			var myNav = navigator.userAgent.toLowerCase();
			return (myNav.indexOf('msie') != -1) ? parseFloat(myNav.split('msie')[1]) : false;
		};
		
		/*This function creates elements for plugin scrolling*/
		$('body > *').wrapAll(jQuery('<div>').attr('id','sts-main'));
		var stsMain = jQuery('#sts-main');
		stsMain.wrapInner('<div id="sts-scroll_container">');
		var scrollCont =  jQuery('#sts-scroll_container');
		stsMain.after('<div id="sts-fake-scroll">');
		
		$('.sts-fixed').appendTo('body');
		
		/*This function updates the height of document*/
		var fakeScrollUpd = function(){
			stsMain.addClass('sts-no-transition');
			jQuery('#sts-fake-scroll').height(scrollCont.outerHeight());
			stsMain.removeClass('sts-no-transition');
		};
		var fakeScrollUpdCall = function(){
			fakeScrollUpd();
			setTimeout(function(){
				fakeScrollUpd();
			},1000);
		};
		var translateZ = 'translateZ(0px)';
		var ie = isIE();
		if(ie && ie < 10){
			translateZ = '';	
		}
		if(ie && ie < 9){
			console.log('Attention! The browser version is not supported by the plugin "scrollToStyle"');
			console.log('Browser Support: Chrome:Any, Safari:3.1+, Firefox:3.5+, Opera:10.5+, IE:9+, Android:4.1+, iOS:At least 4');
			return false;
		}
	
		/*This function simulates original scroll*/
		jQuery(window).on('scroll',function(){
			scrollCont.css({'transform': 'translateY(-'+jQuery(window).scrollTop()+'px) '+translateZ});
		}).trigger('scroll');
		
		jQuery(window).on('load',function(){
			fakeScrollUpd();
		});	
		jQuery(window).on('resize',function(){
			fakeScrollUpdCall();
		});
		fakeScrollUpd();
		Math.isEven = function( num ) {
			return !( num & 1 );
		};
		Math.isOdd = function( num ) {
			return !!( num & 1 );
		};

		/*This function decodes pause value*/
		var getPauseDelay = function(el){
			var elPauseDelay = el.attr('data-pause');
			if(elPauseDelay.toString().search('vh') != -1){
				elPauseDelay = parseFloat(elPauseDelay) * jQuery(window).height() / 100;
			}
			if(elPauseDelay.toString().search('px') != -1){
				elPauseDelay = parseFloat(elPauseDelay);
			}	
			if(elPauseDelay == 'auto'){
				el.addClass('sts-height-auto');
				var elActualHeight = el.outerHeight();
				el.removeClass('sts-height-auto');
				if(elActualHeight === 0){
					console.log('attribute [data-pause="auto"] requires the presence of the height at the child elements');
				}else{
					elActualHeight = (elActualHeight - jQuery(window).height()) + 1;	
					el.attr('data-pause',elActualHeight);
				}
				elPauseDelay = elActualHeight;
			}
			if(elPauseDelay < 0) {
				elPauseDelay = elPauseDelay * -1;	
			}
			return parseFloat(elPauseDelay);
		};
		
			
		var methods = {
			init: function (options) {
				var p = {};
				if (options) {
					jQuery.extend(p, options);
				}
				return this.each(function (o) {

					var el = jQuery(this);
					var minWidth = 0;
					if(el.attr('data-minwidth')){
						minWidth = parseFloat(el.attr('data-minwidth'));	
					}
					
					if(el.attr('data-pause') && $(window).width() > minWidth){
						
						if(!isNaN(getPauseDelay(el))){
							var elWrap = jQuery('<div>').addClass('sts-pause-wrap');
							el.after(elWrap);
							el.appendTo(elWrap);
							var pWrapHeight = function(){
								elWrap.css({height:el.height() + getPauseDelay(el)});
							};
							var pauseRangeMin;
							var pauseRangeMax;
							
							/*This function detects Min and Max pause value*/
							var pauseRangeDetect = function(){
								pauseRangeMin = elWrap.offset().top - (jQuery(window).scrollTop() + parseFloat(scrollCont.css('transform').split(',')[5]));
								pauseRangeMax = pauseRangeMin + getPauseDelay(el);
							};
							var fixedVal = 0;
							jQuery(window).on('resize',function(){
								pWrapHeight();
								pauseRangeDetect();
								jQuery(window).trigger('scroll');
							}).trigger('resize');
							
							var setImagePos = function(canvas){

								var activeFrame = canvas.data().currentLocation;
								var frameIndex = (activeFrame - 1)
					
								var row = Math.floor(frameIndex / canvas.data().cols);
								var col = frameIndex - (row * canvas.data().cols);
								var leftPos = col * canvas.data().frameWidth;
								var topPos = row * canvas.data().frameHeight;
								
								console.log(canvas.data())
								
								var ctx = canvas[0].getContext("2d");
								ctx.clearRect(0, 0, canvas.data().frameWidth, canvas.data().imageHeight);
								ctx.drawImage(canvas.data().sprite[0], -leftPos, -topPos, canvas.data().imageWidth, canvas.data().imageHeight);
								
							};
							
							var setCanvas = function(canvas){
								var frameWrap = canvas.parent('.sts-frame-wrap');
								var frameWrapWidth = frameWrap.width();
							
								var spriteWidth = canvas.data().sprite[0].naturalWidth;
								var spriteHeight = canvas.data().sprite[0].naturalHeight;
								var spriteDelta = spriteWidth / spriteHeight;
							
								var imageWidth = frameWrapWidth * parseFloat(canvas.data().cols);
								var imageHeight = imageWidth / spriteDelta;
								var canvasWidth = frameWrapWidth;
								var canvasHeight = imageHeight/parseFloat(canvas.data().rows)
								var canvasDelta = canvasWidth / canvasHeight;
								
								canvas.data().frameWidth = canvasWidth;
								canvas.data().frameHeight = canvasHeight;
								
								canvas.data().imageWidth = imageWidth;
								canvas.data().imageHeight = imageHeight;
								
								frameWrap.css({paddingBottom:canvasWidth / canvasDelta});
								
								var ctx = canvas[0].getContext("2d");
								
								ctx.canvas.width  = canvasWidth;
								ctx.canvas.height = canvasHeight;
								
								setImagePos(canvas);
							};
							
							
							
							var setData = function(animItem){
								var frameWrap = animItem.parent('.sts-frame-wrap');
								var frameWrapWidth = frameWrap.width();
								animItem.data().frameWidth = frameWrapWidth;
								animItem.width(parseFloat(animItem.data().cols) * 100+'%');
								animItem.data().frameHeight = animItem.height() / parseFloat(animItem.data().rows);
								frameWrap.css({paddingBottom:animItem.data().frameHeight / animItem.data().frameWidth*100+'%'});	
							};
							
							
							if($('canvas[data-frame]').length){
								$('canvas[data-frame]').each(function(){
									
									var canvas = $(this);
									
									var ctx = canvas[0].getContext("2d");	

									var frameArray = canvas.data().frame.toString().split(',');
									var value_1 = parseFloat(frameArray[0]);
									var value_2 = parseFloat(frameArray[1]);
										
									var currentLocation = 1;
									
									var imagePath = canvas.data('src');
									var sprite =  $('<img>');
									sprite.attr('src',imagePath);
									
									canvas.data({
										'value_1':value_1,
										'value_2':value_2,
										'currentLocation':currentLocation,
										'sprite':sprite	
									});
									
									console.log(canvas.data().sprite)
									
									if(sprite[0].complete){
										setCanvas(canvas);
									}else{
										sprite.on('load',function () {
											setCanvas(canvas);
										});
									}
									
									
									$(window).on('resize',function(){
										setCanvas(canvas);
									});
								});
						
							}
							
							

							jQuery(window).on('scroll sts-scroll',function(){
								var pauseVal =  getPauseDelay(el);
								var nowScroll = jQuery(window).scrollTop();
								var pausePos = 0;
								var posAnim = 0;
								var extraMin = (pauseRangeMin - pauseVal);
								var extraMax = (pauseRangeMax + pauseVal);
								if(nowScroll >= extraMin && nowScroll <= extraMax){
									posAnim = (nowScroll - elWrap.offset().top);	
								}else{
									if(nowScroll < extraMin	){
										posAnim = 0 - pauseVal;	
									}
									if(nowScroll > extraMax	){
										posAnim = pauseVal * 2;		
									}
								}
								if(nowScroll >= pauseRangeMin && nowScroll <= pauseRangeMax){
									pausePos = (nowScroll - elWrap.offset().top);
									el.addClass('sts-section-paused');
									el.removeClass('sts-section-over  sts-section-under');
								}else{
									if(nowScroll < pauseRangeMin){
										pausePos = 0;	
										el.addClass('sts-section-under');
										el.removeClass('sts-section-over');
									}
									if(nowScroll > pauseRangeMax){
										pausePos = pauseVal;
										el.addClass('sts-section-over');
										el.removeClass('sts-section-under');
									}
									el.removeClass('sts-section-paused');
								}
								var animPersent = (posAnim / pauseVal * 100);
								el.css({'transform': 'translateY('+pausePos+'px) '+translateZ});
								jQuery('[data-style]',el).each(function(){
									var animItem = jQuery(this);
									if(!animItem.data().persent){
										animItem.data().persent = animItem.closest('[data-persent]').attr('data-persent') || '0,560';
										animItem.attr('data-persent',animItem.data().persent);
									}
									var persentArray = animItem.data().persent.split(',');
									var persentDif = persentArray[1] - persentArray[0];
									var itemPersent = ((animPersent - persentArray[0]) * 100)/persentDif;
									animItem.addClass('sts-item-active').removeClass('sts-item-before sts-item-after');
									if(itemPersent < 0){
										itemPersent = 0;
										animItem.addClass('sts-item-before').removeClass('sts-item-after sts-item-active');	
									}
									if(itemPersent > 100){
										itemPersent = 100;
										animItem.addClass('sts-item-after').removeClass('sts-item-before sts-item-active');	
									}
									
									/*This function calculates dynamic value for elements properies*/
									var stylecodeEdit = animItem.data().stylecode;
									
									for (var key in animItem.data().styleObj) {
										var value_1 = animItem.data().styleObj[key][0];
										var value_2 = animItem.data().styleObj[key][1];
										var valueRange = value_2 - value_1;
										var newValue = (itemPersent * valueRange)/100;
										newValue = (newValue + parseFloat(value_1)).toFixed(animItem.data().fixedVal);
										stylecodeEdit = stylecodeEdit.replace(key,newValue);
									}

									animItem.attr('style',stylecodeEdit);
								});
								
								
								
								jQuery('img[data-frame]',el).each(function(){
									var animItem = jQuery(this);
									if(!animItem.data().persent){
										animItem.data().persent = animItem.closest('[data-persent]').attr('data-persent') || '0,100';
										animItem.attr('data-persent',animItem.data().persent);
									}
									var persentArray = animItem.data().persent.split(',');
									var persentDif = persentArray[1] - persentArray[0];
									var itemPersent = ((animPersent - persentArray[0]) * 100)/persentDif;
									animItem.addClass('sts-item-active').removeClass('sts-item-before sts-item-after');
									if(itemPersent < 0){
										itemPersent = 0;
										animItem.addClass('sts-item-before').removeClass('sts-item-after sts-item-active');	
									}
									if(itemPersent > 100){
										itemPersent = 100;
										animItem.addClass('sts-item-after').removeClass('sts-item-before sts-item-active');	
									}
									var frameArray = animItem.data().frame.toString().split(',');
									
									var value_1 = parseFloat(frameArray[0]);
									var value_2 = parseFloat(frameArray[1]);
									var valueRange = value_2 - value_1;
									var newValue = (itemPersent * valueRange)/100;
									newValue = (newValue + parseFloat(value_1)).toFixed(animItem.data().fixedVal);
									var frameIndex = (newValue - 1)
									var row = Math.floor(frameIndex / animItem.data().cols);
									var col = frameIndex - (row * animItem.data().cols);
									var leftPos = col * animItem.data().frameWidth;
									var topPos = row * animItem.data().frameHeight;
									animItem.css({
										'transform':'translate3d(-'+leftPos+'px, -'+topPos+'px, 0)'
									});
								});
								
								
								jQuery('canvas[data-frame]',el).each(function(){
									var canvas = jQuery(this);
									if(!canvas.data().persent){
										canvas.data().persent = canvas.closest('[data-persent]').attr('data-persent') || '0,100';
										canvas.attr('data-persent',canvas.data().persent);
									}
									var persentArray = canvas.data().persent.split(',');
									var persentDif = persentArray[1] - persentArray[0];
									var itemPersent = ((animPersent - persentArray[0]) * 100)/persentDif;
									canvas.addClass('sts-item-active').removeClass('sts-item-before sts-item-after');
									if(itemPersent < 0){
										itemPersent = 0;
										canvas.addClass('sts-item-before').removeClass('sts-item-after sts-item-active');	
									}
									if(itemPersent > 100){
										itemPersent = 100;
										canvas.addClass('sts-item-after').removeClass('sts-item-before sts-item-active');	
									}
									var valueRange = canvas.data().value_2 - canvas.data().value_1;
									var currentLocation = (itemPersent * valueRange)/100;
									currentLocation = (currentLocation + canvas.data().value_1).toFixed(canvas.data().fixedVal);
									
									canvas.data().currentLocation = currentLocation;
									setImagePos(canvas);
								});
								
	
							}).trigger('sts-scroll');
							
							
							
							
							
							
							
							
							

							jQuery(window).on('resize sts-resize',function(){
								jQuery('img[data-frame]',el).each(function(){
									var animItem = $(this);
									if(animItem[0].complete){
										setData(animItem);
									}else{
										animItem.on('load',function(){
											setData(animItem);
											jQuery(window).trigger('sts-scroll');
										});
									}
								});
							}).trigger('sts-resize');
							
							
							
							
							
							
							
							
							
						}else{
							console.log('Attention! Incorrect value in attribute "data-pause" for element: "'+el.attr('class')+'['+o+']"');		
						}
					}else{
						console.log('Attention! Attribute "data-pause" was not specified for element: "'+el.attr('class')+'['+o+']"');	
					}
				});
			}
		};
		jQuery.fn.scrollToStyle = function (method) {
			if (methods[method]) {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} else if (typeof method === 'object' || !method) {
				return methods.init.apply(this, arguments);
			} else {
				jQuery.error("Method " + method + " in jQuery.scrollToStyle doesn't exist");
			}
		};
		jQuery('[data-pause]').scrollToStyle();
	
	}
	
});
