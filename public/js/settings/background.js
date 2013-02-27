(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.background = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-component-background-settings").remove(),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var background = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Background Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    opacitySlider: theInstance.find(".opacity-slider"),
                    opacityValue: theInstance.find(".opacity-value"),
                    patterns: theInstance.find(".patterns"),
                    picker: theInstance.find(".picker"),
                    scaleSlider: theInstance.find(".scale-slider"),
                    scaleValue: theInstance.find(".scale-value"),
                    thePanel: thePanel
                };
                
                
                //Configure the controls here
                controls.picker.customColorpicker();
                controls.scaleSlider.customSlider({
                    min:10,
                    max:200,
                    step: 10
                });
                controls.opacitySlider.customSlider({
                    min: 0,
                    max: 100,
                    value: 100
                });
                
                controls.samples = $('<div class="pattern-sample pattern-image-none pattern-sample-0">No Pattern</div>')
                .data("flexly-pattern-index",-1)
                .appendTo(controls.patterns);
                for(var i=0;i<11;i++){
                    controls.samples = controls.samples.add($('<div class="pattern-sample pattern-image pattern-sample-'+(i+1)+'" style="background-position-y:-'+(i*60)+'px;"/>')
                        .data("flexly-pattern-index",i)
                        .appendTo(controls.patterns));
                }
                controls.patterns.jqueryScrollbar();
                thePanel.on({
                    panelOpen: function(){
                        controls.patterns.jqueryScrollbar("update");
                    }
                });
                if(expand){
                    thePanel.trigger("panelOpen");
                }
                
                this.applyToSelectionOn(controls, "picker", "pickerColorChanged", function(event,color){
                    var sliderVal = controls.opacitySlider.customSlider("value");
                    if(sliderVal == 0){
                        sliderVal = 100;
                        controls.opacitySlider.customSlider("value",100);
                        controls.opacityValue.text("100%");
                    }
                });
                this.applyToSelectionOn(controls, "picker", "pickerColorRest", function(){
                    controls.opacitySlider.customSlider("value",0);
                    controls.opacityValue.text("0%");
                });
                this.applyToSelectionOn(controls, "scaleSlider", "slide", function(event,ui){
                    controls.scaleValue.text(ui.value+"px");                    
                });
                this.applyToSelectionOn(controls, "opacitySlider", "slide", function(event,ui){
                    controls.opacityValue.text(ui.value+"%");                    
                });
                this.applyToSelectionOn(controls, "samples", "click", function(){
                    var element = $(this);
                    controls.patterns.data("change-monitor",true).find(".selected").removeClass("selected");
                    element.addClass("selected");
                });
                
                
                this.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["backgroundColor",
                "backgroundImage",
                "backgroundSize"];
                
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theSettings = this.getBackground();
                    for(var p in properties){
                        if(firstPass){
                            originalSettings[properties[p]] = theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data){
                            originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });
                
                this.setValues(controls,originalSettings);
                
                thePanel.on({
                    previewEnabled: function(){
                        background.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        background.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values){
                //implement the setValue function
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
                    var match = matches === null ? "0" : matches[0];
                    
                    controls.samples.filter(".pattern-sample-"+match).trigger("click");
                    
                    controls.thePanel.on({
                        panelOpen: function(){
                            var theSelected = controls.samples.filter(".pattern-sample-"+match).trigger("click");
                            controls.patterns.jqueryScrollbar("scrollTo",match*theSelected.outerHeight(),false);
                        }
                    });                        
                }
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    
                    //Applying the background color
                    if(controls.picker.data("change-monitor") || controls.opacitySlider.data("change-monitor")){
                        var backgroundColor = controls.picker.customColorpicker("value");
                        backgroundColor.a = controls.opacitySlider.customSlider("value")/100;
                        values.backgroundColor = backgroundColor.toString();
                    }
                
                    //Applying the pattern
                    if(controls.patterns.data("change-monitor")){
                        var pattern = controls.patterns.find(".selected");//.data("flexly-pattern-index");
                        if(pattern.length > 0 && pattern.data("flexly-pattern-index") != -1){
                            values.backgroundImage = 'url("public/images/patterns/pat'+(pattern.data("flexly-pattern-index")+1)+'.png")';
                        } else {
                            values.backgroundImage = "none";
                        }
                    }
                
                    //Applying the size
                    if(controls.scaleSlider.data("change-monitor")){
                        values.backgroundSize = controls.scaleSlider.customSlider("value");
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.setBackground(values); 
                });
            },
            applyToSelectionOn: function applyToSelectionOn(controls,controlKey,event,extra){
                var background = this;
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                controls[controlKey].on(event,function(){
                    controls[controlKey].data("change-monitor",true);
                    if(settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        background.applyToSelection(controls);
                    }
                });
            },
            monitorChangeOnControls: function(controls){
                for(var c in controls){
                    controls[c].data("change-monitor",false);
                }
            }
        }
    });
}(jQuery))