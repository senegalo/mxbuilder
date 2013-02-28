(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.gplusButton = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-gplus-button-settings"),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var gplusButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Google Plus Button");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    sizeSelect: theInstance.find('#gplus-size'),
                    annotation: theInstance.find(".gplus-annotation input"),
                    annotationNone: theInstance.find("#gplus-annotation-none"),
                    annotationHr: theInstance.find("#gplus-annotation-hr"),
                    annotationVr: theInstance.find("#gplus-annotation-vr")
                };
                
                
                //Configure the controls here
                this.applyToSelectionOn(controls, "sizeSelect", "change", function(){
                    if(controls.sizeSelect.val() != "standard" && controls.annotationVr.is(":checked")){
                        controls.annotationHr.attr("checked","checked");
                    }
                });
                this.applyToSelectionOn(controls, "annotation", "change", function(){
                    if(controls.annotationVr.is(":checked")){
                        controls.sizeSelect.val("standard");
                    }
                });
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["size","counterPosition"];
                
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
                        gplusButton.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        gplusButton.applyToSelection(controls);
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
                    controls.annotation.filter('[value="'+values.counterPosition+'"]').attr("checked","checked");
                } else {
                    controls.annotation.removeAttr("checked");
                }
                if(values.size !== false){
                    if(values.counterPosition == "vertical"){
                        values.size = "standard";
                    }
                    controls.sizeSelect.find('[value="'+values.size+'"]').attr("selected","selected");
                } else {
                    controls.sizeSelect.removeAttr("checked")
                    .append('<option class="no-choice">---</option>').one({
                        change: function change(){
                            $(this).find(".not-choice").remove();
                        }
                    });
                }
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    var annotation = controls.annotation.filter(":checked").val();
                    var size = controls.sizeSelect.val();
                    if(this._settingsTab.hasChanged(controls.sizeSelect)){
                        values.size = size;
                    }
                    if(this._settingsTab.hasChanged(controls.annotation)){
                        values.counterPosition = annotation; 
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    if(typeof values.size != "undefined"){
                        this.setSize(values.size);
                    }
                    if(typeof values.counterPosition != "undefined"){
                        this.setCounterPosition(values.counterPosition);
                    }
                    this.rebuild();
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var gplusButton = this;
                controls[controlKey].on(event,function(){
                    gplusButton._settingsTab.setChanged(controls[controlKey]);
                    if(gplusButton._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        gplusButton.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))