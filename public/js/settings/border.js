(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.border = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-component-border-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand) {
                var border = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Border Settings");

                var theInstance = this._template.clone();
                thePanel.find(".flexly-collapsable-content").append(theInstance);

                //fill in all the controls 
                var controls = {
                    widthSlider: theInstance.find(".border-width-slider"),
                    simulator: theInstance.find(".border-radius-simulator"),
                    picker: theInstance.find(".picker"),
                    symetricCheckbox: theInstance.find("#flexly-component-border-radius-sym"),
                    simulatorSliderTopLeft: theInstance.find(".border-radius-slider-t-l"),
                    simulatorSliderTopRight: theInstance.find(".border-radius-slider-t-r"),
                    simulatorSliderBottomLeft: theInstance.find(".border-radius-slider-b-l"),
                    simulatorSliderBottomRight: theInstance.find(".border-radius-slider-b-r")
                };
                controls.lastChangedRadiusSlider = controls.simulatorSliderTopLeft;

                //Configure the controls here
                controls.picker.customColorpicker();
                controls.symetricCheckbox.checkbox();
                controls.simulatorSliderTopLeft.customSlider({
                    max: 50,
                    min: 0,
                    suffix: "px"
                });
                controls.simulatorSliderBottomLeft.customSlider({
                    max: 50,
                    min: 0,
                    suffix: "px"
                });
                controls.simulatorSliderTopRight.width(50).customSlider({
                    max: 50,
                    min: 0,
                    invert: true,
                    suffix: "px"
                });
                controls.simulatorSliderBottomRight.width(50).customSlider({
                    max: 50,
                    min: 0,
                    invert: true,
                    suffix: "px"
                });
                controls.widthSlider.customSlider({
                    max: 50,
                    min: 0,
                    suffix: "px"
                });

                this.applyToSelectionOn(controls, "picker", "pickerColorChanged");
                this.applyToSelectionOn(controls, "picker", "pickerColorRest");

                this.applyToSelectionOn(controls, "symetricCheckbox", "change", function() {
                    controls.symmetricRadius = $(this).is(":checked");
                    if (controls.symmetricRadius) {
                        var theValue = controls.simulatorSliderTopLeft.customSlider("value");
                        border.setSimRadius(controls, "topLeft", theValue);
                    }
                });
                this.applyToSelectionOn(controls, "simulatorSliderTopLeft", "slide", function(event, ui) {
                    controls.lastChangedRadiusSlider = $(this);
                    border.setSimRadius(controls, "topLeft", ui.value);
                });
                this.applyToSelectionOn(controls, "simulatorSliderBottomLeft", "slide", function(event, ui) {
                    controls.lastChangedRadiusSlider = $(this);
                    border.setSimRadius(controls, "bottomLeft", ui.value);
                });
                this.applyToSelectionOn(controls, "simulatorSliderTopRight", "slide", function(event, ui) {
                    controls.lastChangedRadiusSlider = $(this);
                    border.setSimRadius(controls, "topRight", ui.value);
                });
                this.applyToSelectionOn(controls, "simulatorSliderBottomRight", "slide", function(event, ui) {
                    controls.lastChangedRadiusSlider = $(this);
                    border.setSimRadius(controls, "bottomRight", ui.value);
                });
                this.applyToSelectionOn(controls, "widthSlider", "slide");

                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = [
                    "borderWidth",
                    "borderStyle",
                    "borderColor",
                    "borderTopLeftRadius",
                    "borderTopRightRadius",
                    "borderBottomLeftRadius",
                    "borderBottomRightRadius"];

                var firstPass = true;
                mxBuilder.selection.each(function() {
                    var theSettings = this.getBorder();
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
                        border.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        border.applyToSelection(controls);
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
            setValues: function(controls, values) {
                //implement the setValue function
                if (values.borderColor) {
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.borderColor);
                    controls.picker.customColorpicker("value", colorObj);
                }
                if (values.borderWidth) {
                    values.borderWidth = parseInt(values.borderWidth.replace("px", ""), 10);
                    controls.widthSlider.customSlider("value", values.borderWidth);
                }

                var corners = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
                var isSymetric = true;
                var testCorners = null;
                for (var c in corners) {
                    if (values["border" + corners[c] + "Radius"]) {
                        if (testCorners === null) {
                            testCorners = values["border" + corners[c] + "Radius"];
                        } else if (testCorners !== values["border" + corners[c] + "Radius"]) {
                            isSymetric = false;
                        }
                        values["border" + corners[c] + "Radius"] = parseInt(values["border" + corners[c] + "Radius"].replace("px", ""), 10);
                        this.setSimRadius(controls, corners[c], values["border" + corners[c] + "Radius"]);
                        controls["simulatorSlider" + corners[c]].customSlider("value", values["border" + corners[c] + "Radius"]);
                    } else {
                        isSymetric = false;
                    }
                }
                if (isSymetric) {
                    controls.symetricCheckbox.attr("checked", "checked").trigger("change");
                }
            },
            setSimRadius: function(controls, pos, val) {
                if (controls.symmetricRadius) {
                    controls.simulator.css("border-radius", val);
                    controls.simulator.parent().find(".border-radius-slider-l")
                            .customSlider("value", val)
                            .end()
                            .find(".border-radius-slider-r")
                            .customSlider("value", val);
                } else {
                    controls.simulator.css('border' + pos.uppercaseFirst() + 'Radius', val);
                }
            },
            applyToSelection: function(controls, values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = {
                        borderStyle: "solid"
                    };

                    if (this._settingsTab.hasChanged(controls.widthSlider)) {
                        values.borderWidth = controls.widthSlider.customSlider("value");
                    }
                    if (this._settingsTab.hasChanged(controls.picker)) {
                        values.borderColor = controls.picker.customColorpicker("value").toString();
                    }

                    var val;
                    if (controls.symmetricRadius) {
                        //yes this is intentional so it wont' go to the else statement
                        if (this._settingsTab.hasChanged(controls.lastChangedRadiusSlider)) {
                            val = controls.lastChangedRadiusSlider.customSlider("value");
                            values["borderRadius"] = controls.lastChangedRadiusSlider.hasClass("border-radius-slider-r") ? 50 - val : val;
                        }
                    } else {
                        var corners = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
                        for (var c in corners) {
                            if (this._settingsTab.hasChanged(controls["simulatorSlider" + corners[c]])) {
                                val = controls["simulatorSlider" + corners[c]].customSlider("value");
                                values["border" + corners[c] + "Radius"] = val;
                            }
                        }
                    }
                }

                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setBorder(values);
                });
                mxBuilder.selection.revalidateSelectionContainer();
            },
            applyToSelectionOn: function(controls, controlKey, event, extra) {
                var border = this;
                controls[controlKey].on(event, function() {
                    border._settingsTab.setChanged(controls[controlKey]);
                    if (border._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        border.applyToSelection(controls);
                    }
                });
            }
        };
    });
}(jQuery));
