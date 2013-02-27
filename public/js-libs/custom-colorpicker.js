(function($){
    
    //helper functions
    
    var helpers = {
        getCanvasPixelColor: function(theCanvas,theContext,event){
            var canvasOffset = theCanvas.offset();
            var canvasX = Math.floor(event.pageX - canvasOffset.left);
            var canvasY = Math.floor(event.pageY - canvasOffset.top);

            var pixel = theContext.getImageData(canvasX, canvasY, 1, 1);
            
            return mxBuilder.colorsManager.createColorObjFromRGBA(pixel.data[0],pixel.data[1],pixel.data[2], 1);
        }
    };
    
    $.fn.customColorpicker = function(method){
        
        var methods = {
            init: function(args){
                var settings = {}
                $.extend(settings,args);
                return this.each(function(){
                    var element = $(this);
                    
                    //caching the settings
                    element.data("custom-colopicker-settings",settings);
                    
                    //building the colorpicker
                    var pickerElements = $('<div class="flexly-color-picker"></div>').appendTo(element);
                    
                    var theInput = $('<input type="text" class="flexly-color-picker-input"/>').appendTo(pickerElements);
                    var theCanvas = $('<canvas class="color-canvas" height="35" width="169"></canvas>').appendTo(pickerElements);
                    pickerElements.append('<div style="clear:both;"/>');
                    var theClearButton = $('<button class="jquery-colorpicker-clear">No Color</button>').appendTo(pickerElements);
                    
                    var theContext = theCanvas.get(0).getContext("2d");
                    
                    
                    //The Clear Button
                    
                    theClearButton.on({
                        click: function click(){
                            var color = mxBuilder.colorsManager.createColorObjFromRGBA(0, 0, 0, 0);
                            theInput.val(color.toHex()).css({
                                backgroundColor:color.toHex(),
                                color: color.getInverse().toHex()
                            });
                            element.trigger("pickerColorRest",color);
                        }
                    });
                    
                    //Color Canvas
                    var image = $('<img src="public/images/palette.png"/>').on({
                        load: function load(){
                            theContext.drawImage(image.get(0),0,0);
                        }
                    });
                    theCanvas.on({
                        mousemove: function mousemove(event){
                            var color = helpers.getCanvasPixelColor(theCanvas, theContext, event);
                            theInput.css({
                                color: color.getInverse().toString(),
                                backgroundColor: color.toString()
                            });
                            element.trigger("pickerOver",color);
                        },
                        mouseout: function mouseout(){
                            var color = mxBuilder.colorsManager.createColorObjFromHEXString(theInput.val());
                            theInput.css({
                                backgroundColor: color.toString(),
                                color: color.getInverse().toString()
                            });
                            element.trigger("pickerOut");
                        },
                        mousedown: function mousedown(event){
                            var color = helpers.getCanvasPixelColor(theCanvas, theContext, event);
                            theInput.val(color.toHex()).css({
                                backgroundColor:color.toHex(),
                                color: color.getInverse().toHex()
                            });
                            element.trigger("pickerColorChanged",color);
                        }                        
                    });
                });
            },
            value: function(args){
                if(args.length > 0){
                    return this.each(function(){
                        var element = $(this);
                        element.find("input").val(args[0].toHex()).css({
                            backgroundColor: args[0].toHex(),
                            color: args[0].getInverse().toHex()
                        });
                    });
                } else {
                    return mxBuilder.colorsManager.createColorObjFromHEXString(this.filter(":first").find(".flexly-color-picker-input").val());
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