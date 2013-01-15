(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.fbButton = {
            _template: mxBuilder.layout.templates.find(".flexly-fb-button-settings"),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var fbButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                thePanel.find(".flexly-collapsable-title").text("Facebook Button");
                
                var theInstance = this._template.clone();
                
                var controls = {
                    counterPosition: theInstance.find('.fb-counter-position input'),
                    counterPositionHr: theInstance.find('#fb-count-position-hr'),
                    counterPositionVr: theInstance.find('#fb-count-position-vr'),
                    action: theInstance.find(".fb-action input"),
                    actionLike: theInstance.find("#fb-action-like"),
                    actionRecommend: theInstance.find("#fb-action-recommend")             
                }
                
                controls.counterPosition.on({
                    change: function(){
                        if(settingsTab.isPreview()){
                            var selectedValue = $(this).val();
                            mxBuilder.selection.each(function(){
                                this.setCounterPosition(selectedValue);
                                this.rebuild();
                            });
                        }
                    }
                });
                
                controls.action.on({
                    change: function(){
                        if(settingsTab.isPreview()){
                            var selectedValue = $(this).val();
                            mxBuilder.selection.each(function(){
                                this.setAction(selectedValue);
                                this.rebuild();
                            });
                        }
                    }
                });
                
                var originalSettings = {};
                
                var properties = ["action","counterPosition"];
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
                
                thePanel.on({
                    previewEnabled: function(){
                        fbButton.applyToSelection(controls);
                    },
                    save: function(){
                        fbButton.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                    },
                    previewDisabled: function(){
                        fbButton.applyToSelection(controls,originalSettings);
                    },
                    cancel: function(){
                        fbButton.applyToSelection(controls,originalSettings);
                        mxBuilder.menuManager.closeTab();
                    }
                });
                
                return thePanel.find(".flexly-collapsable-content").append(theInstance).end();
            },
            setValues: function(controls,settings){
                if(settings.counterPosition !== false){
                    if(settings.counterPosition == "button_count"){
                        controls.counterPositionHr.attr("checked","checked");
                    } else {
                        controls.counterPositionVr.attr("checked","checked");
                    }
                } else {
                    controls.counterPosition.removeAttr("checked");
                }
                if(settings.action !== false){
                    if(settings.action == "like"){
                        controls.actionLike.attr("checked","checked");
                    } else {
                        controls.actionRecommend.attr("checked","checked");
                    }
                } else {
                    controls.action.removeAttr("checked");
                }
            },
             applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    values  = {
                        counterPosition: controls.counterPosition.filter(":checked").val(),
                        action: controls.action.filter(":checked").val()
                    };
                }
                mxBuilder.selection.each(function(){
                    this.setCounterPosition(values.counterPosition);
                    this.setAction(values.action);
                });
            }
        }
    });
    
}(jQuery));