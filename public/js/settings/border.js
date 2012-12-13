(function($){
    
    $(function(){
        mxBuilder.menuManager.menus.componentSettings._settings.border = {
            _template: mxBuilder.layout.templates.find(".flexly-component-border-settings").remove(),
            _symmetricRadius: false,
            getPanel: function(){
                
                var componentSettings = this;
                var theContent = this._template.clone();
                var widthSlider = theContent.find(".border-width-slider");
                var widthValue = theContent.find(".border-width-value");
                var simulator = theContent.find(".border-radius-simulator");
                var radiusValue = theContent.find(".border-radius-value");
                var colorCanvas = theContent.find(".color-canvas");
                var canvasCtx = colorCanvas.get(0).getContext("2d");
                var colorInput = theContent.find("#flexly-component-border-color");
                
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel();
                thePanel.find(".flexly-collapsable-title")
                .text("Border")
                .end();
                
                //Color Canvas
                var image = $('<img src="public/images/palette.png"/>').on({
                    load: function load(){
                        canvasCtx.drawImage(image.get(0),0,0);
                    }
                });
                
                colorCanvas.on({
                    mousemove: function mousemove(event){
                        var canvasOffset = colorCanvas.offset();
                        var canvasX = Math.floor(event.pageX - canvasOffset.left);
                        var canvasY = Math.floor(event.pageY - canvasOffset.top);

                        var imageData = canvasCtx.getImageData(canvasX, canvasY, 1, 1);
                        
                        var colorObj = {};
                        $.extend(colorObj,mxBuilder.utils.createColorObj(),{
                            r: imageData.data[0],
                            g: imageData.data[1],
                            b: imageData.data[2]
                        });
                        colorInput.css({
                            backgroundColor:colorObj.toHex(),
                            color: colorObj.getInverse().toHex()
                        });
                    },
                    mouseout: function mouseout(){
                        colorInput.css("backgroundColor",colorInput.val());
                    },
                    mousedown: function mousedown(event){
                        var canvasOffset = colorCanvas.offset();
                        var canvasX = Math.floor(event.pageX - canvasOffset.left);
                        var canvasY = Math.floor(event.pageY - canvasOffset.top);

                        var imageData = canvasCtx.getImageData(canvasX, canvasY, 1, 1);
                        
                        var colorObj = {};
                        $.extend(colorObj,mxBuilder.utils.createColorObj(),{
                            r: imageData.data[0],
                            g: imageData.data[1],
                            b: imageData.data[2]
                        });
                        colorInput.val(colorObj.toHex()).css({
                            backgroundColor:colorObj.toHex(),
                            color: colorObj.getInverse().toHex()
                        });
                        return false;
                    }                        
                });
                
                
                //Simulator checkbox
                theContent.find("#flexly-component-border-radius-sym").checkbox().on({
                    change: function change(){
                       componentSettings._symmetricRadius = $(this).is(":checked");
                       if(componentSettings._symmetricRadius){
                           console.log(topLeftRadiusSlider.customSlider("value"));
                           componentSettings.setSimRadius(simulator, "topLeft", topLeftRadiusSlider.customSlider("value"))
                       }
                    }
                });
                
                //Radius Sliders
                //top left
                var topLeftRadiusSlider = theContent.find(".border-radius-slider-t-l").customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        componentSettings.setSimRadius(simulator, "topLeft",ui.value);
                        radiusValue.text(ui.value+" Pixels");
                    }
                });
                //bottom left
                theContent.find(".border-radius-slider-b-l").customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        componentSettings.setSimRadius(simulator, "bottomLeft",ui.value);
                        radiusValue.text(ui.value+" Pixels");
                    }
                });
                //top right
                theContent.find(".border-radius-slider-t-r").width(50).customSlider({
                    max: 50,
                    min: 0,
                    value: 50,
                    slide: function slide(event,ui){
                        ui.value = 50-ui.value;
                        componentSettings.setSimRadius(simulator, "topRight",ui.value);
                        radiusValue.text(ui.value+" Pixels");
                    }
                });
                //bottom right
                theContent.find(".border-radius-slider-b-r").width(50).customSlider({
                    max: 50,
                    min: 0,
                    value: 50,
                    slide: function slide(event,ui){
                        ui.value = 50-ui.value;
                        componentSettings.setSimRadius(simulator, "bottomRight",ui.value);
                        radiusValue.text(ui.value+" Pixels");
                    }
                });
                
                
                
                //Width Slider
                widthSlider.customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        widthValue.text(ui.value+" Pixels");
                    }
                });
                
                
                
                thePanel.find(".flexly-collapsable-content")
                .append(theContent);
                
                return thePanel;
            },
            setSimRadius: function(sim,pos,val){
                if(this._symmetricRadius){
                    sim.css("border-radius",val);
                    sim.parent().find(".border-radius-slider-l")
                    .customSlider("value",val)
                    .end()
                    .find(".border-radius-slider-r")
                    .customSlider("value",50-val);
                } else {
                    sim.css('border'+pos.uppercaseFirst()+'Radius',val);
                }
            }
        }
    });
    
}(jQuery));