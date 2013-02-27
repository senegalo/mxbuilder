(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.fbButton = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-fb-button-settings"),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var fbButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Facebook Button");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    counterPosition: theInstance.find('.fb-counter-position input'),
                    counterPositionHr: theInstance.find('#fb-count-position-hr'),
                    counterPositionVr: theInstance.find('#fb-count-position-vr'),
                    action: theInstance.find(".fb-action input"),
                    actionLike: theInstance.find("#fb-action-like"),
                    actionRecommend: theInstance.find("#fb-action-recommend")             
                };
                
                
                //Configure the controls here
                this.applyToSelectionOn(controls, "counterPosition", "change");
                this.applyToSelectionOn(controls, "action", "change");
                
                this.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["action","counterPosition"];
                
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
                        fbButton.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        fbButton.applyToSelection(controls);
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
                if(values.counterPosition !== false){
                    if(values.counterPosition == "button_count"){
                        controls.counterPositionHr.attr("checked","checked");
                    } else {
                        controls.counterPositionVr.attr("checked","checked");
                    }
                } else {
                    controls.counterPosition.removeAttr("checked");
                }
                if(values.action !== false){
                    if(values.action == "like"){
                        controls.actionLike.attr("checked","checked");
                    } else {
                        controls.actionRecommend.attr("checked","checked");
                    }
                } else {
                    controls.action.removeAttr("checked");
                }
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    values  = { };
                    if(controls.counterPosition.data("change-monitor")){
                        values.counterPosition = controls.counterPosition.filter(":checked").val();
                    }
                    if(controls.action.data("change-monitor")){
                        values.action = controls.action.filter(":checked").val();
                    }
                }
                mxBuilder.selection.each(function(){
                    if(typeof values.counterPosition != "undefined"){
                        this.setCounterPosition(values.counterPosition);
                    }
                    if(typeof values.action != "undefined"){
                        this.setAction(values.action);
                    }
                    this.rebuild();
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var fbButton = this;
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                controls[controlKey].on(event,function(){
                    controls[controlKey].data("change-monitor",true);
                    if(settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        fbButton.applyToSelection(controls);
                    }
                });
            },
            monitorChangeOnControls: function(controls){
                for(var c in controls){
                    controls[c].data("change-monitor",false);
                }
            }
        }
    });
}(jQuery))