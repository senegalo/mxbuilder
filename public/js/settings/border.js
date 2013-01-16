(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.border = {
            _template: mxBuilder.layout.templates.find(".flexly-component-border-settings").remove(),
            getPanel: function(expand){
                
                var borderSettings = this;
                var currentInstance = this._template.clone();
                
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                thePanel.find(".flexly-collapsable-title")
                .text("Border")
                .end();
                
                var controls = {
                    widthSlider: currentInstance.find(".border-width-slider"),
                    widthValue: currentInstance.find(".border-width-value"),
                    simulator: currentInstance.find(".border-radius-simulator"),
                    radiusValue: currentInstance.find(".border-radius-value"),
                    picker: currentInstance.find(".picker")
                }
                controls.simulatorSliderTopLeft = controls.simulator.parent().find(".border-radius-slider-t-l");
                controls.simulatorSliderTopRight = controls.simulator.parent().find(".border-radius-slider-t-r");
                controls.simulatorSliderBottomLeft = controls.simulator.parent().find(".border-radius-slider-b-l");
                controls.simulatorSliderBottomRight = controls.simulator.parent().find(".border-radius-slider-b-r");
                
                controls.picker.customColorpicker().on({
                    pickerColorChanged: function pickerColorChanged(event,color){
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            mxBuilder.selection.each(function(){
                                this.setBorder({
                                    borderColor: color.toString(),
                                    borderStyle: "solid"
                                });
                            });
                        } 
                    }
                });
                
                //Simulator checkbox
                currentInstance.find("#flexly-component-border-radius-sym").checkbox().on({
                    change: function change(){
                        controls.symmetricRadius = $(this).is(":checked");
                        if(controls.symmetricRadius){
                            borderSettings.setSimRadius(controls, "topLeft", controls.simulatorSliderTopLeft.customSlider("value"));
                        }
                    }
                });
                //Radius Sliders
                //top left
                controls.simulatorSliderTopLeft.customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        borderSettings.setSimRadius(controls, "topLeft",ui.value);
                        controls.radiusValue.text(ui.value+" Pixels");
                    }
                });
                //bottom left
                controls.simulatorSliderBottomLeft.customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        borderSettings.setSimRadius(controls, "bottomLeft",ui.value);
                        controls.radiusValue.text(ui.value+" Pixels");
                    }
                });
                //top right
                controls.simulatorSliderTopRight.width(50).customSlider({
                    max: 50,
                    min: 0,
                    value: 50,
                    slide: function slide(event,ui){
                        ui.value = 50-ui.value;
                        borderSettings.setSimRadius(controls,"topRight",ui.value);
                        controls.radiusValue.text(ui.value+" Pixels");
                    }
                });
                //bottom right
                controls.simulatorSliderBottomRight.width(50).customSlider({
                    max: 50,
                    min: 0,
                    value: 50,
                    slide: function slide(event,ui){
                        ui.value = 50-ui.value;
                        borderSettings.setSimRadius(controls,"bottomRight",ui.value);
                        controls.radiusValue.text(ui.value+" Pixels");
                    }
                });
                
                
                //Width Slider
                controls.widthSlider.customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        controls.widthValue.text(ui.value+" Pixels");
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            mxBuilder.selection.each(function(){
                                this.setBorder({
                                    borderWidth:ui.value+"px",
                                    borderStyle: "solid"
                                });
                            });
                            mxBuilder.selection.revalidateSelectionContainer();
                        }
                    }
                });
                
                thePanel.on({
                    previewEnabled: function(){
                        borderSettings.applyValuesToSelection(controls);
                    },
                    save: function(){
                        borderSettings.applyValuesToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                    },
                    previewDisabled: function(){
                        mxBuilder.selection.each(function(){
                            this.setBorder(originalSettings);
                        });
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        mxBuilder.selection.each(function(){
                            this.setBorder(originalSettings);
                        });
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                })
                
                thePanel.find(".flexly-collapsable-content")
                .append(currentInstance);
                
                //Read the selection values and preset it 
                var originalSettings = mxBuilder.layout.utils.readSelectionStyles(["border"]);
                this.setValues(controls,originalSettings);
                
                return thePanel;
            },
            setSimRadius: function(controls,pos,val){
                var cssRule;
                if(controls.symmetricRadius){
                    controls.simulator.css("border-radius",val);
                    controls.simulator.parent().find(".border-radius-slider-l")
                    .customSlider("value",val)
                    .end()
                    .find(".border-radius-slider-r")
                    .customSlider("value",50-val);
                    if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                        cssRule = {
                            borderRadius:val+"px",
                            borderStyle: "solid"
                        }
                    }
                } else {
                    controls.simulator.css('border'+pos.uppercaseFirst()+'Radius',val);
                    cssRule = {
                        borderStyle: "solid"
                    }
                    cssRule['border'+pos.uppercaseFirst()+'Radius'] = val;
                }
                if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                    mxBuilder.selection.each(function(){
                        this.setBorder(cssRule);
                    });
                }
            },
            applyValuesToSelection: function(controls){
                mxBuilder.selection.each(function(){
                    var cssRules = {
                        borderColor: controls.picker.customColorpicker("value"),
                        borderWidth: controls.widthSlider.customSlider("value")
                    }
                    if(controls.symmetricRadius){
                        cssRules.borderRadius = controls.simulatorSliderTopLeft.customSlider("value");
                    } else {
                        var corners = ["TopLeft","BottomLeft","BottomRight","TopRight"];
                        for(var c in corners){
                            var borderRadius =  controls['simulatorSlider'+corners[c]].customSlider("value");
                            if(c > 1){
                                borderRadius = 50 - borderRadius;
                            }
                            cssRules['border'+corners[c]+'Radius'] = borderRadius;
                        }
                    }
                    this.setBorder(cssRules);
                });
                
                mxBuilder.selection.revalidateSelectionContainer();
                
            },
            setValues: function(controls,values){
                if(values.borderColor){
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.borderColor);
                    controls.picker.customColorpicker("value",colorObj);
                }
                if(values.borderWidth){
                    values.borderWidth = parseInt(values.borderWidth.replace("px",""),10);
                    controls.widthValue.text(values.borderWidth+" Pixel");
                    controls.widthSlider.customSlider("value",values.borderWidth);
                }
                
                var corners = ["TopLeft","TopRight","BottomLeft","BottomRight"];
                for(var c in corners){
                    if(values["border"+corners[c]+"Radius"]){
                        values["border"+corners[c]+"Radius"] = parseInt(values["border"+corners[c]+"Radius"].replace("px",""),10);
                        this.setSimRadius(controls,corners[c], values["border"+corners[c]+"Radius"]);
                        controls["simulatorSlider"+corners[c]].customSlider("value",corners[c].match(/.*Right/)?50-values["border"+corners[c]+"Radius"]:values["border"+corners[c]+"Radius"]);
                    }
                }
            }
        }
    });
    
}(jQuery));