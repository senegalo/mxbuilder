(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.button = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".button-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
<<<<<<< HEAD
=======
            _controls: null,
            hasPicker: false,
>>>>>>> feature-13
            getPanel: function(expand) {
                var button = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Button Settings");

                var theInstance = this._template.clone();

                //fill in all the controls 
<<<<<<< HEAD
                var controls = {
                    label: theInstance.find("#button-label"),
                    type: theInstance.find("#button-type")
                };

                this.applyToSelectionOn(controls, "label", "input");
                this.applyToSelectionOn(controls, "type", "change");
=======
                this._controls = {
                    label: theInstance.find("#button-label")
                };

                this.applyToSelectionOn("label", "input");
>>>>>>> feature-13


                //Configure the controls here

<<<<<<< HEAD
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["label", "type"];
=======
                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["label"];
>>>>>>> feature-13

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

<<<<<<< HEAD
                this.setValues(controls, originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        button.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        button.applyToSelection(controls);
=======
                this.setValues(originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        button.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        button.applyToSelection();
>>>>>>> feature-13
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
<<<<<<< HEAD
            setValues: function(controls, values) {
                //implement the setValue function
                if (values.label !== false) {
                    controls.label.val(values.label);
=======
            setValues: function(values) {
                //implement the setValue function
                if (values.label !== false) {
                    this._controls.label.val(values.label);
>>>>>>> feature-13
                } else {
                    this._controls.label.val('');
                }
            },
            getValues: function(all, isPicker, sourceEvent, ui) {
                var values = {};

                if (all || this._settingsTab.hasChanged(this._controls.label)) {
                    values.label = this._controls.label.val();
                }
<<<<<<< HEAD
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
=======

                return {button: values};
            },
            applyToSelection: function(values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = this.getValues();
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var button = this;
                this._controls[controlKey].on(event, function() {
                    button._settingsTab.setChanged(button._controls[controlKey]);
>>>>>>> feature-13
                    if (button._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        button.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));