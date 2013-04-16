(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.border = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-component-border-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var border = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Border Settings");

                var theInstance = this._template.clone();
                thePanel.find(".flexly-collapsable-content").append(theInstance);

                //fill in all the controls 
                this._controls = {
                    widthSlider: theInstance.find(".border-width-slider"),
                    simulator: theInstance.find(".border-radius-simulator"),
                    picker: theInstance.find(".picker"),
                    symetricCheckbox: theInstance.find("#flexly-component-border-radius-sym"),
                    simulatorSliderTopLeft: theInstance.find(".border-radius-slider-t-l"),
                    simulatorSliderTopRight: theInstance.find(".border-radius-slider-t-r"),
                    simulatorSliderBottomLeft: theInstance.find(".border-radius-slider-b-l"),
                    simulatorSliderBottomRight: theInstance.find(".border-radius-slider-b-r")
                };
                this._controls.lastChangedRadiusSlider = this._controls.simulatorSliderTopLeft;

                //Configure the controls here
                this._controls.picker.customColorpicker();
                this._controls.symetricCheckbox.checkbox();
                this._controls.simulatorSliderTopLeft.customSlider({
                    max: 50,
                    min: 0,
                    suffix: "px"
                });
                this._controls.simulatorSliderBottomLeft.customSlider({
                    max: 50,
                    min: 0,
                    suffix: "px"
                });
                this._controls.simulatorSliderTopRight.width(50).customSlider({
                    max: 50,
                    min: 0,
                    invert: true,
                    suffix: "px"
                });
                this._controls.simulatorSliderBottomRight.width(50).customSlider({
                    max: 50,
                    min: 0,
                    invert: true,
                    suffix: "px"
                });
                this._controls.widthSlider.customSlider({
                    max: 50,
                    min: 0,
                    suffix: "px"
                });

                this.applyToSelectionOn("picker", "pickerColorChanged");
                this.applyToSelectionOn("picker", "pickerColorRest");

                this.applyToSelectionOn("symetricCheckbox", "change", function() {
                    border._controls.symmetricRadius = $(this).is(":checked");
                    if (border._controls.symmetricRadius) {
                        var theValue = border._controls.simulatorSliderTopLeft.customSlider("value");
                        border.setSimRadius("topLeft", theValue);
                    }
                });
                this.applyToSelectionOn("simulatorSliderTopLeft", "slide", function(event, ui) {
                    border._controls.lastChangedRadiusSlider = $(this);
                    border.setSimRadius("topLeft", ui.value);
                });
                this.applyToSelectionOn("simulatorSliderBottomLeft", "slide", function(event, ui) {
                    border._controls.lastChangedRadiusSlider = $(this);
                    border.setSimRadius("bottomLeft", ui.value);
                });
                this.applyToSelectionOn("simulatorSliderTopRight", "slide", function(event, ui) {
                    border._controls.lastChangedRadiusSlider = $(this);
                    border.setSimRadius("topRight", ui.value);
                });
                this.applyToSelectionOn("simulatorSliderBottomRight", "slide", function(event, ui) {
                    border._controls.lastChangedRadiusSlider = $(this);
                    border.setSimRadius("bottomRight", ui.value);
                });
                this.applyToSelectionOn("widthSlider", "slide");

                this._settingsTab.monitorChangeOnControls(this._controls);
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

                this.setValues(originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        border.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        border.applyToSelection();
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
                if (values.borderColor) {
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.borderColor);
                    this._controls.picker.customColorpicker("value", colorObj);
                }
                if (values.borderWidth) {
                    values.borderWidth = parseInt(values.borderWidth.replace("px", ""), 10);
                    this._controls.widthSlider.customSlider("value", values.borderWidth);
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
                        this.setSimRadius(corners[c], values["border" + corners[c] + "Radius"]);
                        this._controls["simulatorSlider" + corners[c]].customSlider("value", values["border" + corners[c] + "Radius"]);
                    } else {
                        isSymetric = false;
                    }
                }
                if (isSymetric) {
                    this._controls.symetricCheckbox.attr("checked", "checked").trigger("change");
                }
            },
            getValues: function(all) {
                //if no values passed how to do we get the values ?
                var values = {
                    borderStyle: "solid"
                };

                if (all || this._settingsTab.hasChanged(this._controls.widthSlider)) {
                    values.borderWidth = this._controls.widthSlider.customSlider("value");
                }
                if (all || this._settingsTab.hasChanged(this._controls.picker)) {
                    values.borderColor = this._controls.picker.customColorpicker("value").toString();
                }

                var val;
                if (this._controls.symmetricRadius) {
                    //yes this is intentional so it wont' go to the else statement
                    if (all || this._settingsTab.hasChanged(this._controls.lastChangedRadiusSlider)) {
                        val = this._controls.lastChangedRadiusSlider.customSlider("value");
                        values["borderRadius"] = this._controls.lastChangedRadiusSlider.hasClass("border-radius-slider-r") ? 50 - val : val;
                    }
                } else {
                    var corners = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
                    for (var c in corners) {
                        if (all || this._settingsTab.hasChanged(this._controls["simulatorSlider" + corners[c]])) {
                            val = this._controls["simulatorSlider" + corners[c]].customSlider("value");
                            values["border" + corners[c] + "Radius"] = val;
                        }
                    }
                }
                return { border: values }; 
            },
            setSimRadius: function(pos, val) {
                if (this._controls.symmetricRadius) {
                    this._controls.simulator.css("border-radius", val);
                    this._controls.simulator.parent().find(".border-radius-slider-l")
                            .customSlider("value", val)
                            .end()
                            .find(".border-radius-slider-r")
                            .customSlider("value", val);
                } else {
                    this._controls.simulator.css('border' + pos.uppercaseFirst() + 'Radius', val);
                }
            },
            applyToSelection: function(values) {
                if(typeof values === "undefined"){
                    values = this.getValues(this._controls);
                }
                mxBuilder.selection.each(function(){
                    this.setSettings(values);
                });
                mxBuilder.selection.revalidateSelectionContainer();
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var border = this;
                this._controls[controlKey].on(event, function() {
                    border._settingsTab.setChanged(border._controls[controlKey]);
                    if (border._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        border.applyToSelection(this._controls);
                    }
                });
            }
        };
    });
}(jQuery));
