(function($){
    
    //helper functions
    var helpers = {
        update: function(element){
            var vScrollbar = element.children(".jquery-scrollbar-vertical");
            var vScrollbarIndicator = vScrollbar.find(".jquery-scrollbar-vertical-indicator");
            var hScrollbar = element.children(".jquery-scrollbar-horizontal");
            var hScrollbarIndicator = hScrollbar.find(".jquery-scrollbar-horizontal-indicator");
            var container = element.find(".jquery-scrollbar-container:first");
            var containerHeight = container.height();
            var containerWidth = container.width();
            //checking for vertical scroll
            if(container.get(0).scrollHeight > containerHeight){
                //get the vertical scrollbar height
                var vScrollbarHeight = vScrollbar.height();
                
                //calculating the vertical scrollbar indicator height
                //the size is calculated based on how many % is visible.. so if 50% of the content is visible
                //then the scrollbar indicator will have 50% of the scrollbar height
                var vScrollbarIndicatorHeight = (1-((container.get(0).scrollHeight-containerHeight)/container.get(0).scrollHeight))*vScrollbarHeight;
                vScrollbarIndicator.height(vScrollbarIndicatorHeight);
                
                //refreshing position
                var vMaxIndicatorTop = vScrollbar.height()-vScrollbarIndicator.height();
                var vScrollbarIndicatorTop = (container.get(0).scrollTop/(container.get(0).scrollHeight-containerHeight))*vMaxIndicatorTop;
                vScrollbarIndicator.css("top",vScrollbarIndicatorTop+"px");
                
                vScrollbar.show();
            } else {
                vScrollbar.hide();
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
                    id: null
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
                    var elementCss = {
                    //                        paddingRight: 8,
                    //                        paddingBottom: 8
                    };
                    if(element.css("position") == "static") {
                        elementCss.position = "relative";
                    }
                    element.css(elementCss);
                    
                    //creating the vertical scroll elements if required
                    if(settings.vertical){
                        var vScrollbar = $('<div class="jquery-scrollbar-vertical"></div>').appendTo(element).on({
                            mousedown: function(event){
                                var element = $(this);
                                var init = {
                                    init: true,
                                    scrollbarPosition: vScrollbar.offset()
                                }
                                init.scrollbarPosition.bottom = init.scrollbarPosition.top+vScrollbar.height();
                                init.maxIndicatorTop = vScrollbar.height()-vScrollbarIndicator.height();
                                element.data("jquery-scrollbar-init",init);
                                event.preventDefault();
                            }
                        });
                        
                        //hooking the mousewheel events
                        element.on({
                            mousewheel: function(event,delta,deltaX,deltaY){
                                var vScrollbar = element.children(".jquery-scrollbar-vertical");
                                var maxIndicatorTop = vScrollbar.height()-vScrollbarIndicator.height();
                                var vScrollbarHandleTop = parseInt(vScrollbarIndicator.css("top").replace("px"),10);
                                var top = vScrollbarHandleTop - delta*5;
                                
                                top = top<0?0:top;
                                top = top>maxIndicatorTop?maxIndicatorTop:top;
                                
                                vScrollbarIndicator.css("top",top);
                                var theContainer = element.children(".jquery-scrollbar-container");
                                
                                theContainer.get(0).scrollTop=(top/maxIndicatorTop)*(theContainer.get(0).scrollHeight-theContainer.height());
                                                                
                                event.preventDefault();
                                return false;
                            }
                        })
                        
                        //on mousedown tell the mouse move to scroll on mouseup on the document clear that flag
                        var vScrollbarIndicator = $('<div class="jquery-scrollbar-vertical-indicator"></div>').appendTo(vScrollbar);
                        //clearing the mousemove scroll flag
                        $(document).on({
                            mouseup: function(event){
                                vScrollbar.data("jquery-scrollbar-init",false);
                            },
                            mousemove: function(event){
                                var theContainer = element.children(".jquery-scrollbar-container");
                                var scrollInitObj = vScrollbar.data("jquery-scrollbar-init");
                                if(scrollInitObj && scrollInitObj.init === true){
                                    
                                    var top = event.pageY-scrollInitObj.scrollbarPosition.top;
                                    
                                    top = top<0?0:top;
                                    top = top>scrollInitObj.maxIndicatorTop?scrollInitObj.maxIndicatorTop:top;
                                    
                                    vScrollbarIndicator.css("top",top);
                                    theContainer.get(0).scrollTop=(top/scrollInitObj.maxIndicatorTop)*(theContainer.get(0).scrollHeight-theContainer.height());
                                    
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
                    element.children(".jquery-scrollbar-container").get(0).scrollTop = args[0];
                    helpers.update(element);
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