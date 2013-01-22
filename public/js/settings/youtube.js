(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.youtube = {
            _template: mxBuilder.layout.templates.find(".youtube-settings").remove(),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var youtube = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                thePanel.find(".flexly-collapsable-title").text("Youtube Video Settings");
                
                var theInstance = this._template.clone();
                
                var controls = {
                    videoID: theInstance.find("#youtube-video-id"),
                    autoplay: theInstance.find("#youtube-video-autoplay")
                };
                
                controls.autoplay.checkbox().on({
                    change: function change(){
                        if(settingsTab.isPreview()){
                            var element = $(this);
                            mxBuilder.selection.each(function(){
                                this.autoplay = element.is(":checked");
                                this.rebuild();
                            });
                        }
                    }
                });
                
                controls.videoID.on({
                    input: function input(){
                        var element = $(this);
                        if(settingsTab.isPreview() && element.val().match(/[a-zA-Z0-9_-]{11}/) !== null){
                            mxBuilder.selection.each(function(){
                                this.videoID = element.val();
                                this.rebuild();
                            });
                        }
                    }
                });
                
                var originalSettings = {};
                
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
                        youtube.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        youtube.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values){            
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
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                   values = {
                       videoID: controls.videoID.val(),
                       autoplay: controls.autoplay.is(":checked")
                   }
                }
                mxBuilder.selection.each(function(){
                    for(var p in values){
                        this[p] = values[p]; 
                    }
                    this.rebuild();
                });
            }
        }
    });
}(jQuery))