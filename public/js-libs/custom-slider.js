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
                    var element = $(this).addClass("ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all").data("slider-settings",settings);
                    $('<a class="ui-slider-handle ui-state-default ui-corner-all" style="height:8px;width:8px;border-width:2px" href="#"></a>').appendTo(element)
                    .draggable({
                        containment: "parent",
                        axis: "x",
                        drag: function(event, ui){
                            settings.slide.call(element,event,{
                                value: methods.value.call(element)
                            });
                        }
                    });
                    
                    if(settings.value){
                        methods.value.call(element,[settings.value]);
                        delete settings.value;
                    }
                });
            },
            value: function(value){
                if(value && value.length == 1){
                    return this.each(function(){
                        var element = $(this);
                        var theHandle = element.find('a.ui-slider-handle');
                        var percentage;
                        var settings = element.data("slider-settings");
                        percentage = value[0]/settings.max;
                        theHandle.css("left",percentage*(element.width()-theHandle.outerWidth())); 
                    });
                } else {
                    var elementWidth = this.width();
                    var theHandle = this.find('a.ui-slider-handle');
                    var settings = this.data("slider-settings");
                    var handlePosition = theHandle.position();
                    var percentage = handlePosition.left/(elementWidth-theHandle.outerWidth());
                    return Math.round((settings.max-settings.min)*percentage+settings.min);
                }
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