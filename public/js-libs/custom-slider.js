(function($){
    
    //helper functions
    
    var helpers = {};
    
    $.fn.customSlider = function(method){
        
        var methods = {
            init: function(args){
                //Init Settings
                var settings = {
                    max: 100,
                    min: 0,
                    slide: function(){
            
                    }
                };
                $.extend(settings,args);
                return this.each(function(){
                    var element = $(this).addClass("ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all");
                    var elementWidth = 0;
                    $('<a class="ui-slider-handle ui-state-default ui-corner-all" href="#"></a>').appendTo(element)
                    .draggable({
                        containment: "parent",
                        axis: "x",
                        start: function(event,ui){
                            elementWidth = element.width();
                        },
                        drag: function(event, ui){
                            var theHandle = $(this);
                            var handlePosition = theHandle.position();
                            var percentage = handlePosition.left/(elementWidth-theHandle.outerWidth());
                            var value = Math.round((settings.max-settings.min)*percentage+settings.min);
                            settings.slide.call(element,event,{
                                value: value
                            });
                        }
                    })
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