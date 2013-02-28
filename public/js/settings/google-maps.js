(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.googleMaps = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".google-maps-settings"),
            buttonOn: mxBuilder.GoogleMapsComponent.prototype.buttonOn,
            buttonOff: mxBuilder.GoogleMapsComponent.prototype.buttonOff,
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var googleMaps = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Map Settings");
                
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
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                if(mxBuilder.selection.getSelectionCount() > 1){
                    thePanel.find(".flexly-collapsable-header").trigger("click");
                    thePanel.addClass("flexly-collapsable-disabled");
                } else {
                    originalSettings = mxBuilder.components.getComponent(mxBuilder.selection.getSelection()).getSettings();
                }
                
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
                if(values.editMode){
                    controls.editButton.addClass("on").text(this.buttonOn);
                } else {
                    controls.editButton.text(this.buttonOff);
                }
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    if(this._settingsTab.hasChanged(controls.editButton)){
                        //fill up the values array
                        values.editMode = controls.editButton.hasClass("on");
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.setEditMode(values.editMode);
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var googleMaps = this;
                controls[controlKey].on(event,function(){
                    googleMaps._settingsTab.setChanged(controls[controlKey]);
                    if(googleMaps._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        googleMaps.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))