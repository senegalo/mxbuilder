(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.imageGrid = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".image-grid-settings").remove(),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
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
                        imageGrid.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        imageGrid.applyToSelection(controls,originalSettings);
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
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                   values = {
                       cols: controls.columns.val(),
                       spacing: controls.spacing.val()
                   }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.setSettings(values);
                    this.rebuild();
                    this.revalidate();
                });
            },
            applyToSelectionOn: function applyToSelectionOn(controls,controlKey,event,extra){
                var imageGrid = this;
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                controls[controlKey].on(event,function(){
                    if(settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.call();
                        }
                        imageGrid.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))