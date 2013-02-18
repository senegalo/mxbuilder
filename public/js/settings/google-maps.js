(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.googleMaps = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".google-maps-settings"),
            buttonOn: mxBuilder.GoogleMapsComponent.prototype.buttonOn,
            buttonOff: mxBuilder.GoogleMapsComponent.prototype.buttonOff,
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var googleMaps = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("New Settings Panel");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    editButton: theInstance.find("#google-maps-edit")
                };
                
                
                //Configure the controls here
                this.applyToSelectionOn(controls, "editButton", "click", function(){
                    if(controls.editButton.hasClass("on")){
                        controls.editButton.removeClass("on").text(googleMaps.buttonOff);
                    } else {
                        controls.editButton.addClass("on").text(googleMaps.buttonOn);
                    }
                });
                
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["editMode"];
                
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
                        googleMaps.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        googleMaps.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        googleMaps.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        googleMaps.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values){    
                if(values.editMode){
                    controls.editButton.addClass("on").text(this.buttonOn);
                } else {
                    controls.editButton.text(this.buttonOff);
                }
                
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                   values = {
                       editMode: controls.editButton.hasClass("on")
                   }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.setEditMode(values.editMode);
                });
            },
            applyToSelectionOn: function applyToSelectionOn(controls,controlKey,event,extra){
                var googleMaps = this;
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                controls[controlKey].on(event,function(){
                    if(settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.call();
                        }
                        googleMaps.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))