(function($){    
    $(function(){
        mxBuilder.layout.globalSettingsPanels.snap = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".snap-global-settings").remove(),
            getPanel: function(expand){
                var snap = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Grid Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    snapObjects: theInstance.find("#snap-objects")
                };
                
                
                //Configure the controls here
                this.applySettingsOn(controls, "snapObjects", "change");
                
                this.setValues(controls);
                
                thePanel.on({
                    save: function(){
                        snap.applySettings(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls){    
                if(mxBuilder.settingsManager.getSetting("snap", "objects")){
                    controls.snapObjects.attr("checked","checked");
                } else {
                    controls.snapObjects.removeAttr("checked")
                }
            },
            applySettings: function applySettings(controls,values){
                if(typeof values == "undefined"){
                    values = {
                        snapObjects: controls.snapObjects.is(":checked")
                    }
                }
                
                mxBuilder.settingsManager.setObjectSnap(values.snapObjects);            
            },
            applySettingsOn: function applySettingsOn(controls,controlKey,event,extra){
                var snap = this;
                controls[controlKey].on(event,function(){
                    if(typeof extra != "undefined"){
                        extra.call();
                    }
                    snap.applySettings(controls);
                });
            }
        }    
    });
}(jQuery))