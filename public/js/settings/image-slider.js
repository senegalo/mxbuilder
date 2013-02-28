(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.imageSlider = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".image-gallery-settings").remove(),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var imageSlider = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Gallery Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    autoPlay: theInstance.find(".gallery-autoplay input"),
                    transitionSpeed: theInstance.find(".gallery-transition input"),
                    indicator: theInstance.find(".gallery-timer-indicator input"),
                    action: theInstance.find(".gallery-action input"),
                    navigation: theInstance.find(".gallery-navigation input")
                };
                
                
                //Configure the controls here
                for(var c in controls){
                    this.applyToSelectionOn(controls, c, "change");
                }
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["autoPlay","transitionSpeed","indicator","action","navigation"];
                
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theSettings = this.getSettings();
                    for(var p in properties){
                        if(firstPass){
                            originalSettings[properties[p]] = theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data){
                            originalSettings[properties[p]] = null;
                        }
                    }
                    firstPass = false;
                });
                
                this.setValues(controls,originalSettings);
                
                thePanel.on({
                    previewEnabled: function(){
                        imageSlider.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        imageSlider.applyToSelection(controls);
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
                if(values.autoPlay !== null){
                    controls.autoPlay.filter('[value="'+(values.autoPlay?"on":"off")+'"]').attr("checked","checked");
                } else {
                    controls.autoPlay.removeAttr("checked");
                }
                
                if(values.transitionSpeed !== null){
                    controls.transitionSpeed.filter('[value="'+values.transitionSpeed+'"]').attr("checked","checked");
                } else {
                    controls.transitionSpeed.removeAttr("checked");
                }
                
                if(values.indicator !== null){
                    controls.indicator.filter('[value="'+(values.indicator?"on":"off")+'"]').attr("checked","checked");
                } else {
                    controls.indicator.removeAttr("checked");
                }
                
                if(values.action !== null){
                    controls.action.filter('[value="'+(values.action?"on":"off")+'"]').attr("checked","checked");
                } else {
                    controls.action.removeAttr("checked");
                }
                
                if(values.navigation !== null){
                    controls.navigation.filter('[value="'+values.navigation+'"]').attr("checked","checked");
                } else {
                    controls.navigation.removeAttr("checked");
                }     
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    if(this._settingsTab.hasChanged(controls.autoPlay)){
                        values.autoPlay = controls.autoPlay.filter(":checked").val() == "on" ? true : false;
                    }
                    if(this._settingsTab.hasChanged(controls.transitionSpeed)){
                        values.transitionSpeed = controls.transitionSpeed.filter(":checked").val();
                    }
                    if(this._settingsTab.hasChanged(controls.indicator)){
                        values.indicator = controls.indicator.filter(":checked").val() == "on" ? true : false;
                    }
                    if(this._settingsTab.hasChanged(controls.action)){
                        values.action = controls.action.filter(":checked").val() == "on" ? true : false;
                    }
                    if(this._settingsTab.hasChanged(controls.navigation)){
                        values.navigation = controls.navigation.filter(":checked").val();
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.setSettings(values);
                    this.revalidate();
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var imageSlider = this;
                controls[controlKey].on(event,function(){
                    imageSlider._settingsTab.setChanged(controls[controlKey]);
                    if(imageSlider._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        imageSlider.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))