(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.gplusButton = {
            _template: mxBuilder.layout.templates.find(".flexly-gplus-button-settings"),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var fbButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                thePanel.find(".flexly-collapsable-title").text("Google Plus Button");
                
                var theInstance = this._template.clone();
                
                var controls = {
                    sizeSelect: theInstance.find('#gplus-size'),
                    annotation: theInstance.find(".gplus-annotation input"),
                    annotationNone: theInstance.find("#gplus-annotation-none"),
                    annotationHr: theInstance.find("#gplus-annotation-hr"),
                    annotationVr: theInstance.find("#gplus-annotation-vr")
                }
                
                controls.sizeSelect.on({
                    change: function change(){
                        var theVal = $(this).find("option:selected").val();
                        if(settingsTab.isPreview()){
                            mxBuilder.selection.each(function(){
                                this.setSize(theVal);
                            });
                        }
                    }
                });
                
                controls.annotation.on({
                    change: function change(){
                        var theVal = $(this).filter(":checked").val();
                        if(theVal == "vertical"){
                            controls.sizeSelect.find('option[value="standard"]').attr("selected","selected");
                        }
                        if(settingsTab.isPreview()){
                            mxBuilder.selection.each(function(){
                                this.setCounterPosition(theVal);
                            });
                        }
                    }
                });
                
                var originalSettings = {};
                
                var properties = ["size","counterPosition"];
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    for(var p in properties){
                        console.log(this["get"+properties[p].uppercaseFirst()]);
                        if(firstPass){
                            originalSettings[properties[p]] = this["get"+properties[p].uppercaseFirst()]();
                        }
                        var data = this["get"+properties[p].uppercaseFirst()]();
                        if (originalSettings[properties[p]] !== data){
                            originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });
                
                this.setValues(controls,originalSettings);
                
                thePanel.on({
                    previewEnabled: function(){
                        fbButton.applyToSelection(controls);
                    },
                    save: function(){
                        fbButton.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                    },
                    previewDisabled: function(){
                        fbButton.applyToSelection(controls,originalSettings);
                    },
                    cancel: function(){
                        fbButton.applyToSelection(controls,originalSettings);
                        mxBuilder.menuManager.closeTab();
                    }
                });
                
                return thePanel.find(".flexly-collapsable-content").append(theInstance).end();
            },
            setValues: function(controls,settings){
                if(settings.counterPosition !== false){
                    controls.annotation.filter('[value="'+settings.counterPosition+'"]').attr("checked","checked");
                } else {
                    controls.annotation.removeAttr("checked");
                }
                if(settings.size !== false){
                    if(settings.counterPosition == "vertical"){
                        settings.size = "standard";
                    }
                    controls.sizeSelect.find('[value="'+settings.size+'"]').attr("selected","selected");
                } else {
                    controls.sizeSelect.removeAttr("checked");
                }
            },
             applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    values  = {
                        counterPosition: controls.annotation.filter(":checked").val(),
                        size: controls.size.filter(":checked").val()
                    };
                }
                mxBuilder.selection.each(function(){
                    this.setCounterPosition(values.counterPosition);
                    this.setSize(values.size);
                });
            }
        }
    });
    
}(jQuery));