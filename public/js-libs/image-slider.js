(function($){
    
    //helper functions
    
    var helpers = {
        runSlider: function(element,settings,startStopFlag){
            settings.sliderRunning = startStopFlag;
            element.data("imageSliderSettings",settings);
            if(startStopFlag){
                this.animate(element, settings);
            } else {
                element.find("div.slider-timer-indicator").stop().clearQueue().css("width","0%")
            }
        },
        animate: function(element,settings){
            settings = settings ? settings : element.data("imageSliderSettings");
            element.find("div.slider-timer-indicator")
            .stop()
            .clearQueue()
            .css("width","0%")
            .animate({
                width: "100%"
            },settings.transitionSpeed,"linear",function(){
                helpers.flipSlide(element);
                var settings = element.data("imageSliderSettings");
                if(settings && settings.sliderRunning){
                    helpers.animate(element);
                }
            });
        },
        flipSlide: function(element,forward){
            var visible = element.find("ul li.current").fadeOut(400).removeClass("current");
            var theGoToSlide = forward === false ? visible.prev() : visible.next();
            if(theGoToSlide.length == 0){
                theGoToSlide = element.find("ul li:"+(forward===false?"last":"first"));
            }
            theGoToSlide.addClass("current").fadeIn(400);
            
            //switching the thumbnails
            this.revalidateThumbs(element, theGoToSlide);
        },
        indicator: function(element,indicator){
            var container = element.find(".slider-timer-indicator-container");
            if(indicator){
                container.show();
            } else {
                container.hide();
            }
            var settings = element.data("imageSliderSettings");
            settings.indicator = indicator?true:false;
            element.data("imageSliderSettings",settings);
        },
        autoPlay: function (element,autoPlay){
            var settings = element.data("imageSliderSettings");
            settings.autoPlay = autoPlay;
            this.runSlider(element, settings, true);
            element.data("imageSliderSettings",settings);
        },
        action: function(element,action){
            var settings = element.data("imageSliderSettings");
            settings.action = action;
            
            var navContainer = element.find(".slider-nav");
            var play = navContainer.find(".slider-play");
            var pause = navContainer.find(".slider-pause");
            
            if(action && settings.sliderRunning){
                play.hide();
                pause.show();
            } else if (action && !settings.sliderRunning ){
                play.show();
                pause.hide();
            } else {
                navContainer.find(".slider-play, .slider-pause").hide();
            }
            
            element.data("imageSliderSettings",settings);
        },
        navigation: function(element,nav){
            var settings = element.data("imageSliderSettings");
            settings.navigation = nav;
            
            var thumbsContainer = element.find(".thumbs-container");
            var prevNextButtons = element.find(".slider-prev,.slider-next");
            if(nav == "buttons"){
                thumbsContainer.hide();
                prevNextButtons.show();
            } else if (nav == "thumbs") {
                thumbsContainer.show();
                prevNextButtons.hide();
            } else {
                thumbsContainer.hide();
                prevNextButtons.hide();
            }
            
            element.data("imageSliderSettings",settings);
        },
        transitionSpeed: function(element,time){
            var settings = element.data("imageSliderSettings");
            settings.transitionSpeed = time;
            if(settings.sliderRunning){
                this.runSlider(element, settings, true);
            }
            element.data("imageSliderSettings",settings);
        },
        revalidateThumbs: function(element,current){
            var prev = current.prev();
            if(prev.length == 0){
                prev = current.parent().find("li:last");
            }
            var next = current.next();
            if(next.length == 0){
                next = current.parent().find("li:first");
            }
            var thumbsContainer = element.find(".thumbs-container");
            var slots = {
                prev: prev,
                current: current,
                next: next
            };
            for(var s in slots){
                var slot = thumbsContainer.find(".thumb-"+s)
                .stop()
                .clearQueue()
                .fadeTo(300,0,(function(slot){
                    return function(){
                        $(this).empty().append(slot.find(".thumb").clone()).fadeTo(300,1);
                    }
                }(slots[s])));
            }
        }
    };
    
    $.fn.imageSlider = function(method){
        
        var methods = {
            init: function(){
                //Change the default settings
                var settings = {
                    autoPlay: false,
                    transitionSpeed: 5000,
                    indicator: true,
                    actionButton: true,
                    navigation: "buttons",
                    sliderRunning: false
                };
                
                $.extend(settings,arguments[0]);
                return this.each(function(){
                    var element = $(this);
                    var slides = element.find("li").hide();
                    
                    //Setting up the timer indicator
                    var timerIndicatorContainer = $('<div class="slider-timer-indicator-container"/>').appendTo(element);
                    $('<div class="slider-timer-indicator"/>').appendTo(timerIndicatorContainer);
                    
                    //Setting up the thumbnails
                    var thumbsContainer = $('<div class="thumbs-container"/>');
                    element.find(".thumb").each(function(){
                        var thumb = $(this);
                        thumb.addClass("thumb-id"+thumb.find("img").data("id"));
                    });
                    
                    $('<div class="thumb-prev thumb-slot"/>').on({
                        click: function click(){
                            helpers.flipSlide(element, false);
                        }
                    }).appendTo(thumbsContainer);
                    $('<div class="thumb-current thumb-slot"/>').appendTo(thumbsContainer);
                    $('<div class="thumb-next thumb-slot"/>').on({
                        click: function click(){
                            helpers.flipSlide(element, true);
                        }
                    }).appendTo(thumbsContainer);
                    thumbsContainer.appendTo(element);
                    
                    helpers.revalidateThumbs(element, slides.filter(":first"));
                    
                    var navContainer = $('<div class="slider-nav"/>');
                    
                    //Setting up the navigation Prev
                    var prevButton = $('<div class="slider-icons slider-prev"/>').on({
                        click: function click(){
                            helpers.flipSlide(element,false);
                        }
                    }).appendTo(navContainer);
                    
                    //Setting up the play/pause button
                    var playButton = $('<div class="slider-icons slider-play"/>').on({
                        click: function click(){
                            helpers.runSlider(element, settings, true);
                            playButton.hide();
                            pauseButton.show();
                        }
                    }).appendTo(navContainer);
                    var pauseButton = $('<div class="slider-icons slider-pause"/>').on({
                        click: function click(){
                            helpers.runSlider(element, settings, false);
                            playButton.show();
                            pauseButton.hide();
                        }
                    }).appendTo(navContainer);
                    
                    if(settings.action){
                        if(settings.autoPlay){
                            pauseButton.show();
                            playButton.hide();
                        } else {
                            pauseButton.hide();
                            playButton.show();
                        }
                    } else {
                        playButton.hide();
                        pauseButton.hide();
                    }
                    
                    //setting up the navigation next button
                    var nextButton = $('<div class="slider-icons slider-next"/>').on({
                        click: function click(){
                            helpers.flipSlide(element,true);
                        }
                    }).appendTo(navContainer);
                    navContainer.appendTo(element).hide();
                    
                    element.on({
                        mouseenter: function mouseenter(){
                            navContainer.stop().clearQueue().fadeTo(300,1);
                        },
                        mouseleave: function mouseleave(){
                            navContainer.stop().clearQueue().fadeTo(300,0);
                        }
                    });
                    
                    //showing either the thumbnails or the next/prev buttons according to the settings
                    if(settings.navigation == "buttons"){
                        thumbsContainer.hide();
                        prevButton.show();
                        nextButton.show();
                    } else {
                        thumbsContainer.show();
                        prevButton.hide();
                        nextButton.hide();
                    }
                    
                    //refreshing image positions
                    methods.revalidate.call(element);
                    
                    //displaying the first slide
                    slides.filter(":first").addClass("current").show();
                    
                    //Setting the auto play
                    if(settings.autoPlay){
                        helpers.runSlider(element, settings, true);
                    }
                    
                    element.data("imageSliderSettings",settings);
                });
            },
            options: function options(args){
                return this.each(function(){
                    var settings = args[0];
                    var element = $(this);
                    
                    for(var s in settings){
                        helpers[s](element,settings[s]);
                    }
                    
                    var oldSettings = element.data("imageSliderSettings");
                    $.extend(oldSettings,settings);
                    
                    element.data("imageSliderSettings",oldSettings);
                });
            },
            revalidate: function revalidate(){
                return this.each(function(){
                    var element = $(this);
                    var thumbsContainer = element.find(".thumbs-container");
                    
                    var hDiv = element.height();
                    var wDiv = element.width();
                    var ratioDiv = wDiv/hDiv;
                    
                    var thumbScaleFactor = 10;
                    
                    element.find("a")
                    .css({
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        display: "inline-block",
                        position: "relative"
                    }).find("img")
                    .each(function(){
                        var image = $(this);
                        var thumb = element.find(".thumb-id"+image.data("id"));
                        
                        var ratioImg = image.data("oitar");
                        var hImg, wImg;
                        
                        if (ratioDiv < ratioImg) {
                            hImg = hDiv;
                            wImg = hDiv * ratioImg;
                        } else if (ratioDiv > ratioImg) {
                            wImg = wDiv;
                            hImg = wDiv / ratioImg;
                        } else {
                            wImg = wDiv;
                            hImg = hDiv;
                        }

                        thumb.css({
                            width: wDiv/thumbScaleFactor,
                            height: hDiv/thumbScaleFactor,
                            position: "relative"
                        });
                        
                        thumb.find("img").css({
                            position: "absolute",
                            width: wImg/thumbScaleFactor,
                            height: hImg/thumbScaleFactor,
                            top: ((hDiv - hImg) / (2*thumbScaleFactor)) + 'px', 
                            left: ((wDiv - wImg) / (2*thumbScaleFactor)) + 'px'
                        });

                        image.css({
                            position: "absolute",
                            width: wImg,
                            height: hImg,
                            top: ((hDiv - hImg) / 2) + 'px', 
                            left: ((wDiv - wImg) / 2) + 'px'
                        });

                    });   
                });
            }
        }
        
        if ( methods[method] ) {
            return methods[method].call(this,(Array.prototype.slice.call( arguments, 1 )));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.call(this, arguments[0]);
        } else {
            $.error( 'Method ' +  method + ' does not exist' );
        }   
    }
})(jQuery);