(function($){
    
    //helper functions
    
    var helpers = {};
    
    //Init Settings
    var settings = {
        initialState: false
    };
    
    $.fn.checkbox = function(method){
        
        var methods = {
            init: function(){
                return this.each(function(){
                    var element = $(this).hide().wrap('<div class="flexly-checkbox" style="display:inline-block"/>');
                    if(element.attr("type") != "checkbox"){
                        $.error("only checkboxes are allowed.");
                    }
                    
                    var container = element.parent();
                    
                    $('<div class="flexly-icon flexly-icon-checkbox"/>').appendTo(container).on({
                        click: function click(){
                            if(element.is(":checked")){
                                element.removeAttr("checked");
                            } else {
                                element.attr("checked","checked");
                            }
                            methods.update.call(element);
                            element.trigger("change");
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
                    var icon = element.parents(".flexly-checkbox:first").find(".flexly-icon");
                    if(element.is(":checked")){
                        icon.addClass("flexly-icon-checkbox-checked");
                    } else {
                        icon.removeClass("flexly-icon-checkbox-checked");
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