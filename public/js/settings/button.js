(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.button = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".button-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand) {
                var button = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Button Settings");

                var theInstance = this._template.clone();

                //fill in all the controls 
                var controls = {
                    label: theInstance.find("#button-label"),
                    type: theInstance.find("#button-type")
                };

                this.applyToSelectionOn(controls, "label", "input");
                this.applyToSelectionOn(controls, "type", "change");


                //Configure the controls here

                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["label", "type"];

                var firstPass = true;
                mxBuilder.selection.each(function() {
                    var theSettings = this.getSettings();
                    for (var p in properties) {
                        if (firstPass) {
                            originalSettings[properties[p]] = theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data) {
                            originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });

                this.setValues(controls, originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        button.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        button.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function() {
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function() {
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });

                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values) {
                //implement the setValue function
                if (values.label !== false) {
                    controls.label.val(values.label);
                } else {
                    controls.label.val('');
                }
                if (values.type !== false){
                    controls.type.val(values.type);
                } else {
                    controls.label.append('<option value="none" class="none-option">------</option>').one({
                        change: function(){
                            $(this).find(".none-option").remove();
                        }
                    });
                }
            },
            applyToSelection: function(controls, values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = {};
                    if (this._settingsTab.hasChanged(controls.label)) {
                        values.label = controls.label.val();
                    }
                    if (this._settingsTab.hasChanged(controls.type)){
                        values.type = controls.type.val();
                    }
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    if(typeof values.label !== "undefined"){
                        this.setLabel(values.label);
                    }
                    if(typeof values.type !== "undefined"){
                        this.setType(values.type);
                    }
                });
            },
            applyToSelectionOn: function(controls, controlKey, event, extra) {
                var button = this;
                controls[controlKey].on(event, function() {
                    button._settingsTab.setChanged(controls[controlKey]);
                    if (button._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        button.applyToSelection(controls);
                    }
                });
            }
        };
    });
}(jQuery));