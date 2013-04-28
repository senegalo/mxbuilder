(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.color = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".color-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var color = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Color");

                var theInstance = this._template.clone();

                thePanel.find(".flexly-collapsable-content").append(theInstance);

                //fill in all the controls 
                this._controls = {
                    opacitySlider: theInstance.find(".opacity-slider"),
                    colorPicker: theInstance.find(".picker")
                };


                //Configure the controls here
                this._controls.colorPicker.customColorpicker();
                this._controls.opacitySlider.customSlider({
                    min: 0,
                    max: 100,
                    value: 100,
                    suffix: "%"
                });

                this.applyToSelectionOn("colorPicker", "pickerColorChanged", function(event, color) {
                    var sliderVal = color._controls.opacitySlider.customSlider("value");
                    if (sliderVal === 0) {
                        sliderVal = 100;
                        color._controls.opacitySlider.customSlider("value", 100);
                    }
                });
                this.applyToSelectionOn("colorPicker", "pickerColorRest", function() {
                    color._controls.opacitySlider.customSlider("value", 0);
                });
                this.applyToSelectionOn("opacitySlider", "slide");

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["color"];

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
                        color.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        color.applyToSelection();
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
                return thePanel;
            },
            setValues: function(values) {
                //implement the setValue function
                if (values.color) {
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.color);
                    this._controls.colorPicker.customColorpicker("value", colorObj);

                    //setting the opacity slider
                    var opacity = Math.round(colorObj.a * 100);
                    this._controls.opacitySlider.customSlider("value", opacity);
                }
            },
            getValues: function(all, isPicker, sourceEvent, ui) {
                var values = {};

                if (all || this._settingsTab.hasChanged(this._controls.colorPicker) || this._settingsTab.hasChanged(this._controls.opacitySlider)) {
                    //fill up the values array
                    values.color = this._controls.colorPicker.customColorpicker("value");
                    values.color.a = this._controls.opacitySlider.customSlider("value") / 100;
                }

                return {color: values};
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
                var color = this;
                this._controls[controlKey].on(event, function() {
                    color._settingsTab.setChanged(color._controls[controlKey]);
                    if (color._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        color.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));