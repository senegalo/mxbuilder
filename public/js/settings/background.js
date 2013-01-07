(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.background = {
            _template: mxBuilder.layout.templates.find(".flexly-component-background-settings").remove(),
            getPanel: function(expand){
                var backgroundSettings = this;
                
                //creating the panel
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                thePanel.find(".flexly-collapsable-title")
                .text("Background")
                .end();
                
                //cloning the template and updating the object properties
                var currentInstance = this._template.clone();
                
                var controls = {
                    opacitySlider: currentInstance.find(".opacity-slider"),
                    opacityValue: currentInstance.find(".opacity-value"),
                    patterns: currentInstance.find(".patterns"),
                    picker: currentInstance.find(".picker"),
                    scaleSlider: currentInstance.find(".scale-slider"),
                    scaleValue: currentInstance.find(".scale-value"),
                    thePanel: thePanel
                }         
                
                //initiating the color picker
                controls.picker.customColorpicker().on({
                    pickerColorChanged: function pickerColorChanged(event,color){
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            mxBuilder.selection.each(function(){
                                color.a =  controls.opacitySlider.customSlider("value")/100;
                                this.getBackgroundElement().css({
                                    backgroundColor:color.toString()
                                });
                            });
                        } 
                    }
                });
                
                //building the scale slider
                controls.scaleSlider.customSlider({
                    min:10,
                    max:200,
                    step: 10,
                    slide: function slide(event, ui){
                        controls.scaleValue.text(ui.value+"px");
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            mxBuilder.selection.each(function(){
                                this.getBackgroundElement().css({
                                    backgroundSize: ui.value+"px"
                                });
                            });
                        }
                    }
                });
                
                //building the opacity slider
                controls.opacitySlider.customSlider({
                    min: 0,
                    max: 100,
                    value: 100,
                    slide: function slide(event,ui){
                        controls.opacityValue.text(ui.value+"%");
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            var theColor =  controls.picker.customColorpicker("value");
                            theColor.a = ui.value/100;
                            mxBuilder.selection.each(function(){
                                this.getBackgroundElement().css({
                                    backgroundColor: theColor.toString()
                                });
                            });
                        }
                    }
                });
                
                //populating the pattern list
                controls.samples = $();
                for(var i=0;i<11;i++){
                    controls.samples = controls.samples.add($('<div class="pattern-sample pattern-image pattern-sample-'+(i+1)+'" style="background-position-y:-'+(i*60)+'px;"/>')
                        .data("flexly-pattern-index",i)
                        .appendTo(controls.patterns));
                }
                
                controls.samples.on({
                    click: function click(){
                        var element = $(this);
                        controls.patterns.find(".selected").removeClass("selected");
                        element.addClass("selected");
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            mxBuilder.selection.each(function(){
                                this.getBackgroundElement().css({
                                    backgroundImage: 'url("public/images/patterns/pat'+(element.data("flexly-pattern-index")+1)+'.png")',
                                    backgroundRepeat: 'repeat'
                                });
                            });
                        }
                    }
                })
                controls.patterns.jqueryScrollbar();
                
                //hooking the update to the scrollbars when the panels are being opened
                thePanel.on({
                    panelOpen: function(){
                        controls.patterns.jqueryScrollbar("update");
                    }
                });
                
                //Read the original selection values and store it
                var originalSettings = mxBuilder.layout.utils.readSelectionStyles({
                    background: ["backgroundColor",
                    "backgroundImage",
                    "backgroundSize"]
                });
                
                this.setValues(controls,originalSettings);
                
                //hooking the save / preview / cancel buttons
                thePanel.on({
                    cancel: function cancel(){
                        mxBuilder.selection.each(function(){
                            this.getBackgroundElement().css(originalSettings);
                        });
                        mxBuilder.menuManager.closeTab();
                    },
                    previewDisabled: function previewDisabled(){
                        mxBuilder.selection.each(function(){
                            this.getBackgroundElement().css(originalSettings);
                        });
                        mxBuilder.menuManager.closeTab();
                    },
                    previewEnabled: function previewEnabled(){
                        backgroundSettings.applyValuesToSelection(controls);
                    },
                    save: function save(){
                        backgroundSettings.applyValuesToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                    }
                })
                
                //appending the cloned template to the panel
                thePanel.find(".flexly-collapsable-content")
                .append(currentInstance);
                
                //if we fetch the panel expanded.. we trigger the panelOpen event...
                
                if(expand){
                    thePanel.trigger("panelOpen");
                }
                
                return thePanel;
            },
            setValues: function(controls,values){
                if(values.backgroundColor){
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.backgroundColor);
                    
                    //setting the color picker
                    controls.picker.customColorpicker("value",colorObj);
                    
                    //setting the opacity slider
                    var opacity = Math.round(colorObj.a*100);
                    controls.opacitySlider.customSlider("value",opacity);
                    controls.opacityValue.text(opacity+"%");
                }
                if(values.backgroundSize){
                    if(values.backgroundSize == "auto" || values.backgroundSize == "100% 100%"){
                        scale = 10;
                    } else {
                        var scale = values.backgroundSize.split(" ")[0].replace("%","");
                        try {
                            scale = parseInt(scale);
                        } catch(e){
                            scale = 10;
                        }
                    }
                    controls.scaleSlider.customSlider("value",scale);
                    controls.scaleValue.text((scale)+"px");
                }
                if(values.backgroundImage){
                    var matches = values.backgroundImage.match(/(\d*)(?=\.png)/im);
                    if(matches){
                        controls.thePanel.on({
                            panelOpen: function(){
                                var theSelected = controls.samples.filter(".pattern-sample-"+matches[0]).trigger("click");
                                controls.patterns.jqueryScrollbar("scrollTo",(matches[0]-1)*theSelected.outerHeight(),false);
                            }
                        });                        
                    }
                }
            },
            applyValuesToSelection: function(controls){
                var cssRules = {};
                
                //Applying the background color
                var backgroundColor = controls.picker.customColorpicker("value");
                backgroundColor.a = controls.opacitySlider.customSlider("value")/100;
                cssRules.backgroundColor = backgroundColor.toString();
                
                //Applying the pattern
                var pattern = controls.patterns.find(".selected");//.data("flexly-pattern-index");
                if(pattern.length > 0){
                    cssRules.backgroundImage = 'url("public/images/patterns/pat'+(pattern.data("flexly-pattern-index")+1)+'.png")';
                } else {
                    cssRules.backgroundImage = "none";
                }
                
                //Applying the size
                cssRules.backgroundSize = controls.scaleSlider.customSlider("value");
                
                mxBuilder.selection.each(function(){
                    this.element.css(cssRules); 
                });
            }
        }
    });
    
}(jQuery));