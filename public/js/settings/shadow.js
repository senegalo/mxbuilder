(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.shadow = {
            //update the template variable
            _shadowTemplate: mxBuilder.layout.templates.find(".shadow-settings").find(".shadow-demo-box").remove(),
            _template: mxBuilder.layout.templates.find(".shadow-settings").remove(),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var shadow = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Shadow Settings");
                
                var theInstance = this._template.clone().appendTo(thePanel.find(".flexly-collapsable-content"));
                
                //fill in all the controls 
                var controls = {
                    shadowContainer: theInstance.find(".shadow-container")
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
                });
                
                controls.shadowContainer.jqueryScrollbar().on({
                    click: function click(){
                        controls.shadowContainer.find(".selected").removeClass("selected");
                        $(this).addClass("selected");
                        if(settingsTab.isPreview()){
                            shadow.applyToSelection(controls);
                        }
                    }
                },".shadow-demo-box");
                
                thePanel.on({
                    panelOpen: function(){
                        controls.shadowContainer.jqueryScrollbar("update");
                    }
                });
                
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
                        shadow.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        shadow.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                return thePanel;
            },
            setValues: function(controls, values){  
                var klass;
                if(values.shadow && values.shadow != "none") {
                    klass = ".shadow-"+values.shadow;
                } else {
                    klass = ".shadow-none";
                }
                controls.shadowContainer.find(klass).addClass("selected")
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    values = {
                        shadow: controls.shadowContainer.find(".selected").data("id")
                    };
                }
                if(values.shadow && values.shadow != "none"){
                    mxBuilder.selection.each(function(){
                        this.setShadow(values.shadow);
                    });
                } else {
                    mxBuilder.selection.each(function(){
                        this.removeShadow();
                    });
                }
            },
            applyToSelectionOn: function applyToSelectionOn(controls,controlKey,event,extra){
                var shadow = this;
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                controls[controlKey].on(event,function(){
                    if(settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.call();
                        }
                        shadow.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))