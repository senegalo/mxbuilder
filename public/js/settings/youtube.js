(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.youtube = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".youtube-settings").remove(),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var youtube = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Youtube Video Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    videoID: theInstance.find("#youtube-video-id"),
                    autoplay: theInstance.find("#youtube-video-autoplay")
                };
                
                this.applyToSelectionOn(controls, "autoplay", "change");
                this.applyToSelectionOn(controls, "videoID", "input");
                
                
                //Configure the controls here
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["videoID","autoplay"];
                
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
                        youtube.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        youtube.applyToSelection(controls);
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
                if(values.videoID !== false){
                    controls.videoID.val(values.videoID);
                } else {
                    controls.videoID.val('');
                }
                
                if(values.autoplay !== false){
                    controls.autoplay.attr("checked","checked");
                } else {
                    controls.autoplay.removeAttr("checked");
                }
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    if(this._settingsTab.hasChanged(controls.videoID)){
                        //fill up the values array
                        values.videoID = controls.videoID.val();
                    }
                    if(this._settingsTab.hasChanged(controls.autoplay)){
                        values.autoplay = controls.autoplay;
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                     for(var p in values){
                        this[p] = values[p]; 
                    }
                    this.rebuild();
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var youtube = this;
                controls[controlKey].on(event,function(){
                    youtube._settingsTab.setChanged(controls[controlKey]);
                    if(youtube._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        youtube.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))