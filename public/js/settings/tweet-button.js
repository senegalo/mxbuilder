(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.tweetButton = {
            _template: mxBuilder.layout.templates.find(".flexly-tweet-button-settings"),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var tweetButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                thePanel.find(".flexly-collapsable-title").text("Tweet Button");
                
                var theInstance = this._template.clone();
                
                var controls = {
                    countPositionHorizontal: theInstance.find("#twitter-count-position-hr"),
                    countPositionNone: theInstance.find("#twitter-count-position-none"),
                    countPositionVertical: theInstance.find("#twitter-count-position-vr"),
                    countPosition: theInstance.find('.tweet-counter-position input[name="twitter-count-position"]'),
                    tweetText: theInstance.find(".tweet-text"),
                    urlCustom: theInstance.find("#twitter-url-custom"),
                    urlNone: theInstance.find("#twitter-url-none"),
                    url: theInstance.find('.tweet-url input[name="twitter-url"]'),
                    urlText: theInstance.find(".tweet-button-url")
                }
                
                var originalSettings = {};
                var properties = ["text","count","url"];
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theSettings = this.getSettings();
                    for(var p in properties){
                        if(firstPass){
                            originalSettings[properties[p]] =theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data){
                            originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });
                
                this.setValues(controls,originalSettings);
                
                controls.countPosition.on({
                    click: function click(){
                        if(settingsTab.isPreview()){
                            var chosenPosition = $(this).filter(":checked").val();
                            mxBuilder.selection.each(function(){
                                this.setCounterPosition(chosenPosition);
                                mxBuilder.selection.revalidateSelectionContainer();
                            });
                        }
                    }
                });
                
                controls.urlText.on({
                    focus: function(){
                        controls.urlCustom.attr("checked","checked");
                    }
                })
                
                thePanel.on({
                    previewEnabled: function(){
                        tweetButton.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        tweetButton.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        tweetButton.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        tweetButton.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel
            },
            setValues: function(controls, values){
                if(values.text !== false){
                    controls.tweetText.val(values.text);
                } else {
                    controls.tweetText.val('');
                }
                
                controls.countPosition.removeAttr("checked");
                if(values.count !== false){
                    controls['countPosition'+values.count.uppercaseFirst()].attr("checked","checked");
                }
                
                controls.url.removeAttr("checked");
                if(values.url !== false){
                    if(typeof values.url == "undefined" || values.url == "none"){
                        controls.urlNone.attr("checked","checked");
                        controls.urlText.val("");
                    } else {
                        controls.urlCustom.attr("checked","checked");
                        controls.urlText.val(values.url);
                    }
                }                
                
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    values  = {
                        text: controls.tweetText.val()
                    };
                    
                    var theCheckedCount = controls.countPosition.filter(":checked");
                    if(theCheckedCount.length > 0){
                        values.count = theCheckedCount.filter(":checked").val();
                    }
                    
                    var theCheckedUrl = controls.url.filter(":checked");
                    if(theCheckedUrl.length > 0){
                        values.url = controls.urlNone.is(":checked") ? "none" : this._urlText.val();
                    }
                }
                mxBuilder.selection.each(function(){
                    for(var p in values){
                        if(values[p] === false){
                            continue;
                        } 
                        this[p] = values[p];
                    }
                    this.rebuild();
                });
            }
        }
    });
    
}(jQuery));