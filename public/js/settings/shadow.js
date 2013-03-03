(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.shadow = {
            //update the template variable
            _shadowTemplate: mxBuilder.layout.templates.find(".shadow-settings").find(".shadow-demo-box").remove(),
            _template: mxBuilder.layout.templates.find(".shadow-settings").remove(),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var shadow = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Shadow Settings");
                
                var theInstance = this._template.clone().appendTo(thePanel.find(".flexly-collapsable-content"));
                
                //fill in all the controls 
                var controls = {
                    shadowContainer: theInstance.find(".shadow-container"),
                    shadowBoxes: $()
                };
                
                
                //Configure the controls here
                
                this._shadowTemplate.clone().data({
                    id: "none"
                })
                .text("No Shadow")
                .addClass("shadow-none")
                .appendTo(controls.shadowContainer);
                
                mxBuilder.shadowManager.each(function(){
                    var shadowDemo = shadow._shadowTemplate.clone()
                    .addClass("shadow-"+this.id)
                    .data("id",this.id)
                    .appendTo(controls.shadowContainer);
                    mxBuilder.shadowManager.applyShadow({
                        id: this.id,
                        element: shadowDemo.find(".shadow")
                    });
                    controls.shadowBoxes = controls.shadowBoxes.add(shadowDemo);
                });
                
                this.applyToSelectionOn(controls, "shadowBoxes", "click", function(){
                    controls.shadowContainer.find(".selected").removeClass("selected");
                    $(this).addClass("selected");
                });
                controls.shadowContainer.jqueryScrollbar();
                
                thePanel.on({
                    panelOpen: function(){
                        controls.shadowContainer.jqueryScrollbar("update");
                    }
                });
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    if(firstPass){
                        originalSettings.shadow = this.shadow;
                    }
                    if (originalSettings.shadow !== this.shadow){
                        originalSettings.shadow = false;
                    }
                    firstPass = false;
                });
                
                this.setValues(controls,originalSettings);
                
                thePanel.on({
                    previewEnabled: function(){
                        shadow.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        shadow.applyToSelection(controls);
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
                var klass;
                if(values.shadow && values.shadow != "none") {
                    klass = ".shadow-"+values.shadow;
                } else {
                    klass = ".shadow-none";
                }
                controls.shadowContainer.find(klass).addClass("selected")
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    if(this._settingsTab.hasChanged(controls.shadowBoxes)){
                        //fill up the values array
                        values.shadow= controls.shadowContainer.find(".selected").data("id");
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    if(values.shadow && values.shadow != "none"){
                        mxBuilder.selection.each(function(){
                            this.setShadow(values.shadow);
                        });
                    } else {
                        mxBuilder.selection.each(function(){
                            this.removeShadow();
                        });
                    }
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var shadow = this;
                controls[controlKey].on(event,function(){
                    shadow._settingsTab.setChanged(controls[controlKey]);
                    if(shadow._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        shadow.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))