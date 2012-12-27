(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.tweetButton = {
            _template: mxBuilder.layout.templates.find(".flexly-tweet-button-settings"),
            _theInstance: null,
            _tweetText: null,
            _countPositionNone: null,
            _countPositionHorizontal: null,
            _countPositionVertical: null,
            _countPosition: null,
            _urlNone: null,
            _urlCustom: null,
            _urlText: null,
            _url: null,
            _originalSettings: null,
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var tweetButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                thePanel.find(".flexly-collapsable-title").text("Tweet Button");
                
                this._theInstance = this._template.clone();
                
                this.revalidateInstanceVariable();
                
                this._originalSettings = {};
                var properties = ["text","count","url"];
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theSettings = this.getSettings();
                    for(var p in properties){
                        if(firstPass){
                            tweetButton._originalSettings[properties[p]] =theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (tweetButton._originalSettings[properties[p]] !== data){
                            tweetButton._originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });
                
                this.setValues(this._originalSettings);
                
                this._countPosition.on({
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
                
                this._urlText.on({
                    focus: function(){
                        tweetButton._urlCustom.attr("checked","checked");
                    }
                })
                
                thePanel.on({
                    previewEnabled: function(){
                        tweetButton.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        tweetButton.applyToSelection();
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        tweetButton.applyToSelection(tweetButton._originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        tweetButton.applyToSelection(tweetButton._originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                })                
                
                thePanel.find(".flexly-collapsable-content").append(this._theInstance);
                return thePanel
            },
            revalidateInstanceVariable: function(){
                this._countPositionHorizontal = this._theInstance.find("#twitter-count-position-hr");
                this._countPositionNone = this._theInstance.find("#twitter-count-position-none");
                this._countPositionVertical = this._theInstance.find("#twitter-count-position-vr");
                this._countPosition = this._theInstance.find('.tweet-counter-position input[name="twitter-count-position"]');
                this._tweetText = this._theInstance.find(".tweet-text");
                this._urlCustom = this._theInstance.find("#twitter-url-custom");
                this._urlNone = this._theInstance.find("#twitter-url-none");
                this._url = this._theInstance.find('.tweet-url input[name="twitter-url"]');
                this._urlText = this._theInstance.find(".tweet-button-url");
            },
            setValues: function(values){
                if(values.text !== false){
                    this._tweetText.val(values.text);
                } else {
                    this._tweetText.val('');
                }
                
                this._countPosition.removeAttr("checked");
                if(values.count !== false){
                    this['_countPosition'+values.count.uppercaseFirst()].attr("checked","checked");
                }
                
                this._url.removeAttr("checked");
                if(values.url !== false){
                    if(typeof values.url == "undefined" || values.url == "none"){
                        this._urlNone.attr("checked","checked");
                        this._urlText.val("");
                    } else {
                        this._urlCustom.attr("checked","checked");
                        this._urlText.val(values.url);
                    }
                }                
                
            },
            applyToSelection: function applyToSelection(values){
                if(typeof values === "undefined"){
                    values  = {
                        text: this._tweetText.val()
                    };
                    
                    var theCheckedCount = this._countPosition.filter(":checked");
                    if(theCheckedCount.length > 0){
                        values.count = theCheckedCount.filter(":checked").val();
                    }
                    
                    var theCheckedUrl = this._url.filter(":checked");
                    if(theCheckedUrl.length > 0){
                        values.url = this._urlNone.is(":checked") ? "none" : this._urlText.val();
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