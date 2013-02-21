(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.layoutBackground = {
            _template: mxBuilder.layout.templates.find(".flexly-component-layout-background-settings").remove(),
            getPanel: function(layoutPart,expand){
                var backgroundSettings = this;
                
                //creating the panel
                var title;
                
                if(layoutPart == "header"){
                    layoutPart = mxBuilder.layout.layoutHeader;
                    title = "Header";
                } else if(layoutPart == "body"){
                    layoutPart = $(document.body);
                    title = "Body";
                } else {
                    layoutPart = mxBuilder.layout.layoutFooter;
                    title = "Footer";
                }
                
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                thePanel.find(".flexly-collapsable-title")
                .text(title + " Background")
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
                    thePanel: thePanel,
                    layoutPart: layoutPart
                }         
                
                //initiating the color picker
                controls.picker.customColorpicker().on({
                    pickerColorChanged: function pickerColorChanged(event,color){
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            var sliderVal = controls.opacitySlider.customSlider("value");
                            if(sliderVal == 0){
                                sliderVal = 100;
                                controls.opacitySlider.customSlider("value",100);
                                controls.opacityValue.text("100%");
                            }
                            color.a =  sliderVal/100;
                            layoutPart.css({
                                backgroundColor:color.toString()
                            });
                        } 
                    },
                    pickerColorReset: function pickerColorRest(event,color){
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            controls.opacitySlider.customSlider("value",color.a);
                            controls.opacityValue.text("0%")
                            layoutPart.css({
                                backgroundColor:color.toString()
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
                            layoutPart.css({
                                backgroundSize: ui.value+"px"
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
                            layoutPart.css({
                                backgroundColor: theColor.toString()
                            });
                        }
                    }
                });
                
                
                //Read the original selection values and store it
                var originalSettings = {
                    backgroundColor: layoutPart.css("backgroundColor"),
                    backgroundImage: layoutPart.css("backgroundImage"),
                    backgroundSize: layoutPart.css("backgroundSize")
                }; 
                var originalBackgroundImage = layoutPart.children(".flexly-background-image").clone();
                
                //populating the pattern list
                controls.samples = $('<div class="pattern-sample pattern-image-none pattern-sample-0">No Pattern</div>')
                .data("flexly-pattern-index",-1)
                .appendTo(controls.patterns);
                
                for(var i=0;i<11;i++){
                    controls.samples = controls.samples.add($('<div class="pattern-sample pattern-image pattern-sample-'+(i+1)+'" style="background-position-y:-'+(i*60)+'px;"/>')
                        .data("flexly-pattern-index",i)
                        .appendTo(controls.patterns));
                }
                
                controls.samples.on({
                    click: function click(){
                        var element = $(this);
                        mxBuilder.layout.getBackgroundImage(layoutPart).remove();
                        controls.patterns.find(".selected").removeClass("selected");
                        element.addClass("selected");
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            backgroundSettings.applyValuesToSelection(controls);
                        }
                    }
                });
                controls.patterns.jqueryScrollbar();
                
                //hooking the update to the scrollbars when the panels are being opened
                controls.thePanel.on({
                    panelOpen: function(){
                        controls.patterns.jqueryScrollbar("update");
                    }
                });
                
                this.setValues(controls,originalSettings);
                
                //hooking the save / preview / cancel buttons
                controls.thePanel.on({
                    cancel: function cancel(){
                        layoutPart.css(originalSettings);
                        if(mxBuilder.layout.getBackgroundImage(layoutPart).length == 0){
                            layoutPart.append(originalBackgroundImage);
                        }
                        mxBuilder.menuManager.closeTab();
                    },
                    previewDisabled: function previewDisabled(){
                        layoutPart.css(originalSettings);
                        if(mxBuilder.layout.getBackgroundImage(layoutPart).length == 0){
                            layoutPart.append(originalBackgroundImage);
                        }
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
                controls.thePanel.find(".flexly-collapsable-content")
                .append(currentInstance);
                
                //if we fetch the panel expanded.. we trigger the panelOpen event...
                
                if(expand){
                    controls.thePanel.trigger("panelOpen");
                }
                
                return controls.thePanel;
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
                        scale = 60;
                    } else {
                        var scale = values.backgroundSize.split(" ")[0].replace("%","");
                        try {
                            scale = parseInt(scale);
                        } catch(e){
                            scale = 60;
                        }
                    }
                    controls.scaleSlider.customSlider("value",scale);
                    controls.scaleValue.text((scale)+"px");
                }
                if(values.backgroundImage){
                    var matches = values.backgroundImage.match(/(\d*)(?=\.png)/im);
                    var filter;
                    var scrollToIndex;
                    if(matches){
                        filter = ".pattern-sample-"+matches[0];               
                        scrollToIndex = matches[0];
                    } else {
                        filter = ".pattern-image-none";
                        scrollToIndex = 0;
                    }
                    controls.thePanel.on({
                        panelOpen: function(){
                            var theSelected = controls.samples.filter(filter).addClass("selected");
                            controls.patterns.jqueryScrollbar("scrollTo",scrollToIndex*theSelected.outerHeight(),false);
                        }
                    });  
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
                if(pattern.length > 0 && pattern.data("flexly-pattern-index") != -1){
                    cssRules.backgroundImage = 'url("public/images/patterns/pat'+(pattern.data("flexly-pattern-index")+1)+'.png")';
                } else {
                    cssRules.backgroundImage = "none";
                }
                
                //Applying the size
                cssRules.backgroundSize = controls.scaleSlider.customSlider("value");
                
                controls.layoutPart.css(cssRules); 
            }
        }
    });
    
}(jQuery));