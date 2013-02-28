(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.imageGrid = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".image-grid-settings").remove(),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var imageGrid = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Grid Gallery Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    columns: theInstance.find("#image-grid-columns"),
                    spacing: theInstance.find("#image-grid-spacing")
                };
                
                
                //Configure the controls here
                this.applyToSelectionOn(controls, "columns", "input");
                this.applyToSelectionOn(controls, "spacing", "input");
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["spacing","cols"];
                
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
                        imageGrid.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        imageGrid.applyToSelection(controls);
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
                if(values.cols !== false){
                    controls.columns.val(values.cols);
                } else {
                    controls.columns.val('');
                }
                
                if(values.spacing !== false){
                    controls.spacing.val(values.spacing);
                } else {
                    controls.spacing.val('');
                }
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    if(this._settingsTab.hasChanged(controls.columns)){
                        //fill up the values array
                        values.cols = controls.columns.val();
                    }
                    if(this._settingsTab.hasChanged(controls.spacing)){
                        values.spacing = controls.spacing.val();
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.setSpacing(values.spacing);
                    this.setColumns(values.cols);
                    this.rebuild();
                    this.revalidate();
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var imageGrid = this;
                controls[controlKey].on(event,function(){
                    imageGrid._settingsTab.setChanged(controls[controlKey]);
                    if(imageGrid._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        imageGrid.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))