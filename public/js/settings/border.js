(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.border = {
            _template: mxBuilder.layout.templates.find(".flexly-component-border-settings").remove(),
            _symmetricRadius: false,
            _currentInstance: null,
            _widthSlider: null,
            _widthValue: null,
            _simulator: null,
            _radiusValue: null,
            
            _picker: null,
            
            _simulatorSliderTopLeft: null,
            _simulatorSliderTopRight: null,
            _simulatorSliderBottomLeft: null,
            _simulatorSliderBottomRight: null,
            _originalSettings: null,
            getPanel: function(expand){
                
                var borderSettings = this;
                this._currentInstance = this._template.clone();
                this.updateInstanceVariables();
                
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                thePanel.find(".flexly-collapsable-title")
                .text("Border")
                .end();
                
                this._picker.customColorpicker().on({
                    pickerColorChanged: function pickerColorChanged(event,color){
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            mxBuilder.selection.each(function(){
                                this.getBorderElement().css({
                                    borderColor:color.toString(),
                                    borderStyle: "solid"
                                });
                            });
                        } 
                    }
                });
                
                //Simulator checkbox
                this._currentInstance.find("#flexly-component-border-radius-sym").checkbox().on({
                    change: function change(){
                        borderSettings._symmetricRadius = $(this).is(":checked");
                        if(borderSettings._symmetricRadius){
                            borderSettings.setSimRadius("topLeft", borderSettings._simulatorSliderTopLeft.customSlider("value"));
                        }
                    }
                });
                //Radius Sliders
                //top left
                this._simulatorSliderTopLeft.customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        borderSettings.setSimRadius("topLeft",ui.value);
                        borderSettings._radiusValue.text(ui.value+" Pixels");
                    }
                });
                //bottom left
                this._simulatorSliderBottomLeft.customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        borderSettings.setSimRadius("bottomLeft",ui.value);
                        borderSettings._radiusValue.text(ui.value+" Pixels");
                    }
                });
                //top right
                this._simulatorSliderTopRight.width(50).customSlider({
                    max: 50,
                    min: 0,
                    value: 50,
                    slide: function slide(event,ui){
                        ui.value = 50-ui.value;
                        borderSettings.setSimRadius("topRight",ui.value);
                        borderSettings._radiusValue.text(ui.value+" Pixels");
                    }
                });
                //bottom right
                this._simulatorSliderBottomRight.width(50).customSlider({
                    max: 50,
                    min: 0,
                    value: 50,
                    slide: function slide(event,ui){
                        ui.value = 50-ui.value;
                        borderSettings.setSimRadius("bottomRight",ui.value);
                        borderSettings._radiusValue.text(ui.value+" Pixels");
                    }
                });
                
                
                //Width Slider
                this._widthSlider.customSlider({
                    max: 50,
                    min: 0,
                    slide: function slide(event,ui){
                        borderSettings._widthValue.text(ui.value+" Pixels");
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            mxBuilder.selection.each(function(){
                                this.getBorderElement().css({
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
                        borderSettings.applyValuesToSelection();
                    },
                    save: function(){
                        borderSettings.applyValuesToSelection();
                        mxBuilder.menuManager.closeTab();
                    },
                    previewDisabled: function(){
                        mxBuilder.selection.each(function(){
                            this.getBorderElement().css(borderSettings._originalSettings);
                        });
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        mxBuilder.selection.each(function(){
                            this.getBorderElement().css(borderSettings._originalSettings);
                        });
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                })
                
                thePanel.find(".flexly-collapsable-content")
                .append(borderSettings._currentInstance);
                
                //Read the selection values and preset it 
                this._originalSettings = mxBuilder.layout.utils.readSelectionStyles({
                    border: [
                    "borderWidth",
                    "backgroundColor",
                    "borderColor",
                    "borderTopLeftRadius",
                    "borderTopRightRadius",
                    "borderBottomLeftRadius",
                    "borderBottomRightRadius"]
                });
                this.setValues(this._originalSettings);
                
                return thePanel;
            },
            setSimRadius: function(pos,val){
                var cssRule;
                if(this._symmetricRadius){
                    this._simulator.css("border-radius",val);
                    this._simulator.parent().find(".border-radius-slider-l")
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
                    this._simulator.css('border'+pos.uppercaseFirst()+'Radius',val);
                    cssRule = {
                        borderStyle: "solid"
                    }
                    cssRule['border'+pos.uppercaseFirst()+'Radius'] = val;
                }
                if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                    mxBuilder.selection.each(function(){
                        this.getBorderElement().css(cssRule);
                    });
                }
            },
            applyValuesToSelection: function(){
                
                var borderSettings = this;
                
                mxBuilder.selection.each(function(){
                    var cssRules = {
                        borderColor: borderSettings._picker.customColorpicker("value"),
                        borderWidth: borderSettings._widthSlider.customSlider("value")
                    }
                    if(borderSettings._symmetricRadius){
                        cssRules.borderRadius = borderSettings._simulatorSliderTopLeft.customSlider("value");
                    } else {
                        var corners = ["TopLeft","BottomLeft","BottomRight","TopRight"];
                        for(var c in corners){
                            var borderRadius =  borderSettings['_simulatorSlider'+corners[c]].customSlider("value");
                            if(c > 1){
                                borderRadius = 50 - borderRadius;
                            }
                            cssRules['border'+corners[c]+'Radius'] = borderRadius;
                        }
                    }
                    this.getBorderElement().css(cssRules);
                });
                
                mxBuilder.selection.revalidateSelectionContainer();
                
            },
            setValues: function(values){
                if(values.borderColor){
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.borderColor);
                    this._picker.customColorpicker("value",colorObj);
                }
                if(values.borderWidth){
                    values.borderWidth = parseInt(values.borderWidth.replace("px",""),10);
                    this._widthValue.text(values.borderWidth+" Pixel");
                    this._widthSlider.customSlider("value",values.borderWidth);
                }
                
                var corners = ["TopLeft","TopRight","BottomLeft","BottomRight"];
                for(var c in corners){
                    if(values["border"+corners[c]+"Radius"]){
                        values["border"+corners[c]+"Radius"] = parseInt(values["border"+corners[c]+"Radius"].replace("px",""),10);
                        this.setSimRadius(corners[c], values["border"+corners[c]+"Radius"]);
                        this["_simulatorSlider"+corners[c]].customSlider("value",corners[c].match(/.*Right/)?50-values["border"+corners[c]+"Radius"]:values["border"+corners[c]+"Radius"]);
                    }
                }
            },
            updateInstanceVariables: function(){
                this._widthSlider = this._currentInstance.find(".border-width-slider");
                this._widthValue = this._currentInstance.find(".border-width-value");
                this._simulator = this._currentInstance.find(".border-radius-simulator");
                this._simulatorSliderTopLeft = this._simulator.parent().find(".border-radius-slider-t-l");
                this._simulatorSliderTopRight = this._simulator.parent().find(".border-radius-slider-t-r");
                this._simulatorSliderBottomLeft = this._simulator.parent().find(".border-radius-slider-b-l");
                this._simulatorSliderBottomRight = this._simulator.parent().find(".border-radius-slider-b-r");
                this._radiusValue = this._currentInstance.find(".border-radius-value");
                
                this._picker = this._currentInstance.find(".picker");
            }
        }
    });
    
}(jQuery));