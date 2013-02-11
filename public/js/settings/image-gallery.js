(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.imageGallery = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".image-gallery-settings").remove(),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var imageGallery = this;
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
                        imageGallery.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        imageGallery.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        imageGallery.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        imageGallery.applyToSelection(controls,originalSettings);
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
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    values = {
                        autoPlay: controls.autoPlay.filter(":checked").val() == "on" ? true : false,
                        transitionSpeed: controls.transitionSpeed.filter(":checked").val(),
                        indicator: controls.indicator.filter(":checked").val() == "on" ? true : false,
                        action: controls.action.filter(":checked").val() == "on" ? true : false,
                        navigation: controls.navigation.filter(":checked").val()
                    }
                   
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.setSettings(values);
                    this.revalidate();
                });
            },
            applyToSelectionOn: function applyToSelectionOn(controls,controlKey,event,extra){
                var imageGallery = this;
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                controls[controlKey].on(event,function(){
                    if(settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.call();
                        }
                        imageGallery.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))