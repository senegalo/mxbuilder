(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.flickrBadge = {
            _template: mxBuilder.layout.templates.find(".flickr-badge-settings").remove(),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var flickrBadge = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                thePanel.find(".flexly-collapsable-title").text("Flickr Badge");
                
                var theInstance = this._template.clone();
                
                var controls = {
                    imgSize: theInstance.find(".flickr-badge-imgsize input"),
                    imgSizeSquare: theInstance.find("#flickr-badge-imgsize-s"),
                    imgSizeThumb: theInstance.find("#flickr-badge-imgsize-t"),
                    imgSizeMedium: theInstance.find("#flikr-badge-imgsize-m"),
                    user: theInstance.find("#flickr-badge-username"),
                    display: theInstance.find(".flickr-badge-display input"),
                    displayLatest: theInstance.find("#flickr-badge-display-latest"),
                    displayRandom: theInstance.find("#flickr-badge-display-random"),
                    count: theInstance.find(".flickr-badge-count select")
                };
                
                
                var originalSettings = {};
                var properties = ["count", "display","imgSize","user"];
                
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
                
                controls.imgSize.on({
                    change: function(){
                        if(settingsTab.isPreview()){
                            flickrBadge.applyToSelection(controls);
                        }
                    }
                });
                
                controls.display.on({
                    change: function(){
                        if(settingsTab.isPreview()){
                            flickrBadge.applyToSelection(controls);
                        }
                    }
                });
                
                controls.count.on({
                    change: function(){
                        $(this).find("option.none").remove();
                        if(settingsTab.isPreview()){
                            flickrBadge.applyToSelection(controls);
                        }
                    }
                });
                
                controls.user.on({
                    input: function(){
                        if(settingsTab.isPreview() && $(this).val().match(/\d+@N\d{2}/)!== null){
                            flickrBadge.applyToSelection(controls);
                        }
                    }
                })
                
                thePanel.on({
                    previewEnabled: function(){
                        flickrBadge.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        flickrBadge.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        flickrBadge.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        flickrBadge.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values){            
                if(values.count !== false){
                    controls.count.find('option[value="'+values.count+'"]').attr("selected","selected");
                } else {
                    controls.count.append('<option class="none">----------</option>');
                }
                
                if(values.user !== false){
                    controls.user.val(values.user);
                } else {
                    controls.user.val('');
                }
                
                
                if(values.display !== false){
                    controls.display.filter('[value="'+values.display+'"]').attr("checked","checked");
                } else {
                    controls.display.removeAttr("checked");
                }
                
                if(values.imgSize !== false){
                    controls.imgSize.filter('[value="'+values.imgSize+'"]').attr("checked","checked");
                } else {
                    controls.imgSize.removeAttr("checked");
                }
                
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    values = {
                        count: controls.count.val(),
                        user: controls.user.val(),
                        display: controls.display.filter(":checked").val(),
                        imgSize: controls.imgSize.filter(":checked").val()
                    }
                }
                mxBuilder.selection.each(function(){
                    for(var p in values){
                        this[p] = values[p]
                    }
                    this.render();
                });
            }
        }
    });
}(jQuery))