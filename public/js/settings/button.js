(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.button = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".button-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: false,
            getPanel: function(expand) {
                var button = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Button Settings");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    label: theInstance.find("#button-label")
                };

                this.applyToSelectionOn("label", "input");


                //Configure the controls here

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["label"];

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

                this.setValues(originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        button.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        button.applyToSelection();
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
            setValues: function(values) {
                //implement the setValue function
                if (values.label !== false) {
                    this._controls.label.val(values.label);
                } else {
                    this._controls.label.val('');
                }
            },
            getValues: function(all, isPicker, sourceEvent, ui) {
                var values = {};

                if (all || this._settingsTab.hasChanged(this._controls.label)) {
                    values.label = this._controls.label.val();
                }

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