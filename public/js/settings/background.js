(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.background = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-component-background-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(settings) {
                var background = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(settings.expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Background Settings");

                var theInstance = this._template.clone();

                thePanel.find(".flexly-collapsable-content").append(theInstance);

                //fill in all the controls 
                this._controls = {
                    opacitySlider: theInstance.find(".opacity-slider"),
                    patterns: theInstance.find(".patterns"),
                    picker: theInstance.find(".picker"),
                    scaleSlider: theInstance.find(".scale-slider"),
                    thePanel: thePanel,
                    patternsContainer: theInstance.find(".pattern-settings")
                };

                //Configure the controls here
                this._controls.picker.customColorpicker();
                this._controls.scaleSlider.customSlider({
                    min: 10,
                    max: 200,
                    step: 10,
                    suffix: "px"
                });
                this._controls.opacitySlider.customSlider({
                    min: 0,
                    max: 100,
                    value: 100,
                    suffix: "%"
                });

                this._controls.samples = $('<div class="pattern-sample pattern-image-none pattern-sample-0">No Pattern</div>')
                        .data("flexly-pattern-index", -1)
                        .appendTo(this._controls.patterns);
                for (var i = 0; i < 11; i++) {
                    this._controls.samples = this._controls.samples.add($('<div class="pattern-sample pattern-image pattern-sample-' + (i + 1) + '" style="background-position-y:-' + (i * 60) + 'px;"/>')
                            .data("flexly-pattern-index", i)
                            .appendTo(this._controls.patterns));
                }
                this._controls.patterns.jqueryScrollbar();
                thePanel.on({
                    panelOpen: function() {
                        background._controls.patterns.jqueryScrollbar("update");
                    }
                });
                if (settings.expand) {
                    thePanel.trigger("panelOpen");
                }

                this.applyToSelectionOn("picker", "pickerColorChanged", function(event, color) {
                    var sliderVal = background._controls.opacitySlider.customSlider("value");
                    if (sliderVal === 0) {
                        sliderVal = 100;
                        background._controls.opacitySlider.customSlider("value", 100);
                    }
                });
                this.applyToSelectionOn("picker", "pickerColorRest", function() {
                    background._controls.opacitySlider.customSlider("value", 0);
                });
                this.applyToSelectionOn("scaleSlider", "slide");
                this.applyToSelectionOn("opacitySlider", "slide");
                this.applyToSelectionOn("samples", "click", function() {
                    var element = $(this);
                    background._controls.patterns.data("change-monitor", true).find(".selected").removeClass("selected");
                    element.addClass("selected");
                });

                if (settings.hidePattern) {
                    this._controls.patternsContainer.hide();
                }


                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["backgroundColor",
                    "backgroundImage",
                    "backgroundSize"];

                var firstPass = true;
                mxBuilder.selection.each(function() {
                    var theSettings = this.getBackground();
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
                        background.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        background.applyToSelection();
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
                if (values.backgroundColor) {
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.backgroundColor);

                    //setting the color picker
                    this._controls.picker.customColorpicker("value", colorObj);

                    //setting the opacity slider
                    var opacity = Math.round(colorObj.a * 100);
                    this._controls.opacitySlider.customSlider("value", opacity);
                }
                if (values.backgroundSize) {
                    if (values.backgroundSize === "auto" || values.backgroundSize === "100% 100%") {
                        scale = 60;
                    } else {
                        var scale = values.backgroundSize.split(" ")[0].replace("%", "");
                        try {
                            scale = parseInt(scale);
                        } catch (e) {
                            scale = 60;
                        }
                    }
                    this._controls.scaleSlider.customSlider("value", scale);
                }
                if (values.backgroundImage) {
                    var matches = values.backgroundImage.match(/(\d*)(?=\.png)/im);
                    var match = matches === null ? "0" : matches[0];

                    this._controls.samples.filter(".pattern-sample-" + match).trigger("click");
                    var background = this;
                    this._controls.thePanel.on({
                        panelOpen: function() {
                            var theSelected = background._controls.samples.filter(".pattern-sample-" + match).trigger("click");
                            background._controls.patterns.jqueryScrollbar("scrollTo", match * theSelected.outerHeight(), false);
                        }
                    });
                }
            },
            getValues: function(all) {
                var values = {};

                //Applying the background color
                if (all || this._settingsTab.hasChanged(this._controls.picker) || this._settingsTab.hasChanged(this._controls.opacitySlider)) {
                    var backgroundColor = this._controls.picker.customColorpicker("value");
                    backgroundColor.a = this._controls.opacitySlider.customSlider("value") / 100;
                    values.backgroundColor = backgroundColor.toString();
                }

                //Applying the pattern
                if (all || this._settingsTab.hasChanged(this._controls.patterns)) {
                    var pattern = this._controls.patterns.find(".selected");//.data("flexly-pattern-index");
                    if (pattern.length > 0 && pattern.data("flexly-pattern-index") !== -1) {
                        values.backgroundImage = 'url("public/images/patterns/pat' + (pattern.data("flexly-pattern-index") + 1) + '.png")';
                    } else {
                        values.backgroundImage = "none";
                    }
                }

                //Applying the size
                if (all || this._settingsTab.hasChanged(this._controls.scaleSlider)) {
                    values.backgroundSize = this._controls.scaleSlider.customSlider("value");
                }

                return {
                    background: values
                };
            },
            applyToSelection: function(values) {
                values = this.getValues();
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var background = this;
                this._controls[controlKey].on(event, function() {
                    background._settingsTab.setChanged(background._controls[controlKey]);
                    if (background._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        background.applyToSelection(background._controls);
                    }
                });
            }
        };
    });
}(jQuery));
