(function($){
    
    $(function(){
        mxBuilder.menuManager.menus.componentSettings._settings.background = {
            _template: mxBuilder.layout.templates.find(".flexly-component-background-settings").remove(),
            _currentInstance: null,
            _picker: null,
            _patterns: null,
            _scaleValue: null,
            _scaleSlider: null,
            _opacityValue: null,
            _opacitySlider: null,
            _samples: null,
            _originalSettings: null,
            _thePanel: null,
            getPanel: function(){
                var backgroundSettings = this;
                
                //creating the panel
                this._thePanel = mxBuilder.layout.utils.getCollapsablePanel();
                this._thePanel.find(".flexly-collapsable-title")
                .text("Background")
                .end();
                
                //cloning the template and updating the object properties
                this._currentInstance = this._template.clone();
                this.updateInstanceVariables();
                
                //initiating the color picker
                this._picker.customColorpicker().on({
                    pickerColorChanged: function pickerColorChanged(event,color){
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            mxBuilder.selection.each(function(){
                                color.a = backgroundSettings._opacitySlider.customSlider("value")/100;
                                this.getBackgroundElement().css({
                                    backgroundColor:color.toString()
                                });
                            });
                        } 
                    }
                });
                
                //building the scale slider
                this._scaleSlider.customSlider({
                    min:10,
                    max:200,
                    step: 10,
                    slide: function slide(event, ui){
                        backgroundSettings._scaleValue.text(ui.value+"px");
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
                this._currentInstance.find(".opacity-slider").customSlider({
                    min: 0,
                    max: 100,
                    value: 100,
                    slide: function slide(event,ui){
                        backgroundSettings._opacityValue.text(ui.value+"%");
                        if(mxBuilder.menuManager.menus.componentSettings.isPreview()){
                            var theColor = backgroundSettings._picker.customColorpicker("value");
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
                this._samples = $();
                for(var i=0;i<11;i++){
                    this._samples = this._samples.add($('<div class="pattern-sample pattern-image pattern-sample-'+(i+1)+'" style="height:60px;background-position-y:-'+(i*60)+'px;"/>')
                        .data("flexly-pattern-index",i)
                        .appendTo(this._patterns));
                }
                
                this._samples.on({
                    click: function click(){
                        var element = $(this);
                        backgroundSettings._patterns.find(".selected").removeClass("selected");
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
                this._patterns.jqueryScrollbar();
                
                //hooking the update to the scrollbars when the panels are being opened
                this._thePanel.on({
                    panelOpen: function(){
                        backgroundSettings._patterns.jqueryScrollbar("update");
                    }
                });
                
                //Read the original selection values and store it
                this._originalSettings = mxBuilder.layout.utils.readSelectionStyles({
                    background: ["backgroundColor",
                    "backgroundImage",
                    "backgroundSize"]
                });
                
                this.setValues(this._originalSettings);
                
                //hooking the save / preview / cancel buttons
                this._thePanel.on({
                    cancel: function cancel(){
                        mxBuilder.selection.each(function(){
                            this.getBackgroundElement().css(backgroundSettings._originalSettings);
                        });
                        mxBuilder.menuManager.closeTab();
                    },
                    previewDisabled: function previewDisabled(){
                        mxBuilder.selection.each(function(){
                            this.getBackgroundElement().css(backgroundSettings._originalSettings);
                        });
                        mxBuilder.menuManager.closeTab();
                    },
                    previewEnabled: function previewEnabled(){
                        backgroundSettings.applyValuesToSelection();
                    },
                    save: function save(){
                        backgroundSettings.applyValuesToSelection();
                        mxBuilder.menuManager.closeTab();
                    }
                })
                
                //appending the cloned template to the panel
                this._thePanel.find(".flexly-collapsable-content")
                .append(this._currentInstance);
                
                return this._thePanel;
            },
            setValues: function(values){
                if(values.backgroundColor){
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.backgroundColor);
                    
                    //setting the color picker
                    this._picker.customColorpicker("value",colorObj);
                    
                    //setting the opacity slider
                    var opacity = Math.round(colorObj.a*100);
                    this._opacitySlider.customSlider("value",opacity);
                    this._opacityValue.text(opacity+"%");
                }
                if(values.backgroundSize){
                    if(values.backgroundSize == "auto" || values.backgroundSize == "100% 100%"){
                        scale = 10;
                    } else {
                        var scale = values.backgroundSize.split(" ")[0].replace("%","");
                        try {
                            scale = parseInt(scale)/10;
                        } catch(e){
                            scale = 10;
                        }
                    }
                    this._scaleSlider.customSlider("value",scale);
                    this._scaleValue.text((scale*10)+"px");
                }
                if(values.backgroundImage){
                    var matches = values.backgroundImage.match(/(\d*)(?=\.png)/im);
                    if(matches){
                        var theSelected = this._samples.filter(".pattern-sample-"+matches[0]).trigger("click");
                        this._patterns.jqueryScrollbar("scrollTo",(matches[0]-1)*theSelected.outerHeight());                     
                    }
                }
            },
            updateInstanceVariables: function() {
                this._opacitySlider = this._currentInstance.find(".opacity-slider");
                this._opacityValue = this._currentInstance.find(".opacity-value");
                this._patterns = this._currentInstance.find(".patterns");
                this._picker = this._currentInstance.find(".picker");
                this._scaleSlider = this._currentInstance.find(".scale-slider");
                this._scaleValue = this._currentInstance.find(".scale-value");
            },
            applyValuesToSelection: function(){
                var backgroundColor = this._picker.customColorpicker("value");
                backgroundColor.a = this._opacitySlider.customSlider("value")/100;
                var pattern = this._patterns.find(".selected").data("flexly-pattern-index");
            }
        }
    });
    
}(jQuery));