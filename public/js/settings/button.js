(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.button = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".button-settings").remove(),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var button = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Button Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    label: theInstance.find("#button-label")
                };
                
                //Configure the controls here
                controls.label.on({
                    input: function input(){
                        if(settingsTab.isPreview()){
                            var label = $(this).val();
                            mxBuilder.selection.each(function(){
                                this.setLabel(label);
                            });
                        }
                    }
                });
                
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["label"];
                
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
                        button.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        button.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        button.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        button.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values){    
                //implement the setValue function
                if(values.label !== false){
                    controls.label.val(values.label);
                } else {
                    controls.label.val('');
                }
                
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                   values = {
                       label: controls.label.val()
                   }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                        this.setLabel(values.label);
                });
            }
        }
    });
}(jQuery))