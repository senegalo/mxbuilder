(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.color = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".color-settings").remove(),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var color = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Color");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    colorPicker: theInstance.find(".picker")
                };
                
                
                //Configure the controls here
                controls.colorPicker.customColorpicker();
                this.applyToSelectionOn(controls, "colorPicker", "pickerColorChanged");
                this.applyToSelectionOn(controls, "colorPicker", "pickerColorRest");
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["color"];
                
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theSettings = this.getSettings();
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
                        color.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        color.applyToSelection(controls);
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
                if(values.color){
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.color);
                    controls.colorPicker.customColorpicker("value",colorObj);
                }
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    if(this._settingsTab.hasChanged(controls.colorPicker)){
                        //fill up the values array
                        values.color = controls.colorPicker.customColorpicker("value").toString();
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    if(typeof values.color != "undefined"){
                        this.setColor(values.color);
                    }
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var color = this;
                controls[controlKey].on(event,function(){
                    color._settingsTab.setChanged(controls[controlKey]);
                    if(color._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        color.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))