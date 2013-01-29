(function($){
    
    //helper functions
    
    var helpers = {};
    
    //Init Settings
    var settings = {
        initialState: false
    };
    
    $.fn.radiobox = function(method){
        
        var methods = {
            init: function(){
                return this.each(function(){
                    var element = $(this).hide().wrap('<div class="flexly-radiobox" style="display:inline-block"/>');
                    if(element.attr("type") != "radio"){
                        $.error("only radio buttons are allowed.");
                    }
                    
                    var container = element.parent();
                    
                    $('<div class="flexly-icon flexly-icon-radiobox"/>').appendTo(container).on({
                        click: function click(){
                            element.attr("checked","checked").trigger("change");
                            $('input[name="'+element.attr("name")+'"]').not(element).removeAttr("checked").trigger("change");
                        }
                    });
                    
                    element.on({
                        change: function change(){
                            methods.update.call(element);
                        }
                    });
                    
                    if(settings.initialState){
                        element.attr("checked","checked");
                    }
                    
                    methods.update.call(element);
                });
            },
            update: function(){
                return this.each(function(){
                    var element = $(this);
                    var icon = element.parents(".flexly-radiobox:first").find(".flexly-icon");
                    if(element.is(":checked")){
                        icon.addClass("flexly-icon-radiobox-checked");
                        $('input[name="'+element.attr("name")+'"]').not(element)
                        .parents(".flexly-radiobox").find(".flexly-icon")
                        .removeClass("flexly-icon-radiobox-checked");
                    } else {
                        $('input[name="'+element.attr("name")+'"]').not("#"+element.attr("id")+":checked")
                        .parents(".flexly-radiobox").find(".flexly-icon")
                        icon.removeClass("flexly-icon-radiobox-checked");
                    }
                });
            }
        }
        
        if ( methods[method] ) {
            return methods[method].call(this,(Array.prototype.slice.call( arguments, 1 )));
        } else if ( typeof method === 'object' || ! method ) {
            $.extend(settings,arguments[0]);
            return methods.init.call(this, arguments[0]);
        } else {
            $.error( 'Method ' +  method + ' does not exist' );
        }   
    }
})(jQuery);