(function($){
    
    //helper functions
    
    var helpers = {};
    
    
    
    $.fn.customMenu = function(method){
        
        var methods = {
            init: function(args){
                //Init Settings
                var settings = {
                    orientation: "horizontal"
                };
                $.extend(settings,args);
                return this.each(function(){
                    var element = $(this);
                    
                    element.data("custom-menu-settings",settings);
                    
                    //methods.refresh.call(element);
                    
                    //adding classes
                    element.addClass("dropdown dropdown-horizontal"); 
                    
                });
            },
            refresh: function(){
                return this.each(function(){
//                    var element = $(this);
//                    //hide childs
//                    element.find(">li>ul").each(function(){
//                        var theUl = $(this).hide();
//                        var theParent = theUl.parent();
//                        theParent.css("position","relative").off(".flexlymenu").on({
//                            "mouseenter.flexlymenu": function(){
//                                theUl.show();
//                            },
//                            "mouseleave.flexlymenu": function(){
//                                theUl.hide();
//                            }
//                        });
//                        theUl.css({
//                            position: "absolute",
//                            left: 0,
//                            top: theParent.outerHeight(true)
//                        }).show().find("ul").each(function(){
//                            var element = $(this);
//                            element.css({
//                                top: 0,
//                                left: theUl.outerWidth(true)
//                            });
//                        }).end().hide();
//                    });
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