(function($){
    
    //helper functions
    var helpers = {
        _lastInterval: null,
        update: function(element){
            var vScrollbar = element.children(".jquery-scrollbar-vertical");
            var vScrollbarIndicator = vScrollbar.find(".jquery-scrollbar-vertical-indicator");
            var hScrollbar = element.children(".jquery-scrollbar-horizontal");
            var hScrollbarIndicator = hScrollbar.find(".jquery-scrollbar-horizontal-indicator");
            var container = element.find(".jquery-scrollbar-container:first");
            var containerHeight = container.height();
            var containerWidth = container.width();
            //checking for vertical scroll
            var interval = element.data("jquery-scrollbar-interval");
            if(container.get(0).scrollHeight > containerHeight){
                if(typeof interval != 'undefined'){
                    clearInterval(interval);
                }
                interval = setInterval(function(){
                    //get the vertical scrollbar height
                    var vScrollbarHeight = vScrollbar.height();
                
                    //calculating the vertical scrollbar indicator height
                    //the size is calculated based on how many % is visible.. so if 50% of the content is visible
                    //then the scrollbar indicator will have 50% of the scrollbar height
                    var vScrollbarIndicatorHeight = (1-((container.get(0).scrollHeight-containerHeight)/container.get(0).scrollHeight))*vScrollbarHeight;
                
                
                    //refreshing position
                    var vMaxIndicatorTop = vScrollbar.height()-vScrollbarIndicatorHeight;
                    var vScrollbarIndicatorTop = (container.get(0).scrollTop/(container.get(0).scrollHeight-containerHeight))*vMaxIndicatorTop;

                    //applying the height and position
                    var theAnimation = {
                        top: vScrollbarIndicatorTop+"px",
                        height: vScrollbarIndicatorHeight+"px"
                    }
                    vScrollbarIndicator.stop().clearQueue().animate(theAnimation,300);
                    vScrollbar.stop().clearQueue().fadeTo(300,1);
                    clearInterval(vScrollbar.parent().data("jquery-scrollbar-interval"));
                },100);
                element.data("jquery-scrollbar-interval",interval);
            } else {
                vScrollbar.stop().clearQueue().fadeTo(300,0);
            }
            
            //checking for horizontal scroll
            if(container.get(0).scrollWidth > containerWidth){
                //get the vertical scrollbar width
                var hScrollbar = element.find(".jquery-scrollbar-horizontal");
                var hScrollbarWidth = hScrollbar.width();
                
                //calculating the horizontal scrollbar indicator width
                //the size is calculated based on how many % is visible.. so if 50% of the content is visible
                //then the scrollbar indicator will have 50% of the scrollbar width
                hScrollbarIndicator.width((1-((container.get(0).scrollWidth-containerWidth)/container.get(0).scrollWidth))*hScrollbarWidth);
                
                hScrollbarIndicator.show();
            } else {
                hScrollbarIndicator.hide();
            }
        }
    };
    
    $.fn.jqueryScrollbar = function(method){
        var methods = {
            init: function(args){    
                //default settings
                var settings = {
                    vertical: true,
                    horizontal: false,
                    id: null,
                    totalScollMargin: 10
                }
                $.extend(settings,args);
                return this.each(function(){
                    var element = $(this);
                    
                    //isolating the content
                    var container = $('<div class="jquery-scrollbar-container"/>').append(element.contents()).appendTo(element);
                    
                    //applying the content class if present
                    if(settings.contentClass !== null){
                        container.addClass(settings.contentClass);
                    }
                    
                    //overriding the container default overflow
                    container.css({
                        overflow: "hidden",
                        height: "100%",
                        width: "100%"
                    });
                    
                    //Changing some of the element properties to fix the horizontal and vertical bars
                    var elementCss = {}
                    if(element.css("position") == "static") {
                        elementCss.position = "relative";
                    }
                    element.css(elementCss);
                    
                    //creating the vertical scroll elements if required
                    if(settings.vertical){
                        var vScrollbar = $('<div class="jquery-scrollbar-vertical"></div>').appendTo(element);
                        
                        //on mousedown tell the mouse move to scroll on mouseup on the document clear that flag
                        var vScrollbarIndicator = $('<div class="jquery-scrollbar-vertical-indicator"></div>').appendTo(vScrollbar).on({
                            mousedown: function(event){
                                var vScrollbar = $(this).parents(".jquery-scrollbar-vertical:first");
                                var vScrollbarIndicatorPosition = $(this).position();
                                var init = {
                                    init: true,
                                    scrollbarPosition: vScrollbar.offset(),
                                    cursorOffset: event.offsetY
                                }
                                init.scrollbarPosition.bottom = init.scrollbarPosition.top+vScrollbar.height();
                                init.maxIndicatorTop = vScrollbar.height()-vScrollbarIndicator.height();
                                vScrollbar.data("jquery-scrollbar-init",init);
                                event.preventDefault();
                            }
                        });
                        
                        //hooking the mousewheel events
                        element.on({
                            mousewheel: function mousewheel(event,delta,deltaX,deltaY){
                                var vScrollbar = element.children(".jquery-scrollbar-vertical");
                                var maxIndicatorTop = vScrollbar.height()-vScrollbarIndicator.height();
                                var vScrollbarHandleTop = parseInt(vScrollbarIndicator.css("top").replace("px"),10);
                                var top = vScrollbarHandleTop - delta*5;
                                var theContainer = element.children(".jquery-scrollbar-container");
                                
                                //theContainer.scrollTop((top/maxIndicatorTop)*(theContainer.get(0).scrollHeight-theContainer.height()));
                                theContainer.scrollTop(theContainer.scrollTop()-delta*40);
                                
                                var scrollMargin = theContainer.get(0).scrollHeight-settings.totalScollMargin;
                                var scrollPosition = theContainer.scrollTop()+theContainer.height();
                                           
                                if( scrollMargin <  scrollPosition && !vScrollbar.data("jquery-scrollbar-total-scroll")){
                                    element.trigger("totalScroll");
                                    vScrollbar.data("jquery-scrollbar-total-scroll",true);
                                //helpers.update(element);
                                } else if( scrollMargin >=  scrollPosition) {
                                    vScrollbar.data("jquery-scrollbar-total-scroll",false);
                                }
                                
                                helpers.update(element);
                                                     
                                event.preventDefault();
                                return false;
                            }
                        });
                        
                        //clearing the mousemove scroll flag
                        $(document).on({
                            mouseup: function(event){
                                vScrollbar.data("jquery-scrollbar-init",false);
                            },
                            mousemove: function(event){
                                var theContainer = element.children(".jquery-scrollbar-container");
                                var scrollInitObj = vScrollbar.data("jquery-scrollbar-init");
                                if(scrollInitObj && scrollInitObj.init === true){
                                    
                                    var top = event.pageY-scrollInitObj.scrollbarPosition.top-scrollInitObj.cursorOffset;
                                    
                                    top = top<0?0:top;
                                    top = top>scrollInitObj.maxIndicatorTop?scrollInitObj.maxIndicatorTop:top;
                                    
                                    vScrollbarIndicator.css("top",top);
                                    theContainer.get(0).scrollTop=(top/scrollInitObj.maxIndicatorTop)*(theContainer.get(0).scrollHeight-theContainer.height());
                                    
                                    var scrollMargin = theContainer.get(0).scrollHeight-settings.totalScollMargin;
                                    var scrollPosition = theContainer.scrollTop()+theContainer.height();
                                           
                                    if( scrollMargin <  scrollPosition && !vScrollbar.data("jquery-scrollbar-total-scroll")){
                                        element.trigger("totalScroll");
                                        vScrollbar.data("jquery-scrollbar-total-scroll",true);
                                    //helpers.update(element);
                                    } else if( scrollMargin >=  scrollPosition) {
                                        vScrollbar.data("jquery-scrollbar-total-scroll",false);
                                    }
                                    
                                    event.preventDefault();
                                }
                            }
                        });
                    }
                    
                    //creating the horizontal scroll elements if required
                    if(settings.horizontal){
                    //element.append('<div class="jquery-scrollbar-horizontal"><div class="jquery-scrollbar-horizontal-indicator"></div></div>');
                    }
                    
                    
                    helpers.update(element);
                    
                });
            },
            update: function(){
                return this.each(function(){
                    helpers.update($(this)); 
                });
            },
            scrollTo: function(args){
                return this.each(function(){
                    var element = $(this);
                    var container = element.children(".jquery-scrollbar-container");
                    if(args[1]===false){
                        container.scrollTop(args[0]);
                        helpers.update(element);
                    } else {
                        container.animate({
                            scrollTop: args[0]+"px"
                        },300,"linear",function(){
                            helpers.update(element);
                        });
                    }
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